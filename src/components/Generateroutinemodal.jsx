import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import normal from "../assets/normal.jpg";

import dry from "../assets/dry.jpg";
import oily from "../assets/oily.jpg";

const skinTypeImages = {
  normal: normal,
  dry: dry,
  oily: oily,
};

const SkinTypeDialog = ({ showDialog, setShowDialog }) => {
  const navigate = useNavigate();

  const handleSkinTypeClick = (skinType) => {
    navigate(`/routine/${skinType}`);
    setShowDialog(false);
  };

  return (
    <AnimatePresence>
      {showDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowDialog(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white border border-gray-800 border-2 rounded-2xl max-w-3xl w-full mx-4 p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Centered Header */}
            <div className="flex justify-center">
              <h3 className="text-2xl mb-10 font-semibold mb-6 text-cyan-800 text-center">
                Choose Your Skin Type
              </h3>
            </div>

            {/* Horizontal Cards */}
            <div className="flex flex-col md:flex-row gap-2">
              {Object.entries(skinTypeImages).map(([skinType, image]) => (
                <motion.div
                  key={skinType}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSkinTypeClick(skinType)}
                  className="cursor-pointer bg-gray-50 border border-gray-400 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-gray-800 flex-1"
                >
                  <div className="aspect-square relative overflow-hidden rounded-lg mb-3">
                    <img
                      src={image}
                      alt={skinType}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-center font-medium text-gray-900 capitalize">
                    {skinType}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Note */}
            <p className="text-sm text-gray-600 mt-6 leading-relaxed text-center">
              Note: Each skin type has its own recommended skincare routines to
              ensure compatibility and obtain more efficient results over time.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SkinTypeDialog;
