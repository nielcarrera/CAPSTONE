import { useState } from "react";
import { ChevronDown, Share } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RecommendationModal from "../components/ReccomendationModal";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { skinIssues } from "../Pages/utils/SkinIssueconfig";

// Simplified analysis data structure
const analysisData = {
  "Feb 20, 2024 14:30": {
    keyProblems: [
      { label: "Acne", value: 80, severity: "severe" },
      { label: "Pores", value: 65, severity: "moderate" },
      { label: "Blackheads", value: 50, severity: "mild" },
    ],
    radarData: [
      { subject: "Whiteheads", A: 80 },
      { subject: "Pores", A: 65 },
      { subject: "Redness", A: 40 },
      { subject: "Wrinkles", A: 30 },
      { subject: "Blackheads", A: 50 },
      { subject: "Dark Circles", A: 45 },
      { subject: "Acne", A: 35 },
      { subject: "Oil", A: 35 },
      { subject: "Freckles", A: 35 },
    ],
    analytics: [
      { label: "Whiteheads", value: 80 },
      { label: "Pores", value: 65 },
      { label: "Redness", value: 50 },
      { label: "Wrinkles", value: 30 },
      { label: "Blackheads", value: 35 },
      { label: "Acne", value: 40 },
      { label: "Oil", value: 55 },
      { label: "Freckles", value: 45 },
    ],
    impurities: [
      { label: "Whiteheads", value: 80 },
      { label: "Pores", value: 65 },
      { label: "Oil", value: 55 },
      { label: "Redness", value: 50 },
      { label: "Freckles", value: 45 },
      { label: "Acne", value: 40 },
      { label: "Blackheads", value: 35 },
      { label: "Wrinkles", value: 30 },
    ],
  },
  "Jan 20, 2024 15:45": {
    keyProblems: [
      { label: "Blackheads", value: 75, severity: "severe" },
      { label: "Oil", value: 60, severity: "moderate" },
      { label: "Acne", value: 40, severity: "mild" },
    ],
    radarData: [
      { subject: "Whiteheads", A: 40 },
      { subject: "Pores", A: 55 },
      { subject: "Redness", A: 30 },
      { subject: "Wrinkles", A: 25 },
      { subject: "Blackheads", A: 75 },
      { subject: "Dark Circles", A: 35 },
      { subject: "Acne", A: 40 },
      { subject: "Oil", A: 40 },
      { subject: "Freckles", A: 40 },
    ],
    analytics: [
      { label: "Whiteheads", value: 40 },
      { label: "Pores", value: 55 },
      { label: "Redness", value: 75 },
      { label: "Wrinkles", value: 25 },
      { label: "Blackheads", value: 40 },
      { label: "Dark Circles", value: 30 },
      { label: "Acne", value: 60 },
      { label: "Oil", value: 35 },
      { label: "Freckles", value: 35 },
    ],
    impurities: [
      { label: "Blackheads", value: 75 },
      { label: "Acne", value: 60 },
      { label: "Pores", value: 55 },
      { label: "Whiteheads", value: 40 },
      { label: "Oil", value: 40 },
      { label: "Freckles", value: 35 },
      { label: "Dark Circles", value: 30 },
      { label: "Wrinkles", value: 25 },
    ],
  },
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case "severe":
      return "bg-red-500";
    case "moderate":
      return "bg-orange-500";
    case "mild":
      return "bg-green-500";
    default:
      return "bg-violet-500";
  }
};

const getColorByValue = (value) => {
  if (value >= 80) return "#ea384c"; // Red
  if (value >= 60) return "#F97316"; // Orange
  if (value >= 40) return "#eab308"; // Dark Yellow
  return "#22c55e"; // Green
};

