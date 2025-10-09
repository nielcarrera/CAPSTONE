import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import { ProductCard } from "../components/Products/ProductCards";
import { ProductFilters } from "../components/Products/ProductFilters";
import ProductDetailModal from "../components/Products/ProductDetailModal";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  fetchFaceProducts,
  fetchUserSavedProductIds,
} from "../service/productService"; // Adjust if you split service files
import { fetchBodyProducts } from "../service/bodyProductService";

export const Products = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id;
  const [filters, setFilters] = useState({
    severity: "all",
    type: "all",
    impurity: "all",
    skinType: "all",
    sortOrder: "name-asc",
    dateRange: "all",
    area: "face", // or "body"
    bodyPart: "all",
  });
  const [faceProducts, setFaceProducts] = useState([]);
  const [bodyProducts, setBodyProducts] = useState([]);
  const [savedProductIds, setSavedProductIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Fetch all face and body products at mount
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchFaceProducts(), fetchBodyProducts()])
      .then(([faces, bodies]) => {
        setFaceProducts(faces || []);
        setBodyProducts(bodies || []);
      })
      .catch((err) => setError(err?.message || "Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  // Fetch saved product IDs for current user and area (face/body)
  useEffect(() => {
    if (!userId) {
      setSavedProductIds([]);
      return;
    }
    setLoading(true);
    fetchUserSavedProductIds(userId)
      .then((ids) => setSavedProductIds(ids || []))
      .catch(() => setSavedProductIds([]))
      .finally(() => setLoading(false));
  }, [userId, filters.area]);

  // Only show full product details for the user's saved product ids
  const allProducts = useMemo(
    () => (filters.area === "face" ? faceProducts : bodyProducts),
    [filters.area, faceProducts, bodyProducts]
  );

  const savedProducts = useMemo(() => {
    return allProducts.filter((prod) => savedProductIds.includes(prod.id));
  }, [allProducts, savedProductIds]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    let result = [...savedProducts];
    if (filters.severity !== "all")
      result = result.filter((p) => p.severity === filters.severity);
    if (filters.type !== "all")
      result = result.filter((p) => p.type === filters.type);
    if (filters.impurity !== "all")
      result = result.filter((p) => p.impurity === filters.impurity);
    if (filters.skinType !== "all")
      result = result.filter((p) => p.skinType === filters.skinType);
    if (filters.bodyPart !== "all" && filters.area === "body")
      result = result.filter(
        (p) => p.bodyPart?.toLowerCase() === filters.bodyPart.toLowerCase()
      );
    // Sorting
    switch (filters.sortOrder) {
      case "name-asc":
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return result.sort((a, b) => b.name.localeCompare(a.name));
      case "severity-asc":
        return result.sort(
          (a, b) =>
            ({ mild: 1, moderate: 2, severe: 3 }[a.severity] -
            { mild: 1, moderate: 2, severe: 3 }[b.severity])
        );
      default:
        return result;
    }
  }, [savedProducts, filters]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:ml-[240px] relative">
      <Sidebar />

      <div className="mt-10 max-w-6xl mx-auto px-2 sm:px-4">
        <ProductFilters
          filters={filters}
          onFilterChange={(k, v) => setFilters((prev) => ({ ...prev, [k]: v }))}
        />
        {loading ? (
          <div className="text-center py-16">Loading...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">
              {savedProductIds.length === 0
                ? "No products found"
                : "No matching products"}
            </h3>
            <p className="text-gray-500">
              {savedProductIds.length === 0
                ? "You haven't saved any products yet."
                : "Try adjusting your filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => {
                  setSelectedProduct(product);
                  setIsDetailOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};

export default Products;
