import { createServiceClient } from "@/lib/supabase/server";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

export async function checkRateLimit(key: string): Promise<boolean> {
  const supabase = createServiceClient();

  // Atomic increment in Postgres (no TOCTOU race under concurrency)
  const { data, error } = await supabase.rpc("increment_rate_limit", {
    p_key: key,
    p_window_ms: WINDOW_MS,
    p_max: MAX_REQUESTS,
  });

  // Fail closed on error
  if (error) return false;

  // Probabilistic cleanup (~5% of calls) to keep the table small without
  // a per-request table scan.
  if (Math.random() < 0.05) {
    const cutoff = new Date(Date.now() - 2 * WINDOW_MS).toISOString();
    void supabase.from("rate_limits").delete().lt("window_start", cutoff);
  }

  return data === true;
}
