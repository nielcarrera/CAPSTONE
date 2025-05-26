// src/service/skinTypeService.js
import { supabase } from "../lib/supabaseClient";
import { skinTypes } from "../Pages/utils/SkintypesData";

/**
 * Fetches the most recent skin type for a user
 * @param {string} userId
 * @returns {Promise<{id: string, user_id: string, skintype: string, created_at: string}|null>}
 */
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

/**
 * Creates or updates a skin type record for a user
 * @param {string} userId
 * @param {string} skinTypeId
 * @returns {Promise<{id: string, user_id: string, skintype: string, created_at: string}>}
 */
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

/**
 * Gets complete skin type details by ID
 * @param {string} skinTypeId
 * @param {string} [lastChecked]
 * @returns {{
 *   id: string,
 *   type: string,
 *   description: string,
 *   imageUrl: string[],
 *   characteristics: string[],
 *   causes: string[],
 *   generaltips: string[],
 *   lastChecked?: string
 * }}
 */
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
