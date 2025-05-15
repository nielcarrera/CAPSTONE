import { useState, useMemo } from "react";
import { X } from "lucide-react";
import {
  products,
  skinImpurities,
  skinTypes,
} from "../../Pages/utils/Productdata";

const ProductListDialog = ({ open, onClose, onSelectProduct }) => {
  const [filters, setFilters] = useState({
    type: "all",
    impurity: "all",
    skinType: "all",
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return (
        (filters.type === "all" || product.type === filters.type) &&
        (filters.impurity === "all" || product.impurity === filters.impurity) &&
        (filters.skinType === "all" || product.skinType === filters.skinType)
      );
    });
  }, [filters]);

  const handleProductClick = (productName) => {
    onSelectProduct(productName);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg w-full max-w-6xl border-1 relative flex flex-col"
        style={{ height: "80vh" }} // Fixed height for the dialog box
      >
        <div className="p-6 flex-grow overflow-auto">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-semibold mb-4">Select Product</h2>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Product Type
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="w-full rounded border border-gray-300 p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="cleanser">Cleanser</option>
                <option value="serum">Serum</option>
                <option value="moisturizer">Moisturizer</option>
                <option value="treatment">Treatment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Skin Concern
              </label>
              <select
                value={filters.impurity}
                onChange={(e) =>
                  setFilters({ ...filters, impurity: e.target.value })
                }
                className="w-full rounded border border-gray-300 p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Concerns</option>
                {skinImpurities
                  .filter((i) => i !== "all")
                  .map((impurity) => (
                    <option key={impurity} value={impurity}>
                      {impurity.charAt(0).toUpperCase() + impurity.slice(1)}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Skin Type
              </label>
              <select
                value={filters.skinType}
                onChange={(e) =>
                  setFilters({ ...filters, skinType: e.target.value })
                }
                className="w-full rounded border border-gray-300 p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                {skinTypes
                  .filter((t) => t !== "all")
                  .map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.name)}
                className="border rounded-lg p-3 hover:shadow-md cursor-pointer transition-all"
              >
                <div className="h-40 overflow-hidden rounded mb-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-sm">{product.name}</h3>
                <p className="text-xs text-gray-500">{product.brand}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {product.type}
                  </span>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                    {product.skinType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListDialog;
