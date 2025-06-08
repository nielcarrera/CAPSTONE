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
    const { data, error } = await supabase.from("face_products_view").select();
    console.log("Supabase data:", data);
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
  const { data, error } = await supabase
    .from("user_saved_products")
    .select("product_id, face_products_view:product_id(*)")
    .eq("user_id", userId);
  if (error) return [];
  // Now you can safely use formatFaceProduct!
  return data.map((item) => formatFaceProduct(item.face_products_view));
};
export const fetchUserSavedProductIds = async (userId, area) => {
  const { data, error } = await supabase
    .from("user_saved_products")
    .select("product_id")
    .eq("user_id", userId);
  if (error) return [];
  return data.map((item) => item.product_id);
};

/**
 * Fetches all saved products for a given user, including joined product details.
 * @param {string} userId
 * @returns {Promise<Array<{ product_id: string, saved_at: string, products: object }>>}
 */

export const formatFaceProduct = (item) => {
  // Accepts either direct product or nested product data
  const p = item.face_products_view || item.products || item || {};

  // Helper to always return an array for fields that may be string/array/undefined
  const asArray = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === "string")
      return field
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    return [];
  };

  return {
    id: p.product_id || p.id || "",
    type: (p.product_type || p.type || "").toString().toLowerCase(),
    name: p.product_name || p.name || "",
    description: p.description || "",
    severity: (p.severity || "").toString().toLowerCase(),
    area: (p.area || "face").toString().toLowerCase(),
    image: p.image || "",
    ingredients: asArray(p.ingredients),
    skinType: (p.skintype || p.skinType || "").toString().toLowerCase(),
    impurity: (p.impurity || "").toString().toLowerCase(),
    cautions: asArray(p.cautions),
    usage: p.usage || "",
    brand: p.brand || "",
    createdAt:
      p.created_at ||
      item.created_at ||
      item.saved_at ||
      new Date().toISOString(),
    saved_at: item.saved_at || "",
    user_product_id: p.product_id || "",
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
