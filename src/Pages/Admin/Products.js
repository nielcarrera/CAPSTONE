import { supabase } from "../../supabase";

// Fetch face products only
export const fetchFaceProducts = async () => {
  const { data, error } = await supabase
    .from("face_products_view") // Changed to your view name
    .select(
      `
      id:product_id,
      name:product_name,
      type:product_type,
      description,
      severity,
      area,
      image,
      ingredients,
      skinType:skintype,
      impurity,
      cautions,
      usage,
      createdAt:created_at
    `
    ) // Aliases columns to match mock data keys
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error fetching face products:", error);
    return [];
  }

  return data;
};

// Fetch body products only
export const fetchBodyProducts = async () => {
  const { data, error } = await supabase
    .from("v_body_products") // Changed to your view name
    .select(
      `
      id:product_id,
      name,
      type,
      description,
      severity,
      area,
      image,
      ingredients:ingredient_names,
      impurity:body_impurity,
      cautions,
      usage,
      bodypart,
      createdAt:created_at
    `
    ) // Aliases columns to match mock data keys
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching body products:", error);
    return [];
  }
  return data;
};

export const upsertFaceProduct = async (productData) => {
  const { data, error } = await supabase.rpc("upsert_face_product", {
    p_id: productData.id || null, // Pass null to create, or existing ID to update
    p_name: productData.name,
    p_product_type: productData.type,
    p_description: productData.description,
    p_image: productData.image, // <-- THIS IS THE MISSING PARAMETER
    p_severity: productData.severity,
    p_usage: productData.usage,
    p_cautions: productData.cautions,
    p_skintype: productData.skinType,
    p_face_impurity: productData.impurity,
  });

  if (error) {
    console.error("❌ Error upserting face product:", error);
    return null;
  }

  console.log("Upserted face product, ID:", data);
  return data; // This will be the product ID returned from the function
};

/**
 * Creates or updates a body product.
 * @param {object} productData - The product data from the React form/state.
 * @returns {string|null} The product ID (uuid) on success, or null on error.
 */
export const upsertBodyProduct = async (productData) => {
  const { data, error } = await supabase.rpc("upsert_body_product", {
    p_id: productData.id || null,
    p_name: productData.name,
    p_product_type: productData.type,
    p_description: productData.description,
    p_image: productData.image,
    p_severity: productData.severity,
    p_usage: productData.usage,
    p_cautions: productData.cautions,
    p_bodypart: productData.bodypart,
    // Note: Assumes component's 'impurity' field holds the body_impurity *ID* (integer)
    p_body_impurity_id: productData.impurity,
  });

  if (error) {
    console.error("❌ Error upserting body product:", error);
    return null;
  }

  console.log("Upserted body product, ID:", data);
  return data; // This will be the product ID returned from the function
};

// Add this function to your Products.js file
export const deleteProduct = async (productId) => {
  const { error } = await supabase
    .from("products") // Delete from the main 'products' table
    .delete()
    .eq("id", productId);

  if (error) {
    console.error("❌ Error deleting product:", error);
    return false;
  }
  return true;
};

export const setProductIngredients = async (productId, ingredientNames) => {
  const { error } = await supabase.rpc("set_product_ingredients", {
    p_product_id: productId,
    p_ingredient_names: ingredientNames,
  });

  if (error) {
    console.error("❌ Error syncing product ingredients:", error);
    return false;
  }

  console.log("Successfully synced ingredients for product:", productId);
  return true;
};