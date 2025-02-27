import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const RecommendationModal = ({ showDialog, setShowDialog }) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {showDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-white border-1 border-gray-800  px-15 py-3    rounded-lg max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold mb-5 ml-5">
              Generate Product Recommendation
            </h3>
            <p className="text-gray-600">
              Start generating product recommendations based on identified
              impurities?
            </p>
            <div className="flex justify-center gap-5 mt-6">
              <button
                onClick={() => {
                  setShowDialog(false);
                  navigate("/recommendations");
                }}
                className="px-10 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Let's Go
              </button>
              <button
                onClick={() => setShowDialog(false)}
                className="px-10 py-3 border text-sm bg-red-600 rounded-lg text-white hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecommendationModal;
