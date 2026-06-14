import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const DEMO_TOKEN = "cafecafe000000000000000000000000";

const TESTIMONIALS = [
  {
    author_name: "Sarah Chen",
    author_title: "Head of Marketing, Prism Labs",
    content:
      "Wallflow transformed how we collect social proof. We went from chasing customers for quotes to having a steady stream of authentic testimonials. Our landing page conversion rate jumped 24% within the first month.",
    rating: 5,
  },
  {
    author_name: "Marcus Johnson",
    author_title: "Founder, Launchpad SaaS",
    content:
      "The embed snippet literally took 30 seconds. I pasted it into our homepage and had a beautiful wall of love up before lunch. This is exactly the kind of tool indie hackers need.",
    rating: 5,
  },
  {
    author_name: "Priya Nair",
    author_title: "Growth Lead, Orbit Analytics",
    content:
      "We tried building our own testimonial system. Two weeks of dev time later, we found Wallflow. Should have started here. The moderation dashboard is clean and the widget looks stunning.",
    rating: 5,
  },
  {
    author_name: "David Okafor",
    author_title: "CEO, Stackwave",
    content:
      "Simple product that does exactly what it promises. No bloat, no setup headaches. The collect form is clean enough that customers actually fill it out.",
    rating: 4,
  },
  {
    author_name: "Lena Hoffmann",
    author_title: "Product Designer",
    content:
      "The widget design is tasteful and doesn't clash with our brand. Custom accent colors on Pro made it feel native to our site. Highly recommend.",
    rating: 5,
  },
  {
    author_name: "Tom Reyes",
    author_title: "Co-founder, Crisp CRM",
    content:
      "We needed something live in under a day for a product launch. Wallflow delivered. Setup was painless and the testimonials from our beta users looked great.",
    rating: 4,
  },
  {
    author_name: "Aisha Williams",
    author_title: "Marketing Manager, Bloom Health",
    content:
      "What I love most is that every testimonial goes through approval before it appears publicly. That control matters when you're in a regulated industry. Solid, trustworthy product.",
    rating: 5,
  },
];

async function seed() {
  console.log("Seeding Wallflow demo workspace…");

  // Upsert demo workspace
  const { data: existing } = await supabase
    .from("workspaces")
    .select("id")
    .eq("public_token", DEMO_TOKEN)
    .single();

  let workspaceId: string;

  if (existing) {
    workspaceId = existing.id;
    console.log(`Using existing workspace: ${workspaceId}`);
  } else {
    const { data: created, error } = await supabase
      .from("workspaces")
      .insert({
        name: "Acme Demo",
        public_token: DEMO_TOKEN,
        plan: "free",
        owner_id: null, // demo workspace has no owner
        settings: { layout: "grid", accent: "#4f46e5", watermark: true },
      })
      .select("id")
      .single();

    if (error || !created) {
      console.error("Failed to create workspace:", error?.message);
      process.exit(1);
    }

    workspaceId = created.id;
    console.log(`Created demo workspace: ${workspaceId}`);
  }

  // Delete existing testimonials for this workspace
  await supabase.from("testimonials").delete().eq("workspace_id", workspaceId);

  // Insert all testimonials as approved
  const rows = TESTIMONIALS.map((t) => ({
    ...t,
    workspace_id: workspaceId,
    status: "approved",
    source: "seed",
  }));

  const { error: insertError } = await supabase.from("testimonials").insert(rows);

  if (insertError) {
    console.error("Failed to insert testimonials:", insertError.message);
    process.exit(1);
  }

  console.log(`✓ Inserted ${rows.length} approved testimonials.`);
  console.log(`\nDemo URLs:`);
  console.log(`  Widget: http://localhost:3000/widget/${DEMO_TOKEN}`);
  console.log(`  Collect: http://localhost:3000/collect/${DEMO_TOKEN}`);
  console.log(`\nDone!`);
}

seed().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
