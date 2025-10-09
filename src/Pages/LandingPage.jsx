import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useLandingPageData } from "./hooks/LandingPage/lp_hook";
import { skinTypes } from "../Pages/utils/SkintypesData";

// --- CONSTANTS ---
const ALL_IMPURITIES = [
  "Redness",
  "Acne",
  "Blackheads",
  "Wrinkles",
  "Dark Circles",
];

// --- HELPER FUNCTION ---
const getSkinTypeImageUrl = (typeName) => {
  const typeData = skinTypes.find((st) => st.id === typeName);
  return typeData?.imageUrl?.[0];
};

// --- MAIN COMPONENT ---
const LandingPage = ({ user }) => {
  const { data, loading, error } = useLandingPageData();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:ml-[240px] flex items-center justify-center">
        <Sidebar />

        <div className="text-lg text-gray-600">Loading your dashboard...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:ml-[240px] flex items-center justify-center">
        <Sidebar />

        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Failed to load skin data
          </h2>
          <p className="text-gray-500 mt-2">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  const handleSeeMore = () => navigate("/product");
  const analyticsMap = new Map(
    data.faceAnalytics.map((item) => [item.label, item.value])
  );
  const skinTypeImage = getSkinTypeImageUrl(data.skinType);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:ml-[240px]">
      <Sidebar />

      <main className="max-w-7xl mx-auto ">
        <header className="mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-800"
          >
            Hello, <span className="text-cyan-800">{data.firstName}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-500 mt-1"
          >
            Here's a summary of your latest skin analysis.
          </motion.p>
        </header>

        {/* Symmetrical Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top-Left: Key Problems */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-sm p-6 border"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              Key Problems (Face)
            </h2>
            <div className="space-y-5">
              {data.faceKeyProblems.length > 0 ? (
                data.faceKeyProblems.map((problem) => (
                  <div key={problem.label}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {problem.label}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">
                        {problem.value}%
                      </span>
                    </div>
                    <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          problem.severity === "severe"
                            ? "bg-red-400"
                            : problem.severity === "moderate"
                            ? "bg-yellow-400"
                            : "bg-green-400"
                        }`}
                        style={{ width: `${problem.value}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic text-center py-4">
                  No significant issues detected.
                </p>
              )}
            </div>
          </motion.div>

          {/* Top-Middle: Body Impurities (Dark Card) */}
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-800 text-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-5">Body Impurities</h2>
            <div className="space-y-3">
              {data.bodyImpurities.length > 0 ? (
                data.bodyImpurities.map((imp, i) => (
                  <div
                    key={i}
                    className="bg-gray-700 rounded-lg p-3 flex justify-between items-center"
                  >
                    <h3 className="font-semibold text-gray-100">{imp.label}</h3>
                    <p className="text-xs text-gray-400">
                      {new Date(imp.detected_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic text-center py-4">
                  Your body skin appears clear.
                </p>
              )}
            </div>
          </motion.div>

          {/* Top-Right: Skin Type */}
          <motion.div
            custom={3}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-sm overflow-hidden h-[244px] relative flex flex-col justify-end p-6 border"
          >
            {skinTypeImage && (
              <img
                src={skinTypeImage}
                alt={data.skinType}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
            <div className="relative z-10 text-white">
              <p className="text-sm uppercase tracking-wider">Your Skin Type</p>
              <h2 className="text-4xl font-bold mt-1">
                {data.skinType || "N/A"}
              </h2>
            </div>
          </motion.div>

          {/* Bottom Row: Full Width Analytics (Dark Card) */}
          <motion.div
            custom={4}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 bg-gray-800 text-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-center mb-6">
              Skin Issues Analytics (Face)
            </h2>
            <div className="space-y-6 px-2">
              {" "}
              {/* Increased vertical spacing */}
              {ALL_IMPURITIES.map((imp) => {
                const value = analyticsMap.get(imp) || 0;
                return (
                  <div key={imp} className="flex items-center gap-6">
                    {" "}
                    {/* Increased horizontal gap */}
                    <span className="w-28 text-sm font-light text-gray-300">
                      {imp}
                    </span>
                    <div className="flex-1 bg-gray-700 rounded-full h-6 relative">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${value}%`,
                          backgroundColor:
                            value >= 75
                              ? "#f87171" // red-400
                              : value >= 50
                              ? "#facc15" // yellow-400
                              : "#4ade80", // green-400
                        }}
                      />
                    </div>
                    <span className="w-12 text-right text-sm font-semibold text-gray-100">
                      {value}%
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Bottom-Right: Recent Products */}
          <motion.div
            custom={5}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-sm p-6 border"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Recent Products
              </h2>
              {data.recentProducts.length > 0 && (
                <button
                  onClick={handleSeeMore}
                  className="text-sm text-cyan-700 hover:underline font-medium"
                >
                  See All
                </button>
              )}
            </div>
            <div className="space-y-4">
              {data.recentProducts.length > 0 ? (
                data.recentProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <img
                      src={product.product_details?.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {product.product_details?.area || "N/A"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic text-center py-4">
                  You have no saved products.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
