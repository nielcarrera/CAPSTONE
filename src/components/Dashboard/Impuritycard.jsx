// src/components/ImpurityDetailsCard.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getColorByValue } from "../../Pages/utils/DummyData";
import { skinIssueDetails } from "../../Pages/utils/SkinIssueconfig";

const ImpurityDetailsCard = ({ impurity, index }) => {
  const [activeTab, setActiveTab] = useState("Description");

  const details = skinIssueDetails[impurity.label] || {};
  const tabs = ["Description", "Cause", "Prevention", "References"];

  return (
    <motion.div
      key={`${impurity.label}-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex flex-col gap-4 p-6 border border-gray-200 rounded-lg bg-white shadow-sm"
    >
      {/* Top Section: Image and Stats */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0 shadow-md mx-auto md:mx-0">
          <img
            src={impurity.image}
            alt={impurity.label}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Content Area */}
        <div className="flex-grow flex flex-col">
          {/* Title and Percentage */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-xl text-gray-800">
              {impurity.label}
            </h3>
            <span
              className="text-xl font-bold"
              style={{ color: getColorByValue(impurity.value) }}
            >
              {impurity.value}%
            </span>
          </div>

          {/* Percentage Bar */}
          <div className="h-3 w-full mb-5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full"
              style={{
                width: `${impurity.value}%`,
                backgroundColor: getColorByValue(impurity.value),
              }}
            />
          </div>

          {/* Dynamic Content - Placed below percentage bar and right of image */}
          <div className="min-h-[100px] text-gray-700 mb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              >
                {activeTab === "Description" && (
                  <p className="leading-relaxed">{impurity.description}</p>
                )}
                {activeTab === "Cause" && (
                  <p className="leading-relaxed">{details.cause}</p>
                )}
                {activeTab === "Prevention" && (
                  <p className="leading-relaxed">{details.prevention}</p>
                )}
                {activeTab === "References" && (
                  <ul className="list-disc list-inside space-y-1">
                    {details.references?.map((ref, idx) => (
                      <li key={idx}>
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
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Tab Buttons - Elevated with gray-800 background */}
      <div className="flex flex-wrap gap-2 mt-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab
                ? "bg-gray-800 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm"
            }`}
          >
            {tab}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ImpurityDetailsCard;
