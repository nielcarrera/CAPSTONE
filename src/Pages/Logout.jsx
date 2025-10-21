import { useEffect } from 'react';
import { useLogout } from '../Pages/hooks/hooks'; // adjust path if needed

const Logout = () => {
  const logout = useLogout();

  useEffect(() => {
    logout();
  }, [logout]);

  return <p>Logging you out...</p>;
};

export default Logout;
