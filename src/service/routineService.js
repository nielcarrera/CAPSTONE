import { supabase } from "../lib/supabaseClient";

export const saveRoutine = async (routineData, userId) => {
  if (!userId) {
    throw new Error("User ID is missing. Cannot save routine.");
  }

  console.log("Saving routine via RPC for userId:", userId);

  const { data: routineId, error } = await supabase.rpc(
    "insert_routine_with_steps",
    {
      p_routine_owner: userId,
      p_routine_name: routineData.name,
      p_type: routineData.type,
      p_time: routineData.time,
      p_duration: routineData.duration,
      p_steps: routineData.steps,
    }
  );

  if (error) {
    throw new Error("Failed to save routine via RPC: " + error.message);
  }

  console.log("✅ Saved routine with ID:", routineId);
  return routineId;
};

// ✅ New function to fetch user routines
export async function fetchUserRoutines(userId) {
  try {
    const { data, error } = await supabase.rpc("get_routines_by_owner", {
      p_owner: userId,
    });

    if (error) throw error;
    return data; // data should be array of routines with steps embedded
  } catch (error) {
    console.error("Error fetching routines:", error);
    return [];
  }
}
