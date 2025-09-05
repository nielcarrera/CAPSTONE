// src/services/productService.js
import { supabase } from "../../lib/supabaseClient";

export const fetchRecentProducts = async (userId, limit = 3) => {
  const { data, error } = await supabase
    .from("user_saved_products")
    .select(
      `
      products:product_id (
        id,
        name,
        product_details (
          image,
          area
        )
      )
    `
    )
    .eq("user_id", userId)
    .order("saved_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent products:", error);
    throw error;
  }

  return (data || []).map((r) => r.products).filter(Boolean);
};
