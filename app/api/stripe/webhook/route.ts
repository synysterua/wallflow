import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  if (event.type === "checkout.session.completed") {
    // Upgrade: activate Pro
    const session = event.data.object as Stripe.Checkout.Session;
    const workspaceId = session.metadata?.["workspace_id"];
    if (workspaceId) {
      await supabase
        .from("workspaces")
        .update({ plan: "pro", stripe_customer_id: session.customer as string })
        .eq("id", workspaceId);
    }
  } else if (
    event.type === "customer.subscription.deleted" ||
    event.type === "customer.subscription.updated"
  ) {
    // Downgrade: subscription canceled, unpaid, or past_due -> back to Free
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    const isInactive =
      event.type === "customer.subscription.deleted" ||
      ["canceled", "unpaid", "incomplete_expired", "past_due"].includes(sub.status);

    if (customerId && isInactive) {
      await supabase
        .from("workspaces")
        .update({ plan: "free" })
        .eq("stripe_customer_id", customerId);
    }
  }

  return NextResponse.json({ received: true });
}
