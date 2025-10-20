// src/service/skinTypeService.js
import { supabase } from "../lib/supabaseClient";
import { skinTypes } from "../Pages/utils/SkintypesData";

// --------------------- Skin Type ---------------------

export const fetchUserSkinType = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("user_skintype")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user skin type:", error);
    throw error;
  }
};

export const saveUserSkinType = async (userId, skinTypeId) => {
  try {
    const skinTypeExists = skinTypes.some((type) => type.id === skinTypeId);
    if (!skinTypeExists) {
      throw new Error(`Invalid skin type ID: ${skinTypeId}`);
    }

    const { data, error } = await supabase
      .from("user_skintype")
      .insert([
        {
          user_id: userId,
          skintype: skinTypeId,
        },
      ])
      .select()
      .single(); // assumes one row inserted

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving user skin type:", error);
    throw error;
  }
};

// --------------------- Skin Tone ---------------------

// --------------------- Skin Tone ---------------------

export const fetchSkinToneData = async (userId = null) => {
  try {
    // ✅ get user ID directly if not passed
    if (!userId) {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("User not authenticated");
      userId = user.id;
    }

    const { data, error } = await supabase
      .from("user_skintone")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    console.log("🐛 Skin Tone Response:", data);

    return data || null;
  } catch (error) {
    console.error("Error fetching skin tone:", error);
    return null;
  }
};

export const updateUserSkinTone = async (newTone) => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) throw new Error("User not authenticated");

    const userId = user.id;

    // ✅ Convert to match enum case
    const formattedTone =
      newTone.charAt(0).toUpperCase() + newTone.slice(1).toLowerCase();

    const { data: existing } = await supabase
      .from("user_skintone")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    let result;

    if (existing) {
      // ✅ Update
      result = await supabase
        .from("user_skintone")
        .update({ skintone: formattedTone })
        .eq("user_id", userId)
        .select();
    } else {
      // ✅ Insert
      result = await supabase
        .from("user_skintone")
        .insert([{ user_id: userId, skintone: formattedTone }])
        .select();
    }

    if (result.error) throw result.error;

    return {
      status: "success",
      message: "Skin tone updated successfully!",
    };
  } catch (error) {
    console.error("Error updating skin tone:", error);
    return {
      status: "error",
      message: `Error updating skin tone: ${error.message}`,
    };
  }
};

// --------------------- Helper ---------------------

export const getSkinTypeDetails = (skinTypeId, lastChecked) => {
  const skinType = skinTypes.find((type) => type.id === skinTypeId);

  if (!skinType) {
    throw new Error(`Skin type with ID ${skinTypeId} not found`);
  }

  return {
    ...skinType,
    lastChecked: lastChecked || new Date().toISOString(),
  };
};
