import { supabase } from "../lib/supabaseClient";

/**
 * Formatter used ONLY in this service, matching your other page.
 */
const formatFaceProduct = (product) => ({
  id: product.product_id,
  type: product.product_type?.toLowerCase(),
  name: product.product_name,
  description: product.description,
  severity: product.severity?.toLowerCase(),
  area: product.area?.toLowerCase() || "face",
  image: product.image,
  ingredients: Array.isArray(product.ingredients)
    ? product.ingredients
    : typeof product.ingredients === "string"
    ? product.ingredients.split(",").map((i) => i.trim())
    : [],
  skinType: product.skintype?.toLowerCase(),
  impurity: product.impurity?.toLowerCase(),
  cautions: Array.isArray(product.cautions)
    ? product.cautions
    : product.cautions
    ? [product.cautions]
    : [],
  usage: product.usage || "",
  brand: product.brand || "",
  createdAt: product.created_at || new Date().toISOString(),
});

/**
 * Temporary function to fetch face products for routine builder.
 * This will be expanded once body product views are available.
 */
export const fetchFaceProductToProductRoutines = async () => {
  try {
    const { data, error } = await supabase
      .from("face_products_view")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching face products:", error);
      throw error;
    }

    return (data || []).map(formatFaceProduct).filter((p) => p.area === "face"); // explicitly filter only face for now
  } catch (err) {
    console.error("Fallback: returning empty face product list", err);
    return [];
  }
};
