// src/service/landingpageService.js

import { supabase } from "../../lib/supabaseClient";
import { computeSkinScore } from "../../Pages/utils/SkinAnalytics"; // or wherever your computeSkinScore lives

/**
 * 🔍 Fetch the single most-recent analysis date for “face” or “body”
 */
export const fetchLatestAnalysisDate = async (userId, kind) => {
  const { data: parents, error: parentError } = await supabase
    .from("saved_impurity")
    .select("id")
    .eq("user_id", userId)
    .eq("kind", kind);

  if (parentError || !parents?.length) {
    if (parentError) console.error("[fetchLatestAnalysisDate]", parentError);
    return null;
  }

  const parentIds = parents.map((p) => p.id);
  const childTable =
    kind === "face" ? "saved_face_impurity" : "saved_body_impurity";
  const dateCol = kind === "face" ? "analysis_date" : "detected_at";

  const { data: childRow, error: childError } = await supabase
    .from(childTable)
    .select(dateCol)
    .in("saved_impurity_id", parentIds)
    .order(dateCol, { ascending: false })
    .limit(1)
    .maybeSingle();

  if (childError) {
    console.error("[fetchLatestAnalysisDate]", childError);
    return null;
  }
  return childRow?.[dateCol] || null;
};

/**
 * 📦 Fetch raw impurity rows for a given date
 */
export const fetchImpuritiesByKindAndDate = async (
  userId,
  kind,
  analysisDate
) => {
  if (!analysisDate) return [];

  const { data: parents, error: parentError } = await supabase
    .from("saved_impurity")
    .select("id")
    .eq("user_id", userId)
    .eq("kind", kind);

  if (parentError || !parents?.length) {
    if (parentError) console.error("[fetchImpurities…]", parentError);
    return [];
  }
  const parentIds = parents.map((p) => p.id);

  if (kind === "face") {
    const { data: faceRows, error } = await supabase
      .from("saved_face_impurity")
      .select("impurity, percentage")
      .in("saved_impurity_id", parentIds)
      .eq("analysis_date", analysisDate);

    if (error) {
      console.error("[fetchImpurities…face]", error);
      return [];
    }
    return faceRows || [];
  }

  // body
  const { data: bodyRows, error: bodyError } = await supabase
    .from("saved_body_impurity")
    .select(
      `
      detected_at,
      body_impurities (
        name,
        description,
        common_locations,
        prevalence,
        image
      )`
    )
    .in("saved_impurity_id", parentIds)
    .eq("detected_at", analysisDate);

  if (bodyError) {
    console.error("[fetchImpurities…body]", bodyError);
    return [];
  }

  return bodyRows.map((row) => ({
    label: row.body_impurities.name,
    value: Math.round((row.body_impurities.prevalence ?? 0) * 100),
  }));
};

/**
 * 🌟 Top 3 face key problems
 */
export const fetchRecentFaceKeyProblems = async (userId) => {
  const latest = await fetchLatestAnalysisDate(userId, "face");
  if (!latest) return [];

  const raw = await fetchImpuritiesByKindAndDate(userId, "face", latest);
  if (!raw.length) return [];

  const map = {};
  raw.forEach(({ impurity, percentage }) => {
    map[impurity] = Math.round(percentage ?? 0);
  });

  return Object.entries(map)
    .map(([label, value]) => ({
      label,
      value,
      severity: value >= 75 ? "severe" : value >= 50 ? "moderate" : "mild",
    }))
    .filter((i) => i.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
};

/**
 * 📊 Full face analytics
 */
export const fetchRecentFaceAnalytics = async (userId) => {
  const latest = await fetchLatestAnalysisDate(userId, "face");
  if (!latest) return [];

  const raw = await fetchImpuritiesByKindAndDate(userId, "face", latest);
  return raw.map(({ impurity, percentage }) => ({
    label: impurity,
    value: Math.round(percentage ?? 0),
  }));
};

/**
 * 🏆 Face skin score (0–100)
 */

/**
 * 🌟 Top 3 body key problems
 */
export const fetchRecentBodyKeyProblems = async (userId) => {
  const latest = await fetchLatestAnalysisDate(userId, "body");
  if (!latest) return [];

  const raw = await fetchImpuritiesByKindAndDate(userId, "body", latest);
  if (!raw.length) return [];

  return raw
    .map(({ label, value }) => ({
      label,
      value,
      severity: value >= 75 ? "severe" : value >= 50 ? "moderate" : "mild",
    }))
    .filter((i) => i.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
};

/**
 * 🏅 Body skin score (0–100) — **this is the missing export**
 */

/**
 * 🗃️ N most‐recent body impurities
 */
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
    .select(
      `
      detected_at,
      body_impurities (
        name,
        description,
        image
      )`
    )
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

/**
 * 👤 User first name
 */
export const fetchUserDetails = async (userId) => {
  const { data, error } = await supabase
    .from("user_details")
    .select("first_name")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

/**
 * 💧 Most recent skin type
 */
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

/**
 * 🛍️ N most‐recent saved products
 */
export const fetchRecentProducts = async (userId, limit = 6) => {
  const { data, error } = await supabase
    .from("user_saved_products")
    .select(
      `
      product_id,
      saved_at,
      products:product_id (
        id,
        name,
        created_at,
        product_details (
          image,
          area
        )
      )`
    )
    .eq("user_id", userId)
    .order("saved_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data || [])
    .filter((r) => r.products)
    .map((r) => ({
      ...r.products,
      saved_at: r.saved_at,
      user_product_id: r.product_id,
    }));
};
