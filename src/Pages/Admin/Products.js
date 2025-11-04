import { supabase } from "../../supabase";

// Fetch face products only
export const fetchFaceProducts = async () => {
  const { data, error } = await supabase
    .from("face_products") // <-- change to your actual table name
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching face products:", error);
    return [];
  }
  return data;
};

// Fetch body products only (for later use)
export const fetchBodyProducts = async () => {
  const { data, error } = await supabase
    .from("body_products") // <-- change to your actual table name
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching body products:", error);
    return [];
  }
  return data;
};
