import { supabase } from "../lib/supabaseClient";

/**
 * Fetches body products from Supabase.
 * Falls back to empty array if error (or add dummy if you want).
 * @returns {Promise<BodyProduct[]>}
 */
export const fetchBodyProducts = async () => {
  try {
    const { data, error } = await supabase.from("v_body_products").select();
    if (error) throw error;
    if (!data || data.length === 0) {
      // Optionally add dummy data here if you want
      return [];
    }
    return data.map(formatBodyProduct);
  } catch (error) {
    console.error("Error fetching body products:", error);
    // Optionally add dummy data fallback here
    return [];
  }
};

/**
 * Format a body product (matches the view's fields)
 */
export const formatBodyProduct = (item) => {
  // Accepts either direct product or nested product data
  const p = item.v_body_products || item.products || item || {};

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
    area: (p.area || "body").toString().toLowerCase(),
    image: p.image || "",
    ingredients: asArray(p.ingredients || p.ingredient_names),
    ingredientIds: asArray(p.ingredient_ids),
    skinType: (p.skintype || p.skinType || "").toString().toLowerCase(),
    impurity: (p.impurity || "").toString().toLowerCase(),
    cautions: asArray(p.cautions),
    usage: p.usage || "",
    bodypart: p.bodypart || "",
    createdAt:
      p.created_at ||
      item.created_at ||
      item.saved_at ||
      new Date().toISOString(),
    saved_at: item.saved_at || "",
    user_product_id: p.product_id || "",
  };
};
