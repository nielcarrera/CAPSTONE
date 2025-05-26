// src/service/profileService.js
import { supabase } from "../lib/supabaseClient";
import { fetchUserSkinType } from "./skinTypeService";
import { fetchRecentProducts } from "./landingPageService";

export const fetchUserProfile = async (userId) => {
  try {
    // Fetch data from multiple tables in parallel
    const [
      { data: userDetails, error: detailsError },
      { data: userEmail, error: emailError },
      skinTypeRecord,
      productsData,
    ] = await Promise.all([
      supabase
        .from("user_details")
        .select(
          "first_name, last_name, age, gender, height, weight, avatar_url"
        )
        .eq("id", userId)
        .maybeSingle(),

      supabase.from("users").select("email").eq("id", userId).maybeSingle(),

      fetchUserSkinType(userId),

      fetchRecentProducts(4),
    ]);

    if (detailsError) throw detailsError;
    if (emailError) throw emailError;

    return {
      profileData: {
        firstName: userDetails?.first_name || "",
        lastName: userDetails?.last_name || "",
        nickname: "", // Add to your schema if needed
        email: userEmail?.email || "",
        age: userDetails?.age || "",
        gender: userDetails?.gender || "",
        height: userDetails?.height || "",
        weight: userDetails?.weight || "",
        skinType: skinTypeRecord?.skintype || "Not set",
        avatar: userDetails?.avatar_url || "https://via.placeholder.com/150",
      },
      userProducts: productsData || [],
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const { error } = await supabase.from("user_details").upsert({
      id: userId,
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      age: profileData.age,
      gender: profileData.gender,
      height: profileData.height,
      weight: profileData.weight,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const uploadProfileImage = async (userId, file) => {
  try {
    // Upload to Supabase Storage
    const fileName = `avatars/${userId}-${Date.now()}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName);

    // Update user_details table
    const { error: updateError } = await supabase
      .from("user_details")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);

    if (updateError) throw updateError;

    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Mock routines - replace with actual service if needed
export const fetchUserRoutines = async () => {
  return [
    {
      id: "1",
      name: "Morning Routine",
      time: "7:00 AM",
      steps: 4,
    },
    {
      id: "2",
      name: "Night Routine",
      time: "10:00 PM",
      steps: 5,
    },
  ];
};
