import { supabase } from "../../lib/supabaseClient";

/**
 * Fetches all unique analysis dates for a user.
 * @param {string} userId - The UUID of the user.
 * @returns {Promise<string[]>} - An array of dates ('YYYY-MM-DD'), newest first.
 */
export async function fetchAvailableAnalysisDates(userId) {
  const { data, error } = await supabase
    .from("saved_face_impurity")
    .select("analysis_date, saved_impurity!inner(user_id)")
    .eq("saved_impurity.user_id", userId)
    .order("analysis_date", { ascending: false });

  if (error) {
    console.error("Error fetching analysis dates:", error);
    throw error;
  }

  // Get unique dates from the result
  const dates = data.map((r) => r.analysis_date).filter(Boolean);
  return [...new Set(dates)];
}

/**
 * Fetches all impurity data for a given user and date.
 * @param {string} userId - The UUID of the user.
 * @param {string} date - The analysis date to filter by.
 * @returns {Promise<{impurity: string, percentage: number}[]>} - Array of impurity objects.
 */
export async function fetchImpurityDataByDate(userId, date) {
  if (!date) return [];

  const { data, error } = await supabase
    .from("saved_face_impurity")
    .select("impurity, percentage, saved_impurity!inner(user_id)")
    .eq("saved_impurity.user_id", userId)
    .eq("analysis_date", date);

  if (error) {
    console.error("Error fetching impurity data by date:", error);
    throw error;
  }

  return data.map(({ impurity, percentage }) => ({ impurity, percentage }));
}
