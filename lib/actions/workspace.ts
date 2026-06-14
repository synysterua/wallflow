"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateWorkspaceName(
  name: string
): Promise<{ error?: string }> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const trimmed = name.trim().slice(0, 100);
  if (!trimmed) return { error: "Name cannot be empty" };

  const { error } = await supabase
    .from("workspaces")
    .update({ name: trimmed })
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  return {};
}
