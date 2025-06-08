import { create } from "zustand";
import { fetchFaceProducts } from "../services/faceProductService";
import { fetchBodyProducts } from "../services/bodyProductService";
import { supabase } from "../lib/supabaseClient"; // Make sure this is correct

export const useProductStore = create((set, get) => ({
  faceProducts: [],
  bodyProducts: [],
  savedProductIds: [],
  isLoading: false,
  error: null,

  // Fetch all face products
  fetchFaceProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchFaceProducts();
      set({ faceProducts: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Fetch all body products
  fetchBodyProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchBodyProducts();
      set({ bodyProducts: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Fetch both (recommended for dashboard/init)
  fetchAllProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const [face, body] = await Promise.all([
        fetchFaceProducts(),
        fetchBodyProducts(),
      ]);
      set({ faceProducts: face, bodyProducts: body, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Fetch user's saved product IDs (for this session's user only)
  fetchUserSavedProducts: async (userId) => {
    if (!userId) {
      set({ savedProductIds: [] });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("user_saved_products")
        .select("product_id")
        .eq("user_id", userId)
        .limit(100);
      if (error) throw error;
      set({
        savedProductIds: data.map((item) => item.product_id),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false, savedProductIds: [] });
    }
  },

  // Get saved products by area (face/body), ready for your toggle
  getSavedProductsByArea: (area) => {
    const { faceProducts, bodyProducts, savedProductIds } = get();
    const products = area === "face" ? faceProducts : bodyProducts;
    return products.filter((p) => savedProductIds.includes(p.id));
  },
}));

export default useProductStore;
