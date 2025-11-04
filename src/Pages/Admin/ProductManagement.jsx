import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Package,
  User,
  Square, // Alternative for Body icon
} from "lucide-react";
import ProductModal from "./Components/ProductModal";
import { fetchFaceProducts } from "./Products";

// Predefined filter options
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

const skinImpurities = [
  "all",
  "redness",
  "wrinkles",
  "blackheads",
  "darkcircles",
  "acne",
];

const skinTypes = ["all", "normal", "oily", "dry", "sensitive"];

const bodyParts = ["all", "arms", "legs", "back", "chest", "hands", "feet"];

// Mock data for face products
const mockFaceProducts = [
  {
    id: 1,
    type: "cleanser",
    name: "Gentle Foaming Cleanser",
    description:
      "A gentle foaming cleanser that removes impurities without stripping skin",
    severity: "mild",
    area: "face",
    image: "/images/cleanser.jpg",
    ingredients: ["Glycerin", "Aloe Vera", "Chamomile Extract"],
    skinType: "all",
    impurity: "oil",
    cautions: ["Avoid eye area"],
    usage: "Use morning and evening",
    brand: "SkinCare Co",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    type: "serum",
    name: "Vitamin C Brightening Serum",
    description: "Antioxidant-rich serum for brightening and even skin tone",
    severity: "moderate",
    area: "face",
    image: "/images/serum.jpg",
    ingredients: ["Vitamin C", "Hyaluronic Acid", "Ferulic Acid"],
    skinType: "normal,dry",
    impurity: "hyperpigmentation",
    cautions: ["Use sunscreen daily"],
    usage: "Apply 2-3 drops in the morning",
    brand: "Glow Labs",
    createdAt: "2024-02-20",
  },
];

// Mock data for body products
const mockBodyProducts = [
  {
    id: 3,
    type: "lotion",
    name: "Hydrating Body Lotion",
    description: "Deeply moisturizing lotion for dry skin",
    area: "body",
    image: "/images/lotion.jpg",
    ingredients: ["Shea Butter", "Coconut Oil", "Vitamin E"],
    skinType: "dry",
    impurity: "dryness",
    cautions: [],
    usage: "Apply daily after shower",
    bodypart: "all",
    brand: "BodyCare",
    createdAt: "2024-03-10",
  },
  {
    id: 4,
    type: "scrub",
    name: "Exfoliating Body Scrub",
    description: "Gentle exfoliating scrub for smooth skin",
    area: "body",
    image: "/images/scrub.jpg",
    ingredients: ["Sugar", "Jojoba Oil", "Essential Oils"],
    skinType: "normal",
    impurity: "roughness",
    cautions: ["Not for sensitive skin"],
    usage: "Use 2-3 times weekly",
    bodypart: "arms,legs",
    brand: "BodyCare",
    createdAt: "2024-03-15",
  },
];

