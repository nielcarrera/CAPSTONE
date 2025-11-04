import { useState } from "react";
import { supabase } from "../../supabase";

export const useAccountCRUD = (
  users,
  setUsers,
  setIsModalOpen,
  setSelectedUser
) => {
  const [loading, setLoading] = useState(false);

  // ✅ FETCH USERS (now inside this hook)
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

  // 🚧 TO IMPLEMENT NEXT
  const handleAddUser = async (newUserData) => {
    try {
      setLoading(true);

      const { first_name, last_name, email, password, role } = newUserData;

      // STEP 1 ✅ Create user in auth.users
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

      if (authError) throw authError;
      const userId = authData.user.id;

      // STEP 2 ✅ Insert into public.user
      const { error: userError } = await supabase.from("user").insert({
        id: userId,
        email: email,
        role: role || "User",
      });

      if (userError) throw userError;

      // STEP 3 ✅ Insert into public.user_details
      const { error: detailsError } = await supabase
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

  const handleUpdateUser = async (updatedUserData) => {
    console.log(
      "Update user clicked — not yet implemented ✅",
      updatedUserData
    );
  };

  const handleDeleteUser = async (userId) => {
    console.log("Delete user clicked — not yet implemented ✅", userId);
  };

  return {
    loading,
    fetchUsers,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
  };
};
