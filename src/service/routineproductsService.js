import { supabase } from "../lib/supabaseClient";
import { formatFaceProduct } from "../service/productService";

/**
 * A helper to robustly format a Supabase Storage image URL.
 * It prevents creating duplicate paths if the bucket name is already in the image path.
 */
const formatSupabaseImageUrl = (imagePath) => {
  // If the path is already a full URL or is invalid, return it as is.
  if (!imagePath || imagePath.startsWith("http")) {
    return imagePath;
  }

  const supabaseProjectRef = "qeanesmfzhimrfkrrcmd"; // Your Supabase Project Ref
  const bucketName = "images"; // Your storage bucket name for products

  // Trim leading slashes from the image path to prevent URL errors.
  const cleanImagePath = imagePath.startsWith("/")
    ? imagePath.substring(1)
    : imagePath;

  // Check if the bucket name is already part of the path to avoid duplication.
  // e.g., if imagePath is "images/product1.png", we don't want to prepend "images/" again.
  const finalImagePath = cleanImagePath.startsWith(`${bucketName}/`)
    ? cleanImagePath.substring(bucketName.length + 1)
    : cleanImagePath;

  return `https://${supabaseProjectRef}.supabase.co/storage/v1/object/public/${bucketName}/${finalImagePath}`;
};

/**
 * A robust formatter that handles nested product data from joins.
 * This should be the single source of truth for formatting product data in your app.
 */

export const fetchFaceProductToProductRoutines = async (userId) => {
  const { data, error } = await supabase
    .from("user_saved_products")
    .select(
      `
      product_id,
      saved_at,
      face_products_view:product_id (*)
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching routine products:", error);
    return [];
  }

  return (data || [])
    .filter((item) => item.face_products_view)
    .map((item) => {
      // 👇 this is the fix
      const product = formatFaceProduct(item.face_products_view);

      // 👇 add logs here
      console.log("Raw product image from DB:", item.face_products_view.image);
      console.log(
        "Final product image URL:",
        formatSupabaseImageUrl(product.image)
      );

      return {
        ...product,
        image: formatSupabaseImageUrl(product.image), // ✅ converted URL
      };
    });
};
