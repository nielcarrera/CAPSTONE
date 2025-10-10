import { supabase } from "../lib/supabaseClient";

export const saveRoutine = async (routineData, userId) => {
  if (!userId) {
    throw new Error("User ID is missing. Cannot save routine.");
  }

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

export async function fetchUserRoutines(userId) {
  try {
    const { data, error } = await supabase.rpc("get_routines_by_owner", {
      p_owner: userId,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching routines:", error);
    return [];
  }
}

// ✅ New function to update an existing routine with steps
export async function updateRoutine(routineData, userId) {
  if (!userId) throw new Error("User ID is missing. Cannot update routine.");
  if (!routineData.id)
    throw new Error("Routine ID is missing. Cannot update routine.");

  console.log(
    "Updating routine via RPC for userId:",
    userId,
    "RoutineID:",
    routineData.id
  );

  const { data, error } = await supabase.rpc("update_routine_with_steps", {
    p_routine_id: routineData.id,
    p_routine_name: routineData.name,
    p_type: routineData.type,
    p_time: routineData.time,
    p_duration: routineData.duration,
    p_steps: routineData.steps,
  });

  if (error)
    throw new Error("Failed to update routine via RPC: " + error.message);

  console.log("✅ Updated routine with ID:", data);
  return data;
}

// ✅ New function to delete a routine
export async function deleteRoutine(routineId, userId) {
  if (!userId) throw new Error("User ID is missing. Cannot delete routine.");
  if (!routineId)
    throw new Error("Routine ID is missing. Cannot delete routine.");

  const { error } = await supabase
    .from("routine") // ✅ Correct table name
    .delete()
    .eq("id", routineId) // ✅ Match your actual column name
    .eq("routine_owner", userId); // optional if your table includes it

  if (error) {
    throw new Error("Failed to delete routine: " + error.message);
  }

  console.log("✅ Deleted routine with ID:", routineId);
  return true;
}
