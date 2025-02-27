import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const bodyParts = [
  { label: "Face", path: "/db", icon: "👤" },
  { label: "Arms", path: "/arms", icon: "💪" },
  { label: "Hands", path: "/analysis/hands", icon: "🤲" },
  { label: "Legs", path: "/legs", icon: "🦵" },
  { label: "Feet", path: "/analysis/feet", icon: "🦶" },
  { label: "Back", path: "/back", icon: "⬆️" },
];

const BodyPartNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const currentPart = bodyParts[0]; // Default to Face

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-3 bg-cyan-900 rounded-lg shadow-sm hover:bg-cyan-700 transition-colors border border-gray-200"
      >
        <span className="text-xl">{currentPart.icon}</span>
        <span className=" text-white">{currentPart.label} Analysis</span>
        <ChevronDown
          size={20}
          className={`text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-48 bg-cyan-900 rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            {bodyParts.map((part) => (
              <button
                key={part.path}
                onClick={() => {
                  navigate(part.path);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-cyan-700 transition-colors"
              >
                <span className="text-xl">{part.icon}</span>
                <span className="text-white">{part.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BodyPartNav;
