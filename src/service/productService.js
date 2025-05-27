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
const formatFaceProduct = (product) => ({
  id: product.product_id,
  type: product.product_type,
  name: product.product_name,
  description: product.description,
  severity: product.severity,
  area: product.area,
  image: product.image,
  ingredients: product.ingredients,
  skinType: product.skintype,
  impurity: product.impurity,
  cautions: product.cautions,
  usage: product.usage,
  createdAt: product.created_at || new Date().toISOString(),
});
export { formatFaceProduct };

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
