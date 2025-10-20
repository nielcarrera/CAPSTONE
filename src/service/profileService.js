import { supabase } from "../supabase";
import { fetchUserSkinType } from "./skintypeService";
import { fetchRecentProducts } from "./productService";

export const fetchUserProfile = async (userId) => {
  try {
    // Fetch basic user details (email)
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    // Fetch additional user details (first_name, last_name, age, gender)
    const { data: userDetailsData, error: userDetailsError } = await supabase
      .from("user_details")
      .select("first_name, last_name, age, gender")
      .eq("id", userId)
      .single();

    if (userDetailsError) throw userDetailsError;

    // Fetch skin type
    const skinTypeData = await fetchUserSkinType(userId);

    // Fetch recent products
    const productsData = await fetchRecentProducts();

    return {
      email: userData.email,
      firstName: userDetailsData?.first_name || "",
      lastName: userDetailsData?.last_name || "",
      age: userDetailsData?.age || "",
      gender: userDetailsData?.gender || "",
      skinType: skinTypeData?.skintype || "Unknown",
      products: productsData || [],
      avatar: "", // Default empty avatar
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    // Update user_details table with only the fields we have
    const { error: detailsError } = await supabase.from("user_details").upsert({
      id: userId,
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      age: profileData.age,
      gender: profileData.gender,
      updated_at: new Date().toISOString(),
    });

    if (detailsError) throw detailsError;

    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const uploadUserAvatar = async (userId, file) => {
  if (!userId || !file) throw new Error("Missing userId or file");

  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  try {
    console.log("🟡 Uploading avatar for user:", userId);
    console.log("📁 File details:", file);
    // Upload file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("profile_images") // bucket name
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw new Error(
        `Upload failed: ${uploadError.message || "Unknown error"}`
      );
    }

    // Get public URL (works for public buckets)
    const { data: publicData, error: urlError } = supabase.storage
      .from("profile_images")
      .getPublicUrl(filePath);

    if (urlError) {
      console.error("Supabase URL error:", urlError);
      throw new Error(
        `Failed to get public URL: ${urlError.message || "Unknown error"}`
      );
    }

    if (!publicData?.publicUrl)
      throw new Error("Failed to get public URL from Supabase");

    return publicData.publicUrl;
  } catch (err) {
    console.error("Error uploading avatar:", err);
    throw err;
  }
};
export const fetchUserSummary = async (userId) => {
  try {
    const { data, error } = await supabase
      .rpc("get_user_summary", { p_user_id: userId })
      .single(); // Use .single() as we expect one result

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching user summary:", error);
    throw error;
  }
};

export const updateUserDetails = async (userId, profileData) => {
  try {
    const { error } = await supabase
      .from("user_details")
      .update({
        first_name: profileData.firstName || null,
        last_name: profileData.lastName || null,
        age: profileData.age || null,
        gender: profileData.gender || null,
      })
      .eq("id", userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating user details:", error.message);
    throw error;
  }
};
