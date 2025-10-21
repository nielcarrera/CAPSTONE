// src/services/userService.js
import { supabase } from "../../lib/supabaseClient";

export const fetchUserDetails = async (userId) => {
  const { data, error } = await supabase
    .from("user_details")
    .select("first_name")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
  return data;
};

export const fetchUserSkinType = async (userId) => {
  const { data, error } = await supabase
    .from("user_skintype")
    .select("skintype")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching skin type:", error);
    return null;
  }
  return data?.skintype || null;
};
