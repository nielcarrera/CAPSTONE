// src/service/landingPageService.js
import { supabase } from "../lib/supabaseClient";

export const fetchUserDetails = async (userId) => {
  const { data, error } = await supabase
    .from("user_details")
    .select("first_name")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const fetchUserSkinType = async (userId) => {
  const { data, error } = await supabase
    .from("user_skintype")
    .select("skintype")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.skintype || null;
};

export const fetchRecentProducts = async (limit = 6) => {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
          id,
          name,
          product_details (
            image,
            area
          )
        `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  console.log("fetchRecentProducts Supabase result:", data);
  return data;
};

export const fetchMostRecentSavedImpurityResults = async (userId) => {
  try {
    // Step 1: Get the latest analysis date
    const { data: latestDateRow, error: dateError } = await supabase
      .from("saved_impurity_results")
      .select("analysis_date")
      .eq("user_id", userId)
      .order("analysis_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (dateError) {
      console.error("❌ Error fetching analysis date:", dateError);
      return [];
    }

    if (!latestDateRow || !latestDateRow.analysis_date) {
      console.warn("⚠️ No recent analysis date found.");
      return [];
    }

    const latestDate = latestDateRow.analysis_date;

    // Step 2: Fetch impurity results for that date
    const { data: results, error: resultError } = await supabase
      .from("saved_impurity_results")
      .select("impurity, percentage")
      .eq("user_id", userId)
      .eq("analysis_date", latestDate);

    if (resultError) {
      console.error("❌ Error fetching impurity results:", resultError);
      return [];
    }

    // Step 3: Map it to { label, value }
    return results.map((item) => ({
      label: item.impurity,
      value: Math.round(item.percentage), // ✅ Rounded off
    }));
  } catch (error) {
    console.error(
      "❌ Exception in fetchMostRecentSavedImpurityResults:",
      error
    );
    return [];
  }
};
