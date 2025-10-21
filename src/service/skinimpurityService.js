// skinimpurityService.js
import { supabase } from "../lib/supabaseClient";

export async function fetchMostRecentImpurityResults(userId) {
  // Step 1: Get the latest analysis date
  const { data: dateResult, error: dateError } = await supabase
    .from("saved_impurity_results")
    .select("analysis_date")
    .eq("user_id", userId)
    .order("analysis_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (dateError || !dateResult?.analysis_date) {
    console.error("Failed to fetch recent analysis date", dateError);
    return [];
  }

  const latestDate = dateResult.analysis_date;

  // Step 2: Fetch impurity records for that date
  const { data, error } = await supabase
    .from("saved_impurity_results")
    .select("impurity, percentage")
    .eq("user_id", userId)
    .eq("analysis_date", latestDate);

  if (error) {
    console.error("Error fetching impurity results", error);
    return [];
  }

  return data;
}

export async function fetchImpurityResultsByDate(userId, date) {
  const { data, error } = await supabase
    .from("saved_impurity_results")
    .select("impurity, percentage")
    .eq("user_id", userId)
    .eq("analysis_date", date);

  if (error) {
    console.error("Error fetching impurity results by date", error);
    return [];
  }

  return data;
}

export async function fetchAvailableAnalysisDates(userId) {
  const { data, error } = await supabase
    .from("saved_impurity_results")
    .select("analysis_date")
    .eq("user_id", userId)
    .order("analysis_date", { ascending: false });

  if (error) {
    console.error("Error fetching available dates", error);
    return [];
  }

  // Remove duplicates
  const uniqueDates = [...new Set(data.map((entry) => entry.analysis_date))];
  return uniqueDates;
}
