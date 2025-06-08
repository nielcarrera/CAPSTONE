// src/service/analysisDataService.js

// ✅ Add this line:
import { supabase } from "../lib/supabaseClient";
import {
  fetchAvailableAnalysisDates,
  fetchImpurityDataByDate,
} from "./dashboardfaceService";

// List all impurities you care about (same as in your dummy structure)
const ALL_IMPURITIES = [
  "Whiteheads",
  "Pores",
  "Redness",
  "Acne",
  "Blackheads",
  "Wrinkles",
  "Dark Circles",
];

// Main loader
export async function loadAnalysisData(userId) {
  const result = {};

  const dates = await fetchAvailableAnalysisDates(userId);
  console.log("🚀 [DEBUG] fetchAvailableAnalysisDates returned:", dates);
  if (!dates.length) {
    return {};
  }

  for (const date of dates) {
    const rawData = await fetchImpurityDataByDate(userId, date);

    // Build an impurity map: { "Acne": 60, ... }
    const impurityMap = {};
    rawData.forEach((row) => {
      impurityMap[row.impurity] = Math.round(row.percentage);
    });

    // Fill data, fallback to 0 if not in rawData
    result[date] = {
      keyProblems: Object.entries(impurityMap)
        .map(([label, value]) => ({
          label,
          value,
          severity: value >= 75 ? "severe" : value >= 50 ? "moderate" : "mild",
        }))
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 3),
      radarData: ALL_IMPURITIES.map((subject) => ({
        subject,
        A: impurityMap[subject] || 0,
      })),
      analytics: ALL_IMPURITIES.map((label) => ({
        label,
        value: impurityMap[label] || 0,
      })),
      impurities: ALL_IMPURITIES.map((label) => ({
        label,
        value: impurityMap[label] || 0,
      })),
    };
  }
  console.log("🚀 [DEBUG] final loadAnalysisData result:", result);
  return result;
}

/*
export async function insertFaceAnalysis(
  userId,
  analysisDate,
  impuritiesArray
) {
  // ── STEP 1: Insert parent WITHOUT returning
  const { error: parentError } = await supabase
    .from("saved_impurity")
    .insert([{ user_id: userId, kind: "face" }], { returning: "minimal" });

  if (parentError) {
    console.error("Insert saved_impurity error:", parentError);
    throw parentError;
  }

  // ── STEP 1b: Query for the newest parent row to get its ID ─────────────────────
  const { data: parents, error: selectError } = await supabase
    .from("saved_impurity")
    .select("id")
    .eq("user_id", userId)
    .eq("kind", "face")
    .order("created_at", { ascending: false })
    .limit(1);

  if (selectError || !parents || parents.length === 0) {
    console.error("Failed to retrieve new saved_impurity.id:", selectError);
    throw selectError || new Error("No parent row found after insert");
  }

  const parentId = parents[0].id;

  // ── STEP 2: Insert child rows using that parentId ───────────────────────────────
  const childRows = impuritiesArray.map((imp) => ({
    saved_impurity_id: parentId,
    analysis_date: analysisDate,
    impurity: imp.impurity,
    percentage: imp.percentage,
  }));

  const { data: childData, error: childError } = await supabase
    .from("saved_face_impurity")
    .insert(childRows, { returning: "representation" });

  if (childError) {
    console.error("Insert saved_face_impurity error:", childError);
    throw childError;
  }

  return { parentId, children: childData };
}
*/
