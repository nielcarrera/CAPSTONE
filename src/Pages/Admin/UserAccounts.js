import { useState } from "react";
import { supabase, supabaseAdmin } from "../../supabase";

export const useAccountCRUD = (
  users,
  setUsers,
  setIsModalOpen,
  setSelectedUser
) => {
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("user")
        .select(
          `
          id,
          email,
          role,
          created_at,
          user_details (
            first_name,
            last_name
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map((row) => {
        const details = row.user_details || {};
        const fullName = `${details.first_name || ""} ${
          details.last_name || ""
        }`.trim();

        return {
          id: row.id,
          name: fullName || "No Name",
          email: row.email,
          role: row.role || "User",
          joined: row.created_at
            ? new Date(row.created_at).toISOString().split("T")[0]
            : "",
        };
      });

      setUsers(mapped);
    } catch (err) {
      console.error("fetchUsers error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (newUserData) => {
    try {
      setLoading(true);

      const { first_name, last_name, email, password, role } = newUserData;

      // STEP 1 ✅ Create user in auth.users
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

      if (authError) throw authError;
      const userId = authData.user.id;

      // STEP 3 ✅ Insert into public.user_details
      const { error: detailsError } = await supabaseAdmin
        .from("user_details")
        .insert({
          id: userId,
          first_name,
          last_name,
        });

      if (detailsError) throw detailsError;

      // STEP 4 ✅ Refresh user list
      await fetchUsers();

      // STEP 5 ✅ Close modal
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Add user failed", err);
      alert("Failed to create user: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * -------------------------------------------
   * ✅ COMPLETED UPDATE FUNCTION
   * -------------------------------------------
   */
  const handleUpdateUser = async (updatedUserData) => {
    try {
      setLoading(true);
      const { id, first_name, last_name, email, password, role } =
        updatedUserData;

      // STEP 1: Update Auth User (Email/Password)
      // Only update password if a new one is provided
      const authUpdateData = { email };
      if (password) {
        authUpdateData.password = password;
      }

      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        id,
        authUpdateData
      );
      if (authError) throw authError;

      // STEP 2: Update public.user table (Role)
      const { error: userError } = await supabaseAdmin
        .from("user")
        .update({ role, email }) // Also update email here to keep it in sync
        .eq("id", id);
      if (userError) throw userError;

      // STEP 3: Update public.user_details table (Name)
      const { error: detailsError } = await supabaseAdmin
        .from("user_details")
        .update({ first_name, last_name })
        .eq("id", id);
      if (detailsError) throw detailsError;

      // STEP 4: Refresh user list
      await fetchUsers();

      // STEP 5: Close modal
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Update user failed", err);
      alert("Failed to update user: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * -------------------------------------------
   * ✅ COMPLETED DELETE FUNCTION
   * -------------------------------------------
   */
  const handleDeleteUser = async (userId) => {
    // We add a window.confirm for safety
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      setLoading(true);

      // STEP 1: Delete the user from auth.users
      // If you have "ON DELETE CASCADE" set up for your
      // 'user' and 'user_details' tables, this is all you need.
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

      if (authError) throw authError;

      // Note: If you do NOT have cascading deletes, you would
      // manually delete from 'user_details' and 'user' *first*,
      // but assuming you do, this is much cleaner.

      // STEP 2: Refresh user list
      await fetchUsers();

      // STEP 3: Close modal
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Delete user failed", err);
      alert("Failed to delete user: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchUsers,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
  };
};