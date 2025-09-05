import { supabase } from "../lib/supabaseClient";

/**
 * A helper to format a Supabase Storage image URL.
 * It's not exported because it's only used internally by the formatter.
 */
const formatSupabaseImageUrl = (imagePath) => {
  if (!imagePath || imagePath.startsWith("http")) {
    return imagePath;
  }
  const supabaseProjectRef = "qeanesmfzhimrfkrrcmd";
  const supabaseBaseUrl = `https://${supabaseProjectRef}.supabase.co`;
  const bucketName = "images"; // Replace with your actual bucket name for products

  return `${supabaseBaseUrl}/storage/v1/object/public/${bucketName}/${imagePath}`;
};

/**
 * A robust formatter that handles nested product data from joins.
 * This should replace the older, simpler version.
 */
export const formatFaceProduct = (item) => {
  const p = item.face_products_view || item.products || item || {};
  const imagePath = p.image || "/path/to/your/default-image.jpg"; // Use a real fallback image here

  // ✅ Use the new helper function to format the URL
  const imageUrl = formatSupabaseImageUrl(imagePath);

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
    image: imageUrl, // Use the correctly formatted URL
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

/**
 * Fetches a user's SAVED face products for the routine builder.
 * @param {string} userId - The ID of the user whose saved products to fetch.
 */
export const fetchFaceProductToProductRoutines = async (userId) => {
  if (!userId) {
    console.error("User ID is required to fetch saved products.");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("user_saved_products")
      .select("product_id, saved_at, face_products_view:product_id(*)")
      .eq("user_id", userId);

    if (data) {
      console.log("Supabase raw data:", data);
    }

    if (error) {
      console.error("Error fetching user's saved face products:", error);
      throw error;
    }

    return (data || [])
      .filter((item) => item.face_products_view)
      .map((item) => formatFaceProduct(item));
  } catch (err) {
    console.error("Fallback: returning empty saved product list", err);
    return [];
  }
};