// Skin Score Calculation Function
const computeSkinScore = (impurities) => {
  if (!impurities || impurities.length === 0) return 100; // Perfect score if no impurities

  const totalImpurity = impurities.reduce(
    (sum, impurity) => sum + impurity.value,
    0
  );
  const averageImpurity = totalImpurity / impurities.length;
  const skinScore = 100 - averageImpurity; // Invert the scale (0-100 where 100 is best)

  return Math.round(skinScore); // Return as integer
};

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(
    Object.keys(analysisData)[0]
  );
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedImpurity, setSelectedImpurity] = useState(null);

  const currentData = analysisData[selectedDate];

  // Enrich impurities with image and description data
  const enrichedImpurities = currentData.impurities.map((impurity) => ({
    ...impurity,
    image: skinIssues[impurity.label]?.image || "",
    description:
      skinIssues[impurity.label]?.description || "No description available",
  }));

  const sortedImpurities = [...enrichedImpurities].sort(
    (a, b) => b.value - a.value
  );

  // Calculate skin score
  const skinScore = computeSkinScore(currentData.impurities);

  const handleShareScore = () => {
    // Implement your share functionality here
    alert(`Sharing skin score: ${skinScore}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 ml-[240px]">
      <Sidebar />
      <Navbar />
      <div className="mt-20 max-w-6xl mx-auto space-y-8">
        {/* Date Selector */}
        <div className="relative">
          <button
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border-1 border-cyan-700"
          >
            <span>{selectedDate}</span>
            <ChevronDown size={20} />
          </button>

          <AnimatePresence>
            {isDateDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg z-10"
              >
                {Object.keys(analysisData).map((date) => (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setIsDateDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                      date === selectedDate ? "text-violet-600" : ""
                    }`}
                  >
                    {date}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <section className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-bold">Key Problems Detected</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-10">
              {currentData.keyProblems.map((problem) => {
                // Get color based on value percentage
                const color = getColorByValue(problem.value);
                // Convert color hex to Tailwind class if needed
                const bgColor =
                  color === "#ea384c"
                    ? "bg-red-500"
                    : color === "#F97316"
                    ? "bg-orange-500"
                    : color === "#eab308"
                    ? "bg-yellow-500"
                    : "bg-green-500";

                return (
                  <div key={problem.label} className="space-y-2 ">
                    <div className="flex justify-between items-center">
                      <span className="text-m font-semibold">
                        {problem.label}
                      </span>
                      <span className="text-md text-gray-900">
                        {problem.value}%
                      </span>
                    </div>
                    <div className="relative w-10/12 h-6 bg-gray-300 rounded-xl overflow-hidden">
                      <div
                        className={`h-full rounded-xl ${bgColor}`}
                        style={{ width: `${problem.value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-gray-500"></p>
          </div>
        </section>

        {/* Skin Score Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl mx-6 px-5 shadow-sm overflow-hidden"
          style={{
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.05)",
            height: "180px",
          }}
        >
          <div className="p-3 md:p-4 h-full flex flex-col">
            <div className="flex justify-between items-start">
              <h2 className="text-lg md:text-xl text-white font-semibold">
                Overall Skin Score
              </h2>
              <button
                onClick={handleShareScore}
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Share score"
              >
                <Share className="w-7 h-7" />
              </button>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-400">
                {skinScore}
                <span className="text-lg md:text-xl text-gray-400 ml-1">
                  /100
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-100">
                {skinScore >= 80
                  ? "Excellent"
                  : skinScore >= 60
                  ? "Good"
                  : skinScore >= 40
                  ? "Fair"
                  : "Needs Attention"}
              </div>
            </div>

            {/* Progress bar at bottom */}
            <div className="h-1 bg-gray-700 w-full mt-auto">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${skinScore}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Row for Spider Graph and Bar Graph Analytics */}
        <div className="grid grid-cols-2 gap-2">
          {/* Skin Issues Distribution (Spider Graph) */}
          <section className="bg-white w-12/12 h-12/12 p-8 rounded-xl text-center mb-10 shadow-cyan-800">
            <h2 className="text-xl font-semibold mb-4">
              Skin Issues Distribution
            </h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={currentData.radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" stroke="#6b7280" />
                  <Radar
                    name="Skin Issues"
                    dataKey="A"
                    stroke="#8b5cf6"
                    fill="#4A044E"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Note: The spider graph illustrates the severity of different skin
              issues. The further the point is from the center, the more severe
              the issue.
            </p>
          </section>

          {/* Skin Issues Analytics (Bar Graph) */}
          <section className="bg-white p-6 rounded-xl w-12/12 shadow-cyan-800 col-span-1">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-10">
              Skin Issues Analytics
            </h2>
            <div
              className="flex space-x-2 justify-center overflow-x-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {currentData.analytics.map((issue, index) => (
                <div
                  key={issue.label}
                  className="flex flex-col items-center font-sm space-y-2 text-cyan-500"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    width: "58px",
                    flexShrink: 0,
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="text-sm font-medium text-center"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                        marginRight: "5px",
                      }}
                    >
                      {issue.label}
                    </div>
                    <div className="relative w-7 min-h-80 bg-gray-700 rounded-md overflow-hidden flex">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${issue.value}%` }}
                        transition={{ duration: 0.5 }}
                        className="absolute bottom-0 w-full rounded-md"
                        style={{
                          backgroundColor: getColorByValue(issue.value),
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold ml-5 mb-8">
                    {issue.value}%
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Note: The spider graph illustrates the severity of different skin
              issues. The further the point is from the center, the more severe
              the issue.
            </p>
          </section>
        </div>

        {/* Product Recommendation Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-6">Product Recommendations</h2>
          <div className="space-y-6">
            {sortedImpurities.map((impurity) => (
              <div
                key={impurity.label}
                className="flex flex-col p-4  border border-gray-100 rounded-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-35 h-35 mr-5 rounded-md overflow-hidden">
                    <img
                      src={impurity.image}
                      alt={impurity.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold mb-3 text-xl">
                          {impurity.label}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {impurity.description}
                        </p>
                      </div>
                      <span className="text-md font-lg  mb-3 px-2 py-1  rounded">
                        {impurity.value}%
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="h-5 w-full bg-gray-300 rounded-sm overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${impurity.value}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full rounded-md"
                          style={{
                            backgroundColor: getColorByValue(impurity.value),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex justify-center">
                  <button
                    onClick={() => {
                      setSelectedImpurity(impurity.label);
                      setShowDialog(true);
                    }}
                    className="px-6 py-3 bg-cyan-900 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Generate Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <RecommendationModal
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          impurity={selectedImpurity}
        />
      </div>
    </div>
  );
};

export default Dashboard;
