import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthProvider";
import { fetchFaceProducts } from "../service/productService";
import { supabase } from "../lib/supabaseClient";
import { ProductCard } from "../components/Products/ProductCards";
import { ProductFilters } from "../components/Products/ProductFilters";
import ProductDetailModal from "../components/Products/ProductDetailModal";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const formatFaceProduct = (product) => ({
  id: product.id,
  type: product.type?.toLowerCase(),
  name: product.name,
  description: product.description,
  severity: product.severity?.toLowerCase(),
  area: product.area?.toLowerCase() || "face",
  image: product.image,
  ingredients: Array.isArray(product.ingredients)
    ? product.ingredients
    : typeof product.ingredients === "string"
    ? product.ingredients.split(",").map((i) => i.trim())
    : [],
  skinType: product.skinType?.toLowerCase(),
  impurity: product.impurity?.toLowerCase(),
  cautions: Array.isArray(product.cautions)
    ? product.cautions
    : product.cautions
    ? [product.cautions]
    : [],
  usage: product.usage || "",
  brand: product.brand || "",
  createdAt: product.created_at || new Date().toISOString(),
});

export const Products = () => {
  const { currentUser } = useAuth();
  const [filters, setFilters] = useState({
    severity: "all",
    type: "all",
    impurity: "all",
    skinType: "all",
    sortOrder: "name-asc",
    dateRange: "all",
    area: "face",
    bodyPart: "all",
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const faceProducts = await fetchFaceProducts();
        if (isMounted) setProducts(faceProducts.map(formatFaceProduct));
      } catch (err) {
        if (isMounted) setError("Failed to load products. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  useEffect(() => {
    if (!supabase) return;
    const subscription = supabase
      .channel("face-products-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "face_products_view" },
        (payload) => {
          if (payload.eventType === "INSERT")
            setProducts((prev) => [...prev, formatFaceProduct(payload.new)]);
          else if (payload.eventType === "UPDATE")
            setProducts((prev) =>
              prev.map((p) =>
                p.id === payload.new.product_id
                  ? formatFaceProduct(payload.new)
                  : p
              )
            );
          else if (payload.eventType === "DELETE")
            setProducts((prev) =>
              prev.filter((p) => p.id !== payload.old.product_id)
            );
        }
      )
      .subscribe();
    return () => supabase.removeChannel(subscription);
  }, []);

  const filteredProducts = useMemo(() => {
    if (loading) return [];
    let result = [...products];

    // Filter by area
    result = result.filter((p) => p.area === filters.area);
    if (filters.area === "face") {
      if (filters.severity !== "all")
        result = result.filter((p) => p.severity === filters.severity);
      if (filters.type !== "all")
        result = result.filter((p) => p.type === filters.type);
      if (filters.impurity !== "all")
        result = result.filter((p) => p.impurity === filters.impurity);
      if (filters.skinType !== "all")
        result = result.filter((p) => p.skinType === filters.skinType);
    } else if (filters.bodyPart !== "all") {
      result = result.filter(
        (p) => p.bodyPart?.toLowerCase() === filters.bodyPart.toLowerCase()
      );
    }

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
  }, [filters, products, loading]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:ml-[240px] relative">
      <Sidebar />
      <Navbar />
      <div className="mt-16 md:mt-20 max-w-6xl mx-auto px-2 sm:px-4">
        <ProductFilters
          filters={filters}
          onFilterChange={(k, v) => setFilters((prev) => ({ ...prev, [k]: v }))}
        />

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">
              {products.length === 0
                ? "No products found"
                : "No matching products"}
            </h3>
            <p className="text-gray-500">
              {products.length === 0
                ? "There are currently no products available."
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
