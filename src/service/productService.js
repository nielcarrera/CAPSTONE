// src/services/faceProductService.js
import { supabase } from "../lib/supabaseClient";
import { products } from "../Pages/utils/Productdata";

/**
 * Fetches face products from Supabase or returns dummy data if Supabase fails
 * @returns {Promise<FaceProduct[]>}
 */
export const fetchFaceProducts = async () => {
  try {
    // First try to fetch from Supabase
    const { data, error } = await supabase
      .from("face_products_view")
      .select("*");

    if (error) throw error;

    if (data && data.length > 0) {
      return data.map(formatFaceProduct);
    }

    // If no data from Supabase, return dummy data
    console.warn("No products found in Supabase, using dummy data");
    return products.map(formatFaceProduct);
  } catch (error) {
    console.error("Error fetching face products, using dummy data:", error);
    return products.map(formatFaceProduct);
  }
};

/**
 * Gets product details by ID from Supabase or dummy data
 * @param {string} productId
 * @returns {Promise<FaceProduct>}
 */
export const getFaceProductById = async (productId) => {
  try {
    // First try to fetch from Supabase
    const { data, error } = await supabase
      .from("face_products_view")
      .select("*")
      .eq("product_id", productId)
      .single();

    if (!error && data) {
      return formatFaceProduct(data);
    }

    // If not found in Supabase, check dummy data
    const dummyProduct = products.find((p) => p.product_id === productId);
    if (dummyProduct) {
      return formatFaceProduct(dummyProduct);
    }

    throw new Error("Product not found");
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

// Helper function to format product data consistently

/**
 * Fetches products for a specific user (dummy implementation)
 * @returns {Promise<FaceProduct[]>}
 */
export const fetchUserProducts = async () => {
  try {
    const user = supabase.auth.user();
    if (!user) throw new Error("User not logged in");

    // In a real implementation, this would fetch user-specific products
    // For now, return an empty array or some dummy data
    return [];

    // Alternatively, return some dummy products as "user products":
    // return products.slice(0, 3).map(formatFaceProduct);
  } catch (error) {
    console.error("Error fetching user products:", error);
    return [];
  }
};

export const fetchRecentProducts = async (limit = 6) => {
  try {
    const { data, error } = await supabase
      .from("face_products_view")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data ? data.map(formatFaceProduct) : [];
  } catch (error) {
    console.error("Error fetching recent products:", error);
    return [];
  }
};

// faceProductService.js

// productService.js

export const fetchUserSavedProducts = async (userId) => {
  // Just return the first few products as "saved" for now
  const { data, error } = await supabase
    .from("face_products_view")
    .select("*")
    .limit(3); // simulate "saved" items

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }

  return data.map(formatFaceProduct);
};
/**
 * Fetches all saved products for a given user, including joined product details.
 * @param {string} userId
 * @returns {Promise<Array<{ product_id: string, saved_at: string, products: object }>>}
 */

export const formatFaceProduct = (item) => {
  const p = item.face_products_view || item.products || {};
  return {
    id: p.product_id || p.id || item.product_id || "",
    type: (p.product_type || p.type || item.type || "").toLowerCase(),
    name: p.product_name || p.name || item.name || "",
    description: p.description || "",
    severity: (p.severity || item.severity || "").toLowerCase(),
    area: (p.area || item.area || "face").toLowerCase(),
    image: p.image || item.image || "",
    ingredients: Array.isArray(p.ingredients)
      ? p.ingredients
      : typeof p.ingredients === "string"
      ? p.ingredients.split(",").map((i) => i.trim())
      : [],
    skinType: (p.skintype || p.skinType || item.skinType || "").toLowerCase(),
    impurity: (p.impurity || item.impurity || "").toLowerCase(),
    cautions: Array.isArray(p.cautions)
      ? p.cautions
      : p.cautions
      ? [p.cautions]
      : [],
    usage: p.usage || item.usage || "",
    brand: p.brand || item.brand || "",
    createdAt:
      p.created_at ||
      item.created_at ||
      item.saved_at ||
      new Date().toISOString(),
    saved_at: item.saved_at,
    user_product_id: item.product_id,
  };
};

// Main fetch function for saved products
export const fetchSavedProducts = async (userId) => {
  const { data, error } = await supabase
    .from("user_saved_products")
    .select(
      `
      product_id,
      saved_at,
      products:product_id (*),
      face_products_view:product_id (*)
    `
    )
    .eq("user_id", userId);

  if (error) throw error;

  return (data || [])
    .filter((item) => item.face_products_view || item.products)
    .map(formatFaceProduct);
};
