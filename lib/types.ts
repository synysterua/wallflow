export type Plan = "free" | "pro";

export interface WidgetSettings {
  layout: "grid" | "carousel" | "single";
  accent: string;
  watermark: boolean;
}

export interface Workspace {
  id: string;
  owner_id: string;
  name: string;
  public_token: string;
  plan: Plan;
  stripe_customer_id: string | null;
  settings: WidgetSettings;
  created_at: string;
}

export type TestimonialStatus = "pending" | "approved" | "hidden";

export interface Testimonial {
  id: string;
  workspace_id: string;
  author_name: string;
  author_title: string | null;
  author_avatar_url: string | null;
  content: string;
  rating: number | null;
  source: string;
  status: TestimonialStatus;
  ai_score: number | null;
  ai_flags: string[];
  created_at: string;
}
