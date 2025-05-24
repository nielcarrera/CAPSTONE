// src/components/WalkthroughTour.jsx

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const WalkthroughTour = ({
  showTour,
  tourSteps,
  tourStep,
  nextStep,
  prevStep,
  endTour,
}) => {
  if (!showTour) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-0 left-0 right-0 mx-auto z-30 border border-cyan-800 bg-white rounded-t-lg shadow-xl w-full max-w-md p-2 sm:bottom-8 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 sm:rounded-lg sm:p-4"
        style={{ marginLeft: 0 }}
      >
        <div className="flex justify-between items-start mb-1 sm:mb-2">
          <h3 className="font-bold text-base sm:text-lg">
            {tourSteps[tourStep]?.title}
          </h3>
          <button
            onClick={endTour}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-gray-600 mb-2 sm:mb-4 text-sm sm:text-base">
          {tourSteps[tourStep]?.content}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 w-full justify-center items-center">
          <button
            onClick={prevStep}
            disabled={tourStep === 0}
            className="px-2 py-1 rounded-md bg-gray-200 text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            className="px-2 py-1 rounded-md bg-blue-600 text-white text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            {tourStep === tourSteps.length - 1 ? "Finish" : "Next"}
          </button>
          <button
            onClick={endTour}
            className="px-2 py-1 rounded-md bg-gray-100 text-gray-500 text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors w-full sm:w-auto"
          >
            Close
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WalkthroughTour;
