import { supabase } from "../supabaseClient";
import { fetchUserSkinType } from "./skintypeService";
import { fetchRecentProducts } from "./landingpageService";

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

export const uploadProfileImage = async (userId, file) => {
  try {
    const fileName = `avatar-${userId}-${Date.now()}`;
    const fileExt = file.name.split(".").pop();
    const filePath = `${fileName}.${fileExt}`;

    // Upload the file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};