// Filter Panel Component
const FilterPanel = ({
  showFilters,
  filters,
  onFilterChange,
  onClearFilters,
  currentTab,
}) => {
  const filterOptions = {
    face: [
      { key: "type", label: "Type", options: productTypes },
      { key: "severity", label: "Severity", options: severityTypes },
      { key: "skinType", label: "Skin Type", options: skinTypes },
      { key: "impurity", label: "Impurity", options: skinImpurities },
    ],
    body: [
      { key: "type", label: "Type", options: productTypes },
      { key: "skinType", label: "Skin Type", options: skinTypes },
      { key: "impurity", label: "Impurity", options: skinImpurities },
      { key: "bodypart", label: "Body Part", options: bodyParts },
    ],
  };

  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filterOptions[currentTab].map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {filter.label}
                </label>
                <select
                  value={filters[filter.key]}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {filter.options.map((option) => (
                    <option key={option} value={option}>
                      {option === "all"
                        ? `All ${filter.label}s`
                        : option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={onClearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProductManagement = () => {
  const [faceProducts, setFaceProducts] = useState([]);
  const [loadingFace, setLoadingFace] = useState(false);
  const [bodyProducts, setBodyProducts] = useState(mockBodyProducts);
  const [currentTab, setCurrentTab] = useState("face");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    type: "all",
    severity: "all",
    skinType: "all",
    impurity: "all",
    bodypart: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get current products based on tab
  const currentProducts = currentTab === "face" ? faceProducts : bodyProducts;

  // Filter products
  const filteredProducts = useMemo(() => {
    return currentProducts.filter((product) => {
      const brandText = (product.brand || "").toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brandText.includes(searchTerm.toLowerCase());

      const matchesType =
        filters.type === "all" || product.type === filters.type;
      const matchesSkinType =
        filters.skinType === "all" ||
        product.skinType.split(",").includes(filters.skinType);
      const matchesImpurity =
        filters.impurity === "all" || product.impurity === filters.impurity;

      // Face-specific filters
      const matchesSeverity =
        currentTab === "body" ||
        filters.severity === "all" ||
        product.severity === filters.severity;

      // Body-specific filters
      const matchesBodyPart =
        currentTab === "face" ||
        filters.bodypart === "all" ||
        (product.bodypart && product.bodypart.includes(filters.bodypart));

      return (
        matchesSearch &&
        matchesType &&
        matchesSkinType &&
        matchesImpurity &&
        matchesSeverity &&
        matchesBodyPart
      );
    });
  }, [currentProducts, searchTerm, filters, currentTab]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      severity: "all",
      skinType: "all",
      impurity: "all",
      bodypart: "all",
    });
  };

  const openAddModal = () => {
    setModalType("add");
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalType("edit");
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setModalType("delete");
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // CRUD functions
  const handleAddProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: Math.max(...currentProducts.map((p) => p.id), 0) + 1,
      createdAt: new Date().toISOString(),
      area: currentTab, // Set area based on current tab
    };

    if (currentTab === "face") {
      setFaceProducts((prev) => [...prev, newProduct]);
    } else {
      setBodyProducts((prev) => [...prev, newProduct]);
    }
  };

  const handleUpdateProduct = (productData) => {
    if (currentTab === "face") {
      setFaceProducts((prev) =>
        prev.map((p) =>
          p.id === productData.id ? { ...p, ...productData } : p
        )
      );
    } else {
      setBodyProducts((prev) =>
        prev.map((p) =>
          p.id === productData.id ? { ...p, ...productData } : p
        )
      );
    }
  };

  const handleDeleteProduct = (productId) => {
    if (currentTab === "face") {
      setFaceProducts((prev) => prev.filter((p) => p.id !== productId));
    } else {
      setBodyProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  // Table columns configuration
  const tableColumns = {
    face: [
      { key: "name", label: "Product", sortable: true },
      { key: "type", label: "Type", sortable: true },
      { key: "severity", label: "Severity", sortable: true },
      { key: "skinType", label: "Skin Type", sortable: true },
      { key: "impurity", label: "Impurity", sortable: true },
    ],
    body: [
      { key: "name", label: "Product", sortable: true },
      { key: "type", label: "Type", sortable: true },
      { key: "bodypart", label: "Body Part", sortable: true },
      { key: "skinType", label: "Skin Type", sortable: true },
      { key: "impurity", label: "Impurity", sortable: true },
    ],
  };

  useEffect(() => {
    loadFaceProducts();
  }, []);

  const loadFaceProducts = async () => {
    try {
      setLoadingFace(true);
      const products = await fetchFaceProducts();
      if (Array.isArray(products)) {
        setFaceProducts(products);
      } else {
        console.warn("fetchFaceProducts returned unexpected value:", products);
      }
    } catch (err) {
      console.error("Failed to load face products:", err);
    } finally {
      setLoadingFace(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Product Management
              </h1>
              <p className="text-lg text-gray-600">
                Manage face and body care products separately
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder={`Search ${currentTab} products...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-full sm:w-80"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <Filter size={20} className="mr-2" />
                Filters
                {Object.values(filters).some((value) => value !== "all") && (
                  <span className="ml-2 bg-cyan-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {
                      Object.values(filters).filter((value) => value !== "all")
                        .length
                    }
                  </span>
                )}
              </button>

              <button
                onClick={openAddModal}
                className="flex items-center justify-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Plus size={20} className="mr-2" />
                Add {currentTab === "face" ? "Face" : "Body"} Product
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-2 w-fit">
          <button
            onClick={() => {
              setCurrentTab("face");
              setCurrentPage(1);
              clearFilters();
            }}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              currentTab === "face"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <User size={20} className="mr-2" />
            Face Products
            <span
              className={`ml-2 px-2 py-1 text-xs rounded-full ${
                currentTab === "face"
                  ? "bg-white text-cyan-600"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {faceProducts.length}
            </span>
          </button>

          <button
            onClick={() => {
              setCurrentTab("body");
              setCurrentPage(1);
              clearFilters();
            }}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              currentTab === "body"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Square size={20} className="mr-2" />
            Body Products
            <span
              className={`ml-2 px-2 py-1 text-xs rounded-full ${
                currentTab === "body"
                  ? "bg-white text-cyan-600"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {bodyProducts.length}
            </span>
          </button>
        </div>

        {/* Filters Panel */}
        <FilterPanel
          showFilters={showFilters}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          currentTab={currentTab}
        />

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Package className="w-6 h-6 text-cyan-600" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {currentTab === "face" ? "Face" : "Body"} Products Directory
                  </h2>
                  <p className="text-sm text-gray-600">
                    {filteredProducts.length} products found
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-600">per page</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {tableColumns[currentTab].map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/50 transition-colors duration-150"
                  >
                    {/* Product Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-1 min-w-0">
                          <div className="text-lg font-semibold text-gray-900 truncate">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                      {product.type}
                    </td>

                    {/* Severity (Face) or Body Part (Body) */}
                    {currentTab === "face" ? (
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full capitalize ${
                            product.severity === "mild"
                              ? "bg-green-100 text-green-800"
                              : product.severity === "moderate"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.severity}
                        </span>
                      </td>
                    ) : (
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                        {product.bodypart || "-"}
                      </td>
                    )}

                    {/* Skin Type */}
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                      {product.skinType}
                    </td>

                    {/* Impurity */}
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                      {product.impurity || "-"}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(product)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {paginatedProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-sm font-medium text-gray-900">
                No {currentTab} products found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ||
                Object.values(filters).some((value) => value !== "all")
                  ? "Try adjusting your search or filters"
                  : `Get started by creating a new ${currentTab} product`}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredProducts.length
                  )}{" "}
                  of {filteredProducts.length} results
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? "bg-cyan-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        product={selectedProduct}
        onAdd={handleAddProduct}
        onEdit={handleUpdateProduct}
        onDelete={handleDeleteProduct}
        area={currentTab} // Pass current tab to modal
      />
    </div>
  );
};

export default ProductManagement;
