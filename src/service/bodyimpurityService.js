// src/service/bodyimpurityService.js

import { supabase } from "../lib/supabaseClient";

/**
 * Fetch all saved body impurities for a given user.
 */
const fetchSavedImpurities = async (userId) => {
  const kind = "body";
  const { data, error } = await supabase
    .from("saved_impurity")
    .select(
      `
      id,
      user_id,
      kind,
      saved_body_impurity (
        id,
        body_impurity_id,
        detected_at,
        body_impurities (
          id,
          name,
          description
        )
      )
    `
    )
    .eq("user_id", userId)
    .eq("kind", kind)
    .order("detected_at", {
      referencedTable: "saved_body_impurity",
      ascending: false,
    });

  if (error) throw error;
  return data;
};

export { fetchSavedImpurities };
