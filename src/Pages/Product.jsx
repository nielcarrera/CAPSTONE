import React, { useState, useEffect, useMemo } from "react";
import { CircleDot, ChevronDown } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  products,
  skinImpurities,
  skinTypes,
  sortOptions,
} from "../Pages/utils/Productdata";

// Product Card Component
const ProductCard = ({ product, onClick }) => {
  const severityClasses = {
    mild: "bg-green-100 text-green-800 border-green-200",
    moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
    severe: "bg-red-100 text-red-800 border-red-200",
    default: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const typeIcons = {
    cleanser: "❖",
    serum: "◉",
    exfoliant: "◎",
    moisturizer: "⦿",
    sunscreen: "◙",
    mask: "⟐",
    toner: "▣",
    treatment: "⚕",
    default: "■",
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              severityClasses[product.severity] || severityClasses.default
            }`}
          >
            <CircleDot className="w-3 h-3 mr-1" />
            {product.severity}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{product.brand}</span>
          <span className="text-xs border px-2 py-1 rounded-md">
            {typeIcons[product.type] || typeIcons.default} {product.type}
          </span>
        </div>
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-grow">
          {product.description}
        </p>

        {/* Date information */}
        <div className="mt-2 text-xs text-gray-500">
          <div className="flex items-center">
            <span className="font-medium">Added: </span>
            <span className="ml-1">
              {new Date(product.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {product.area === "face" ? (
            <>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {product.impurity}
              </span>
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                {product.skinType}
              </span>
            </>
          ) : (
            <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full">
              {product.bodyPart}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Product Filters Component
const ProductFilters = ({ filters, onFilterChange }) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isImpurityOpen, setIsImpurityOpen] = useState(false);
  const [isSkinTypeOpen, setIsSkinTypeOpen] = useState(false);
  const [isProductTypeOpen, setIsProductTypeOpen] = useState(false);
  const [isSeverityOpen, setIsSeverityOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);

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
  const bodyParts = ["all", "arm", "back", "neck", "legs", "feet"];

  const dateRanges = [
    { value: "all", label: "All Dates" },
    { value: "week", label: "Last Week" },
    { value: "month", label: "Last Month" },
    { value: "3months", label: "Last 3 Months" },
    { value: "year", label: "Last Year" },
  ];

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <h2 className="text-2xl font-bold">Skincare Products</h2>

        {/* Sort Dropdown */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="px-4 py-2 border rounded-md flex items-center justify-between w-full sm:w-auto"
          >
            <span>
              Sort by:{" "}
              {sortOptions.find((opt) => opt.value === filters.sortOrder)
                ?.label || "Sort by"}
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isSortOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 mt-2 w-full sm:w-48 bg-white rounded-md shadow-lg z-10 border">
              <div className="py-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onFilterChange("sortOrder", option.value);
                      setIsSortOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Area Toggle */}
      <div className="flex items-center gap-4">
        <p className="text-sm font-medium">Area:</p>
        <div className="flex border rounded-md overflow-hidden">
          <button
            onClick={() => {
              onFilterChange("area", "face");
              onFilterChange("bodyPart", "all");
            }}
            className={`px-4 py-2 text-sm ${
              filters.area === "face"
                ? "bg-cyan-800 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Face
          </button>
          <button
            onClick={() => {
              onFilterChange("area", "body");
              onFilterChange("bodyPart", "all");
            }}
            className={`px-4 py-2 text-sm ${
              filters.area === "body"
                ? "bg-cyan-800 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Body
          </button>
        </div>
      </div>

      {/* Body Parts Tiles - Only shown when area is body */}
      {filters.area === "body" && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Body Part:</p>
          <div className="flex flex-wrap gap-2">
            {bodyParts.map((part) => (
              <button
                key={part}
                onClick={() => onFilterChange("bodyPart", part)}
                className={`px-4 py-2 rounded-full text-sm border ${
                  filters.bodyPart === part
                    ? "bg-cyan-800 text-white border-cyan-800"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {part === "all" ? "All Body Parts" : capitalize(part)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Only show face filters when area is face */}
      {filters.area === "face" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Product Type Filter */}
          <div>
            <p className="text-sm font-medium mb-2">Product Type</p>
            <div className="relative">
              <button
                onClick={() => setIsProductTypeOpen(!isProductTypeOpen)}
                className="px-4 py-2 border rounded-md flex items-center justify-between w-full"
              >
                <span>
                  {filters.type === "all"
                    ? "All Product Types"
                    : capitalize(filters.type)}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isProductTypeOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProductTypeOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border max-h-60 overflow-y-auto">
                  {productTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        onFilterChange("type", type);
                        setIsProductTypeOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        filters.type === type ? "bg-blue-50" : ""
                      }`}
                    >
                      {type === "all" ? "All Product Types" : capitalize(type)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Skin Impurity Filter */}
          <div>
            <p className="text-sm font-medium mb-2">Skin Impurity</p>
            <div className="relative">
              <button
                onClick={() => setIsImpurityOpen(!isImpurityOpen)}
                className="px-4 py-2 border rounded-md flex items-center justify-between w-full"
              >
                <span>
                  {filters.impurity === "all"
                    ? "All Impurities"
                    : capitalize(filters.impurity)}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isImpurityOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isImpurityOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border max-h-60 overflow-y-auto">
                  {skinImpurities.map((impurity) => (
                    <button
                      key={impurity}
                      onClick={() => {
                        onFilterChange("impurity", impurity);
                        setIsImpurityOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        filters.impurity === impurity ? "bg-blue-50" : ""
                      }`}
                    >
                      {impurity === "all"
                        ? "All Impurities"
                        : capitalize(impurity)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Severity Filter */}
          <div>
            <p className="text-sm font-medium mb-2">Severity</p>
            <div className="relative">
              <button
                onClick={() => setIsSeverityOpen(!isSeverityOpen)}
                className="px-4 py-2 border rounded-md flex items-center justify-between w-full"
              >
                <span>
                  {filters.severity === "all"
                    ? "All Severities"
                    : capitalize(filters.severity)}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isSeverityOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isSeverityOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border max-h-60 overflow-y-auto">
                  {severityTypes.map((severity) => (
                    <button
                      key={severity}
                      onClick={() => {
                        onFilterChange("severity", severity);
                        setIsSeverityOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        filters.severity === severity ? "bg-blue-50" : ""
                      }`}
                    >
                      {severity === "all"
                        ? "All Severities"
                        : capitalize(severity)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Skin Type Filter */}
          <div>
            <p className="text-sm font-medium mb-2">Skin Type</p>
            <div className="relative">
              <button
                onClick={() => setIsSkinTypeOpen(!isSkinTypeOpen)}
                className="px-4 py-2 border rounded-md flex items-center justify-between w-full"
              >
                <span>
                  {filters.skinType === "all"
                    ? "All Skin Types"
                    : capitalize(filters.skinType)}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isSkinTypeOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isSkinTypeOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border max-h-60 overflow-y-auto">
                  {skinTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        onFilterChange("skinType", type);
                        setIsSkinTypeOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        filters.skinType === type ? "bg-blue-50" : ""
                      }`}
                    >
                      {type === "all" ? "All Skin Types" : capitalize(type)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <p className="text-sm font-medium mb-2">Date Range</p>
            <div className="relative">
              <button
                onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                className="px-4 py-2 border rounded-md flex items-center justify-between w-full"
              >
                <span>
                  {dateRanges.find((range) => range.value === filters.dateRange)
                    ?.label || "Date Range"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isDateRangeOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDateRangeOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border max-h-60 overflow-y-auto">
                  {dateRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => {
                        onFilterChange("dateRange", range.value);
                        setIsDateRangeOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        filters.dateRange === range.value ? "bg-blue-50" : ""
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Products Page Component
const Products = () => {
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

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by area first
    if (filters.area === "body") {
      result = result.filter((product) => product.area === "body");
      if (filters.bodyPart !== "all") {
        result = result.filter(
          (product) => product.bodyPart === filters.bodyPart
        );
      }
    } else {
      result = result.filter((product) => product.area === "face");
      // Apply face-specific filters
      if (filters.severity !== "all") {
        result = result.filter(
          (product) => product.severity === filters.severity
        );
      }
      if (filters.type !== "all") {
        result = result.filter((product) => product.type === filters.type);
      }
      if (filters.impurity !== "all") {
        result = result.filter(
          (product) => product.impurity === filters.impurity
        );
      }
      if (filters.skinType !== "all") {
        result = result.filter(
          (product) => product.skinType === filters.skinType
        );
      }
    }

    // Apply date range filter (works for both face and body)
    if (filters.dateRange !== "all") {
      const today = new Date();
      const cutoffDate = new Date();

      switch (filters.dateRange) {
        case "week":
          cutoffDate.setDate(today.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(today.getMonth() - 1);
          break;
        case "3months":
          cutoffDate.setMonth(today.getMonth() - 3);
          break;
        case "year":
          cutoffDate.setFullYear(today.getFullYear() - 1);
          break;
      }

      result = result.filter((product) => {
        const productDate = new Date(product.createdAt);
        return productDate >= cutoffDate;
      });
    }

    // Apply sorting
    switch (filters.sortOrder) {
      case "name-asc":
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return result.sort((a, b) => b.name.localeCompare(a.name));
      case "severity-asc":
        const severityOrder = { mild: 1, moderate: 2, severe: 3 };
        return result.sort(
          (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
        );
      case "severity-desc":
        const severityOrderDesc = { mild: 3, moderate: 2, severe: 1 };
        return result.sort(
          (a, b) =>
            severityOrderDesc[a.severity] - severityOrderDesc[b.severity]
        );
      case "date-asc":
        return result.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "date-desc":
        return result.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      default:
        return result;
    }
  }, [filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:ml-[240px] relative">
      <Sidebar />
      <Navbar />

      {/* Main Content Area */}
      <div className="mt-16 md:mt-20 max-w-6xl mx-auto px-2 sm:px-4">
        {/* Product Filters */}
        <ProductFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-gray-500">
              Try changing your filters to see more products.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
