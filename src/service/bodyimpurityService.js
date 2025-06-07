// src/service/bodyimpurityService.js

import { supabase } from "../lib/supabaseClient";

/**
 * Fetch all saved body impurities for a given user.
 */
export async function fetchUserBodyImpurities(userId) {
  const { data, error } = await supabase
    .from("saved_impurity")
    .select(
      `
      id,
      created_at,
      saved_body_impurity (
        detected_at,
        body_impurities (
          id,
          name,
          description,
          common_locations,
          prevalence,
           image
        )
      )
    `
    )
    .eq("user_id", userId)
    .eq("kind", "body");

  if (error) throw error;
  return data;
}
