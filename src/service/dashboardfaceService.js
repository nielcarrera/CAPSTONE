// src/service/dashboardfaceService.js

import { supabase } from "../lib/supabaseClient";

/**
 * Fetch all unique analysis dates for face‐impurity entries belonging to this user.
 * Returns an array of strings in 'YYYY-MM-DD' format, sorted descending (newest first).
 */
export async function fetchAvailableAnalysisDates(userId) {
  const { data, error } = await supabase
    .from("saved_impurity")
    .select("saved_face_impurity(analysis_date)")
    .eq("user_id", userId)
    .eq("kind", "face")
    .order("analysis_date", {
      ascending: false,
      foreignTable: "saved_face_impurity",
    });

  if (error) {
    throw error;
  }

  // Map → filter out both null and undefined
  const dates = data
    .map((row) => row.saved_face_impurity?.analysis_date)
    .filter((d) => d !== null && d !== undefined);

  // Deduplicate & return
  return [...new Set(dates)];
}

/**
 * Fetch all face‐impurity + percentage rows for a given userId and analysis_date.
 * Returns an array of objects: { impurity, percentage }.
 */
export async function fetchImpurityDataByDate(userId, date) {
  if (!date) return [];

  const { data, error } = await supabase
    .from("saved_impurity")
    .select(
      `
      saved_face_impurity(
        impurity,
        percentage
      )
    `
    )
    .eq("user_id", userId)
    .eq("kind", "face")
    .eq("saved_face_impurity.analysis_date", date);

  if (error) {
    throw error;
  }

  return data
    .map((row) => row.saved_face_impurity)
    .filter((item) => item !== null);
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
