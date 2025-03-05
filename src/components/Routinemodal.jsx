import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const RoutineModal = ({ showDialog, setShowDialog }) => {
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
            className="bg-white  border-gray-200 px-8 py-6 rounded-lg max-w-md w-full mx-4 relative shadow-lg"
          >
            <button
              onClick={() => setShowDialog(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center">
              Build or Generate Your Routine
            </h3>
            <p className="text-gray-600 text-center">
              Do you prefer to create your own routine or generate a
              personalized routine based on your skin type?
            </p>
            <div className="flex justify-center gap-5 mt-6">
              <button
                onClick={() => {
                  setShowDialog(false);
                  navigate("/generate-routine");
                }}
                className="px-8 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Generate Routine
              </button>
              <button
                onClick={() => {
                  setShowDialog(false);
                  navigate("/routine");
                }}
                className="px-8 py-2 text-sm bg-cyan-800 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Build My Own
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoutineModal;
