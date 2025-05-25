import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const ProductRecommendationCard = ({ product, onClaim, onDiscard }) => {
  const severityClasses = {
    mild: "bg-green-100 text-green-800",
    moderate: "bg-yellow-100 text-yellow-800",
    severe: "bg-red-100 text-red-800",
    default: "bg-gray-100 text-gray-800",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col"
      style={{ minWidth: "200px" }}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              severityClasses[product.severity] || severityClasses.default
            }`}
          >
            {product.severity}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{product.brand}</span>
          <span className="text-xs text-gray-500">{product.type}</span>
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {product.impurity}
          </span>
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
            {product.bodyPart || product.skinType}
          </span>
        </div>
        <div className="flex gap-2 mt-auto">
          <button
            onClick={onClaim}
            className="flex-1 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-600 transition-colors"
          >
            Claim
          </button>
          <button
            onClick={onDiscard}
            className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Discard
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const SuccessNotification = ({ show, onView }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate("/products");
    onView();
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3"
    >
      <CheckCircle className="text-green-500" />
      <span>Product claimed successfully!</span>
      <button
        onClick={handleView}
        className="text-green-700 font-semibold hover:text-green-800"
      >
        View
      </button>
    </motion.div>
  );
};

const BodyRecommendedProductsDialog = ({
  showDialog,
  onClose,
  recommendedProducts = [],
  bodyPart,
  impurity,
}) => {
  const [products, setProducts] = useState(recommendedProducts);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClaim = (productId) => {
    const claimedProduct = products.find((p) => p.id === productId);
    // Here you would typically save to database
    console.log("Claimed product:", claimedProduct);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDiscard = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const getGridClass = () => {
    const count = products.length;
    if (count === 1) return "grid-cols-1 max-w-md mx-auto";
    if (count === 2) return "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto";
    if (count === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  };

  return (
    <>
      <SuccessNotification
        show={showSuccess}
        onView={() => setShowSuccess(false)}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-white rounded-lg w-full max-w-6xl mx-4 overflow-y-auto max-h-[90vh]"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                Recommended Body Care Products
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600">
                For <strong>{bodyPart}</strong> with{" "}
                <strong>{impurity?.label}</strong> concern
              </p>
            </div>

            <div className={`grid ${getGridClass()} gap-4`}>
              {products.map((product) => (
                <ProductRecommendationCard
                  key={product.id}
                  product={product}
                  onClaim={() => handleClaim(product.id)}
                  onDiscard={() => handleDiscard(product.id)}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Finish
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default BodyRecommendedProductsDialog;
