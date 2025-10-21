// src/context/AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../service/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUser = async () => {
    const { data, error } = await getCurrentUser();
    if (data?.user) {
      setCurrentUser(data.user);
      setIsAuthenticated(true);
    } else {
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const setUserData = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const clearUserData = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        setUserData,
        clearUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
