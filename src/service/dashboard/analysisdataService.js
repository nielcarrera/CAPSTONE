// src/service/analysisDataService.js

// ✅ Add this line:
import { supabase } from "../../lib/supabaseClient";
import {
  fetchAvailableAnalysisDates,
  fetchImpurityDataByDate,
} from "./dashboardfaceService";

// List all impurities you care about (same as in your dummy structure)
const ALL_IMPURITIES = [
  "Whiteheads",

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
