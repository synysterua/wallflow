import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BillingClient from "./BillingClient";

export const dynamic = "force-dynamic";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const service = createServiceClient();
  const { data: workspaces } = await service
    .from("workspaces")
    .select("id, plan")
    .eq("owner_id", user.id)
    .limit(1);

  const workspace = workspaces?.[0] ?? null;
  if (!workspace) redirect("/dashboard");

  const stripeConfigured = !!(
    process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
  );

  return (
    <BillingClient
      plan={workspace.plan}
      stripeConfigured={stripeConfigured}
      success={params.success === "1"}
      canceled={params.canceled === "1"}
    />
  );
}
