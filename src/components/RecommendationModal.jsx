import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

const loadingMessages = [
  "Analyzing your skin concerns...",
  "Considering your skin type...",
  "Consulting our skincare database...",
  "Generating personalized recommendations...",
  "Almost there! Finalizing your routine...",
  "Your perfect skincare match is ready!",
];

const RecommendationModal = ({
  showDialog,
  setShowDialog,
  impurity,
  onGenerate,
  isGenerating,
  skinType,
}) => {
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= loadingMessages.length) return prev;
        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    setCurrentMessage(loadingMessages[messageIndex]);
  }, [messageIndex]);

  const handleGenerate = () => {
    onGenerate(impurity);
  };

  return (
    <AnimatePresence>
      {showDialog && (
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
                      We'll analyze your <strong>{impurity?.label}</strong>{" "}
                      concern ({impurity?.value}%) and create a personalized
                      routine.
                    </p>
                    <p className="text-gray-600">
                      Your skin type: <strong>{skinType}</strong> will be
                      considered.
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
                      onClick={() => setShowDialog(false)}
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
                    Analyzing for {skinType.toLowerCase()} skin...
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecommendationModal;
