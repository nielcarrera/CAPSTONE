import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  fetchFaceProducts,
  fetchUserSavedProductIds,
} from "../../service/productService";
import { fetchBodyProducts } from "../../service/bodyProductService";
import { X } from "lucide-react";

//=================================================================
// 1. COMPACT PRODUCT CARD COMPONENT (Integrated)
//=================================================================
const severityClasses = {
  mild: "bg-green-100 text-green-800",
  moderate: "bg-yellow-100 text-yellow-800",
  severe: "bg-red-100 text-red-800",
  default: "bg-gray-100 text-gray-800",
};

const CompactProductCard = ({ product, onClick }) => (
  <div
    className="bg-white rounded-md border-cyan-300 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col border h-full"
    onClick={onClick}
  >
    <div className="relative h-28 overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
    <div className="p-2 flex flex-col flex-grow">
      <span className="text-xs text-gray-500 mb-1 line-clamp-1">
        {product.brand}
      </span>
      <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2 flex-grow">
        {product.name}
      </h3>
      <div className="flex flex-wrap gap-1 mt-1">
        <span
          className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
            severityClasses[product.severity] || severityClasses.default
          }`}
        >
          {product.severity}
        </span>
        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-cyan-100 text-cyan-800 rounded-full">
          {product.type}
        </span>
      </div>
    </div>
  </div>
);

//=================================================================
// 2. COMPACT FILTERS COMPONENT (Integrated)
//=================================================================
const productTypes = [
  "all",
  "cleanser",
  "serum",
  "exfoliant",
  "moisturizer",
  "toner",
  "treatment",
];
const severityTypes = ["all", "mild", "moderate", "severe"];
const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const CompactFilterSelect = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 block w-full pl-3 pr-8 py-1.5 text-xs border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {capitalize(option)}
        </option>
      ))}
    </select>
  </div>
);

const CompactFilters = ({ filters, onFilterChange }) => (
  <div className="px-2 pb-3">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 items-end">
      <div>
        <label className="block text-xs font-medium text-gray-600">Area</label>
        <div className="mt-1 flex border rounded-md overflow-hidden">
          {["face", "body"].map((area) => (
            <button
              key={area}
              onClick={() => onFilterChange("area", area)}
              className={`px-3 py-1.5 text-xs w-full transition-colors ${
                filters.area === area
                  ? "bg-cyan-700 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {capitalize(area)}
            </button>
          ))}
        </div>
      </div>

      <CompactFilterSelect
        label="Product Type"
        value={filters.type}
        options={productTypes}
        onChange={(v) => onFilterChange("type", v)}
      />

      <CompactFilterSelect
        label="Severity"
        value={filters.severity}
        options={severityTypes}
        onChange={(v) => onFilterChange("severity", v)}
      />
    </div>
  </div>
);

//=================================================================
// 3. MAIN PRODUCT SELECT DROPDOWN COMPONENT
//=================================================================
const ProductSelectDropdown = ({ open, onClose, onSelectProduct }) => {
  const [allSavedProducts, setAllSavedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    area: "face",
    type: "all",
    severity: "all",
  });

  useEffect(() => {
    if (!open) return;

    const loadSavedProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found.");

        const savedIds = await fetchUserSavedProductIds(user.id);
        if (!savedIds || savedIds.length === 0) {
          setAllSavedProducts([]);
          setLoading(false);
          return;
        }

        const [faceProds, bodyProds] = await Promise.all([
          fetchFaceProducts(),
          fetchBodyProducts(),
        ]);
        const allProducts = [...(faceProds || []), ...(bodyProds || [])];
        const userSavedProducts = allProducts.filter((p) =>
          savedIds.includes(p.id)
        );
        setAllSavedProducts(userSavedProducts);
      } catch (err) {
        setError("Failed to load your saved products.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSavedProducts();
  }, [open]);

  const filteredProducts = useMemo(() => {
    let result = allSavedProducts.filter((p) => p.area === filters.area);
    if (filters.type !== "all") {
      result = result.filter((p) => p.type === filters.type);
    }
    if (filters.severity !== "all") {
      result = result.filter((p) => p.severity === filters.severity);
    }
    return result;
  }, [allSavedProducts, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col p-4 border shadow-xl">
        <div className="flex justify-between items-center mb-2 px-2">
          <h3 className="text-lg font-semibold">Select a Product</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <CompactFilters filters={filters} onFilterChange={handleFilterChange} />

        <div className="flex-grow overflow-auto pr-2">
          {loading ? (
            <p className="text-center py-8">Loading your products...</p>
          ) : error ? (
            <p className="text-red-500 text-center py-8">{error}</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {allSavedProducts.length === 0
                ? "You have no saved products yet."
                : "No products match your filters."}
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredProducts.map((product) => (
                <CompactProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onSelectProduct(product)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSelectDropdown;
