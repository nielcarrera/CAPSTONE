// src/service/dashboardfaceService.js

import { supabase } from "../lib/supabaseClient";

/**
 * Fetch all unique analysis dates for face‐impurity entries belonging to this user.
 * Returns an array of strings in 'YYYY-MM-DD' format, sorted descending (newest first).
 */
export async function fetchAvailableAnalysisDates(userId) {
  // We assume you have a foreign‐key relationship saved_face_impurity.saved_impurity_id → saved_impurity.id
  // Supabase will let you drill into that parent record:
  const { data, error } = await supabase
    .from("saved_face_impurity")
    .select(
      `
      analysis_date,
      saved_impurity ( user_id )
    `
    )
    .eq("saved_impurity.user_id", userId)
    .order("analysis_date", { ascending: false });

  if (error) throw error;

  // Pull out just the dates, dedupe & return
  const dates = data.map((r) => r.analysis_date).filter(Boolean);
  return [...new Set(dates)];
}

/**
 * Fetch all face‐impurity + percentage rows for a given userId and analysis_date.
 * Returns an array of objects: { impurity, percentage }.
 */
export async function fetchImpurityDataByDate(userId, date) {
  if (!date) return [];
  const { data, error } = await supabase
    .from("saved_face_impurity")
    .select(
      `
      impurity,
      percentage,
      analysis_date,
      saved_impurity!inner(user_id)
      `
    )
    .eq("analysis_date", date)
    .eq("saved_impurity.user_id", userId);

  if (error) throw error;
  // Only keep needed fields
  return data.map(({ impurity, percentage }) => ({ impurity, percentage }));
}

// ── Insert one “face” analysis (parent + children) ────────────────────────────

/*
       export async function insertFaceAnalysis(
  userId,
  analysisDate,
  impuritiesArray
) {
  // impuritiesArray should look like:
  // [ { impurity: "Acne",     percentage: 0.42 },
  //   { impurity: "Blackheads",percentage: 0.15 },
  //   …etc… ]

  const { data, error } = await supabase.from("saved_impurity").insert(
    [
      {
        user_id: userId,
        kind: "face",
        // Nest child rows under the SAME key you query later ("saved_face_impurity"):
        saved_face_impurity: impuritiesArray.map((imp) => ({
          analysis_date: analysisDate,
          impurity: imp.impurity,
          percentage: imp.percentage,
        })),
      },
    ],
    {
      // return the inserted rows so you can inspect if needed
      returning: "representation",
    }
  );

  if (error) {
    console.error("InsertFaceAnalysis error:", error);
    throw error;
  }

  return data; // The newly‐created parent + children
}
*/
