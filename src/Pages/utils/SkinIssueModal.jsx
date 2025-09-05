// src/components/SkinIssueModal.jsx

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const SkinIssueModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const { label, description, cause, prevention, references } = data;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{label}</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                  aria-label="Close dialog"
                >
                  <X size={24} />
                </button>
              </div>

              <p className="text-gray-600 mb-6">{description}</p>

              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    🔍 Common Causes
                  </h3>
                  <p className="text-gray-600 text-sm">{cause}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    🛡️ Prevention Tips
                  </h3>
                  <p className="text-gray-600 text-sm">{prevention}</p>
                </div>
              </div>
            </div>

            {/* Footer with References */}
            <footer className="bg-gray-50 px-6 sm:px-8 py-4 border-t border-gray-200">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                References
              </h4>
              <ul className="space-y-1">
                {references?.map((ref, index) => (
                  <li key={index} className="text-xs">
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {ref.source}
                    </a>
                  </li>
                ))}
              </ul>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SkinIssueModal;
