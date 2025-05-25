import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { products } from "../Pages/utils/Productdata";
import BodyRecommendedProductsDialog from "../components/BodyReccomendedProductsDialog";

const loadingMessages = [
  "Analyzing your body concern...",
  "Examining the affected area...",
  "Consulting our body care database...",
  "Selecting appropriate products...",
  "Considering your skin sensitivity...",
  "Your personalized body care solution is ready!",
];

const RecommendationModal_Body = ({
  showDialog,
  setShowDialog,
  impurity,
  onGenerate,
  isGenerating,
}) => {
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const getFilteredProducts = () => {
    if (!impurity) return [];

    // First try to find exact matches (body part + impurity)
    let filtered = products.filter((product) => {
      const bodyPartMatch =
        product.area === "body" &&
        product.bodyPart?.toLowerCase() === impurity.bodyPart?.toLowerCase();
      const impurityMatch =
        product.impurity?.toLowerCase() === impurity.label?.toLowerCase();
      return bodyPartMatch && impurityMatch;
    });

    // If no exact matches, find partial matches
    if (filtered.length === 0) {
      filtered = products
        .filter((product) => {
          return (
            (product.area === "body" &&
              product.bodyPart?.toLowerCase() ===
                impurity.bodyPart?.toLowerCase()) ||
            product.impurity?.toLowerCase() === impurity.label?.toLowerCase()
          );
        })
        .slice(0, 3); // Limit to 3 products
    }

    return filtered;
  };

  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= loadingMessages.length) {
          clearInterval(interval);
          return loadingMessages.length - 1;
        }
        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    setCurrentMessage(loadingMessages[messageIndex]);
  }, [messageIndex]);

  useEffect(() => {
    if (
      !isGenerating &&
      showDialog &&
      messageIndex === loadingMessages.length - 1
    ) {
      const recommendations = getFilteredProducts();
      setRecommendedProducts(recommendations);
      console.log(
        "✅ Final check - showResults will be:",
        recommendations.length > 0
      );
      setShowResults(recommendations.length > 0); // or just true for testing
    }
  }, [isGenerating, showDialog, messageIndex, impurity]);

  const handleGenerate = () => {
    onGenerate(impurity);
  };

  console.log({
    showResults,
    showDialog,
    isGenerating,
    messageIndex,
    targetIndex: loadingMessages.length - 1,
  });

  const handleClose = () => {
    setShowDialog(false);
    setShowResults(false);
  };

  return (
    <>
      <AnimatePresence>
        {showDialog && !showResults && (
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
              className="bg-white rounded-lg max-w-md w-full mx-4 overflow-hidden"
            >
              <div className="p-6">
                {!isGenerating ? (
                  <>
                    <h3 className="text-xl font-semibold mb-4">
                      Generate Product Recommendations
                    </h3>
                    <div className="space-y-3 mb-6">
                      <p className="text-gray-600">
                        We'll analyze your <strong>{impurity?.label}</strong> on{" "}
                        <strong>{impurity?.bodyPart}</strong> and create a
                        personalized body care solution.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                      <button
                        onClick={handleGenerate}
                        className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Generate Now
                      </button>
                      <button
                        onClick={handleClose}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-700 mb-2">{currentMessage}</p>
                    <p className="text-sm text-gray-500">
                      Creating solution for {impurity?.bodyPart.toLowerCase()}
                      ...
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showResults && (
        <BodyRecommendedProductsDialog
          showDialog={showResults}
          onClose={handleClose}
          recommendedProducts={recommendedProducts}
          bodyPart={impurity?.bodyPart}
          impurity={impurity}
        />
      )}
    </>
  );
};

export default RecommendationModal_Body;
