// src/services/authService.js
import { supabase } from "../lib/supabaseClient";

export const signup = async (user) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });

    if (error) return { success: false, message: "Signup failed", error };

    return { success: true, message: "Signup successful", data: data.user };
  } catch (error) {
    return { success: false, message: "Signup error", error };
  }
};

export const signin = async (user) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    });

    if (error) return { success: false, message: "Signin failed", error };

    return { success: true, message: "Signin successful", data: data.user };
  } catch (error) {
    return { success: false, message: "Signin error", error };
  }
};

export const googleSignIn = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error)
      return { success: false, message: "Google Sign-in failed", error };

    return { success: true, message: "Google Sign-in successful", data };
  } catch (error) {
    return { success: false, message: "Google Sign-in error", error };
  }
};

export const signOut = async () => {
  await supabase.auth.signOut();
};

export const getCurrentUser = () => {
  return supabase.auth.getUser();
};

export const isAuthenticated = async () => {
  const session = await supabase.auth.getSession();
  return session?.data?.session !== null;
};
