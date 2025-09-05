import { useEffect, useState, useMemo } from "react";
import { X } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { fetchFaceProductToProductRoutines } from "../../service/routineproductsService";
import { ProductCard } from "../Products/ProductCards"; // Import the ProductCard component

const ProductListDialog = ({ open, onClose, onSelectProduct }) => {
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "all",
    impurity: "all",
    skinType: "all",
    area: "face",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        setUserProducts([]);
        setLoading(false);
        return;
      }

      if (user) {
        // Fetch products only once. The service handles the URL formatting.
        const fetchedProducts = await fetchFaceProductToProductRoutines(
          user.id
        );
        console.log("✅ Products fetched from DB:", fetchedProducts);
        setUserProducts(fetchedProducts);
      } else {
        console.warn("No user logged in, cannot fetch saved products.");
        setUserProducts([]);
      }
      setLoading(false);
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

  console.log("👀 Filtered products to display:", filteredProducts.length);

  const handleProductClick = (product) => {
    onSelectProduct(product);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
            {/* ... your filter selects ... */}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
    </div>
  );
};

export default ProductListDialog;
