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

// Update an existing routine with steps
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

  const { data, error } = await supabase.rpc(
    "update_routine_with_steps", // your RPC name for update
    {
      p_routine_id: routineData.id, // Routine's ID to update
      p_routine_owner: userId,
      p_routine_name: routineData.name,
      p_type: routineData.type,
      p_time: routineData.time,
      p_duration: routineData.duration,
      p_steps: routineData.steps, // Array of steps
    }
  );

  if (error)
    throw new Error("Failed to update routine via RPC: " + error.message);

  console.log("✅ Updated routine:", data);
  return data;
}

// Delete a routine by its ID
export async function deleteRoutine(routineId, userId) {
  if (!userId) throw new Error("User ID is missing. Cannot delete routine.");
  if (!routineId)
    throw new Error("Routine ID is missing. Cannot delete routine.");

  console.log(
    "Deleting routine via RPC for userId:",
    userId,
    "RoutineID:",
    routineId
  );

  const { data, error } = await supabase.rpc(
    "delete_routine", // your RPC name for deletion
    {
      p_routine_id: routineId,
      p_routine_owner: userId, // Optional, if your RPC checks ownership
    }
  );

  if (error)
    throw new Error("Failed to delete routine via RPC: " + error.message);

  console.log("✅ Deleted routine:", data);
  return data;
}
