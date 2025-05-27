import { useEffect, useState, useMemo } from "react";
import { X } from "lucide-react";
import { skinImpurities, skinTypes } from "../../Pages/utils/Productdata";
import { fetchFaceProductToProductRoutines } from "../../service/routineproductsService";

const ProductListDialog = ({ open, onClose, onSelectProduct }) => {
  const [filters, setFilters] = useState({
    type: "all",
    impurity: "all",
    skinType: "all",
    area: "face", // Added area filter
  });

  const [userProducts, setUserProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await fetchFaceProductToProductRoutines();
        console.log("✅ Products fetched from DB:", products);
        setUserProducts(products);
      } catch (error) {
        console.error("❌ Failed to fetch face products:", error);
      }
    };

    if (open) {
      fetchProducts();
    }
  }, [open]);
  console.log("🧪 Current filters:", filters);

  const filteredProducts = useMemo(() => {
    return userProducts.filter((product) => {
      const matchesArea =
        filters.area === "all" || product.area === filters.area;
      const matchesType =
        filters.type === "all" || product.type === filters.type;
      const matchesImpurity =
        filters.impurity === "all" ||
        product.impurity === filters.impurity ||
        filters.area === "body";
      const matchesSkinType =
        filters.skinType === "all" ||
        product.skinType === filters.skinType ||
        filters.area === "body";

      return matchesArea && matchesType && matchesImpurity && matchesSkinType;
    });
  }, [filters, userProducts]);

  // ✅ Now it's safe to log
  console.log("👀 Filtered products to display:", filteredProducts.length);

  const handleProductClick = (product) => {
    onSelectProduct(product);

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg w-full max-w-6xl border relative flex flex-col"
        style={{ height: "80vh" }}
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            {/* Area Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Area</label>
              <select
                value={filters.area}
                onChange={(e) =>
                  setFilters({ ...filters, area: e.target.value })
                }
                className="w-full rounded border border-gray-300 p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Areas</option>
                <option value="face">Face</option>
                <option value="body">Body</option>
              </select>
            </div>

            {/* Product Type Filter */}
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
                <option value="exfoliant">Exfoliant</option>
                <option value="toner">Toner</option>
              </select>
            </div>

            {/* Skin Concern Filter (only for face) */}
            {filters.area !== "body" && (
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
            )}

            {/* Skin Type Filter (only for face) */}
            {filters.area !== "body" && (
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
            )}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="border rounded-lg p-3 hover:shadow-md cursor-pointer transition-all flex flex-col"
              >
                <div className="h-40 overflow-hidden rounded mb-2 bg-gray-100 flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">No image</div>
                  )}
                </div>
                <h3 className="font-medium text-sm">{product.name}</h3>
                <p className="text-xs text-gray-500">{product.brand}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {product.type}
                  </span>
                  {product.area === "face" ? (
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                      {product.skinType}
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      {product.area.charAt(0).toUpperCase() +
                        product.area.slice(1)}
                    </span>
                  )}
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
