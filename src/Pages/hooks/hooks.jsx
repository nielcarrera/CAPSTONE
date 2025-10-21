// src/Pages/hooks/hooks.js
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      navigate("/login"); // or wherever you want to redirect after logout
    }
  };

  return logout;
};
