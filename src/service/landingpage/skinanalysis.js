// src/services/analysisService.js
import { supabase } from "../../lib/supabaseClient";
import { computeSkinScore } from "../../Pages/utils/SkinAnalytics";

const fetchLatestAnalysisDate = async (userId, kind) => {
  const { data: parents, error } = await supabase
    .from("saved_impurity")
    .select("id")
    .eq("user_id", userId)
    .eq("kind", kind);

  if (error || !parents?.length) return null;

  const parentIds = parents.map((p) => p.id);
  const childTable =
    kind === "face" ? "saved_face_impurity" : "saved_body_impurity";
  const dateCol = kind === "face" ? "analysis_date" : "detected_at";

  const { data: childRow } = await supabase
    .from(childTable)
    .select(dateCol)
    .in("saved_impurity_id", parentIds)
    .order(dateCol, { ascending: false })
    .limit(1)
    .single();

  return childRow?.[dateCol] || null;
};

const fetchImpuritiesByDate = async (userId, kind, analysisDate) => {
  if (!analysisDate) return [];

  const { data: parents } = await supabase
    .from("saved_impurity")
    .select("id")
    .eq("user_id", userId)
    .eq("kind", kind);

  if (!parents?.length) return [];
  const parentIds = parents.map((p) => p.id);

  if (kind === "face") {
    const { data } = await supabase
      .from("saved_face_impurity")
      .select("impurity, percentage")
      .in("saved_impurity_id", parentIds)
      .eq("analysis_date", analysisDate);
    return data || [];
  } else {
    const { data } = await supabase
      .from("saved_body_impurity")
      .select(`body_impurities (name, prevalence)`)
      .in("saved_impurity_id", parentIds)
      .eq("detected_at", analysisDate);

    return (data || []).map((row) => ({
      impurity: row.body_impurities.name,
      percentage: Math.round((row.body_impurities.prevalence ?? 0) * 100),
    }));
  }
};

export const fetchRecentKeyProblems = async (userId, kind) => {
  const latestDate = await fetchLatestAnalysisDate(userId, kind);
  if (!latestDate) return [];

  const rawImpurities = await fetchImpuritiesByDate(userId, kind, latestDate);

  return rawImpurities
    .map(({ impurity, percentage }) => ({
      label: impurity,
      value: Math.round(percentage ?? 0),
      severity:
        percentage >= 75 ? "severe" : percentage >= 50 ? "moderate" : "mild",
    }))
    .filter((i) => i.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
};

export const fetchRecentFaceAnalytics = async (userId) => {
  const latestDate = await fetchLatestAnalysisDate(userId, "face");
  if (!latestDate) return [];

  const rawImpurities = await fetchImpuritiesByDate(userId, "face", latestDate);
  return rawImpurities.map(({ impurity, percentage }) => ({
    label: impurity,
    value: Math.round(percentage ?? 0),
  }));
};

export const fetchRecentSkinScore = async (userId, kind) => {
  const latestDate = await fetchLatestAnalysisDate(userId, kind);
  if (!latestDate) return 100;

  const rawImpurities = await fetchImpuritiesByDate(userId, kind, latestDate);

  if (!rawImpurities?.length) return 100;

  const transformedImpurities = rawImpurities.map((item) => ({
    value: item.percentage ?? 0,
  }));

  return computeSkinScore(transformedImpurities);
};

export const fetchRecentBodyImpurities = async (userId, limit = 3) => {
  const { data: parents, error } = await supabase
    .from("saved_impurity")
    .select("id")
    .eq("user_id", userId)
    .eq("kind", "body");

  if (error || !parents?.length) {
    if (error) console.error("[fetchRecentBodyImpurities]", error);
    return [];
  }
  const parentIds = parents.map((p) => p.id);

  const { data, error: childError } = await supabase
    .from("saved_body_impurity")
    .select(`detected_at, body_impurities (name, description, image)`)
    .in("saved_impurity_id", parentIds)
    .order("detected_at", { ascending: false })
    .limit(limit);

  if (childError) {
    console.error("[fetchRecentBodyImpurities]", childError);
    return [];
  }

  return data.map((row) => ({
    label: row.body_impurities.name,
    description: row.body_impurities.description,
    image: row.body_impurities.image,
    detected_at: row.detected_at,
  }));
};
