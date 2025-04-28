import { useNavigate } from 'react-router-dom';
import supabase from "../../supabase";

export function useLogout() {
  const navigate = useNavigate();

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error.message);
    } else {
      navigate('/login'); // or wherever you want
    }
  }

  return logout;
}
