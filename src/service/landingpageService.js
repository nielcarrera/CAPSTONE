// src/service/landingPageService.js
import { supabase } from "../lib/supabaseClient";

export const fetchUserDetails = async (userId) => {
  const { data, error } = await supabase
    .from("user_details")
    .select("first_name")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

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

export const fetchRecentProducts = async (limit = 6) => {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        name,
        product_details (
          image,
          area
        )
      `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  console.log("fetchRecentProducts Supabase result:", data);
  return data;
};
