import { useEffect, useState } from "react";
import { ChevronDown, Share, HelpCircle, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WalkthroughTour from "../components/Walkthroughtour";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

import { loadAnalysisData } from "../service/analysisDataService";

import { useAuth } from "../context/AuthProvider";

import { getColorByValue } from "../Pages/utils/DummyData";
import { skinIssues, skinIssueDetails } from "../Pages/utils/SkinIssueconfig";
import {
  computeSkinScore,
  enrichImpurities,
} from "../Pages/utils/SkinAnalytics";

const Dashboard = () => {
  // Main state
  const [analysisData, setAnalysisData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedImpurity, setSelectedImpurity] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState(null);

  // Tour state
  const [tourStep, setTourStep] = useState(0);
  const [showTour, setShowTour] = useState(false);

  // Data processing

  const { currentUser } = useAuth();
  const currentData = analysisData[selectedDate] || {
    impurities: [],
    radarData: [],
    analytics: [],
  };
  const enrichedImpurities = enrichImpurities(
    currentData.impurities,
    skinIssues
  );
  const sortedImpurities = [...enrichedImpurities].sort(
    (a, b) => b.value - a.value
  );
  const topThreeImpurities = sortedImpurities.slice(0, 3);
  const skinScore = computeSkinScore(currentData.impurities);

  // Tour configuration
  const tourSteps = [
    {
      id: "date-selector",
      title: "Date Selection",
      content:
        "Select different analysis dates to view your skin analysis history.",
    },
    {
      id: "key-problems",
      title: "Key Problems",
      content:
        "Your top 3 skin concerns ranked by severity. These need immediate attention.",
    },
    {
      id: "skin-score",
      title: "Skin Score",
      content:
        "Your overall skin health score (0-100) based on all detected issues.",
    },
    {
      id: "spider-graph",
      title: "Skin Distribution",
      content:
        "Radar chart showing how different skin issues compare in severity.",
    },
    {
      id: "analytics-graph",
      title: "Skin Analytics",
      content:
        "Detailed breakdown of each skin issue with severity percentages.",
    },
    {
      id: "impurity-details",
      title: "Impurity Details",
      content:
        "Detailed information about each skin issue detected in your analysis.",
    },
  ];

  // Simple highlight check
  const isHighlighted = (id) => showTour && tourSteps[tourStep]?.id === id;

  // Tour controls
  const nextStep = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (tourStep > 0) {
      setTourStep(tourStep - 1);
    }
  };

  const startTour = () => {
    setTourStep(0);
    setShowTour(true);
  };

  const endTour = () => {
    setShowTour(false);
    localStorage.setItem("skinAnalysisTourCompleted", "true");
  };

  // Initialize tour for first-time users
  useEffect(() => {
    if (!localStorage.getItem("skinAnalysisTourCompleted")) {
      startTour();
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    // Fetch analysis data from Supabase
    loadAnalysisData(currentUser.id).then((data) => {
      setAnalysisData(data);
      // 📅 get all dates and sort newest-first
      const dates = Object.keys(data).sort((a, b) => b.localeCompare(a));

      // 🚩 log to verify with landingPageService
      console.log("🚩 dashboard dates:", dates, "→ picking", dates[0]);
      if (dates.length > 0) setSelectedDate(dates[0]); // Set most recent as default
    });
  }, [currentUser]);

  const handleShareScore = () => alert(`Sharing skin score: ${skinScore}`);

  const toggleDetails = (label) => {
    if (expandedDetails === label) {
      setExpandedDetails(null);
    } else {
      setExpandedDetails(label);
    }
  };

  function formatDateFormal(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 ml-0 md:ml-[240px] relative">
      <Sidebar />
      <Navbar />

      {/* Dark overlay when tour is active */}
      {showTour && (
        <div
          className="fixed inset-0  bg-opacity-30 z-20 pointer-events-none"
          style={{ marginLeft: "240px" }}
        />
      )}

      {/* Help Button */}
      <button
        onClick={startTour}
        className="fixed bottom-6 right-6 z-30 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Show tour guide"
      >
        <HelpCircle size={24} />
      </button>

      <WalkthroughTour
        showTour={showTour}
        tourSteps={tourSteps}
        tourStep={tourStep}
        nextStep={nextStep}
        prevStep={prevStep}
        endTour={endTour}
      />

      {/* Main Content Area */}
      <div className="mt-20 max-w-6xl mx-auto space-y-8 px-4">
        {/* Date Selector */}
        <div
          id="date-selector"
          className={`relative bg-white rounded-lg shadow-sm border border-cyan-700 transition-all duration-300 ${
            isHighlighted("date-selector")
              ? "ring-4 ring-blue-500 z-10"
              : showTour
              ? "opacity-40"
              : ""
          }`}
        >
          {selectedDate ? (
            // Only render the dropdown button if we actually have a date
            <button
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 w-full justify-between"
            >
              <span>{formatDateFormal(selectedDate)}</span>

              <ChevronDown
                size={20}
                className={`transition-transform ${
                  isDateDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          ) : (
            // Otherwise show a placeholder until loadAnalysisData finishes
            <div className="px-4 py-2 text-gray-500 italic">
              No analysis data yet
            </div>
          )}

          <AnimatePresence>
            {isDateDropdownOpen && selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg z-10 border border-gray-200"
              >
                {Object.keys(analysisData).map((date) => (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setIsDateDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                      date === selectedDate ? "text-violet-600 font-medium" : ""
                    }`}
                  >
                    {formatDateFormal(date)}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Key Problems Section */}
        <section
          id="key-problems"
          className={`bg-white p-6 rounded-xl shadow-sm transition-all duration-300 ${
            isHighlighted("key-problems")
              ? "ring-4 ring-blue-500 z-10"
              : showTour
              ? "opacity-40"
              : ""
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Key Problems Detected</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {topThreeImpurities.map((problem) => (
              <div
                key={problem.label}
                className="space-y-4 p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">
                    {problem.label}
                  </span>
                  <span
                    className="font-bold"
                    style={{ color: getColorByValue(problem.value) }}
                  >
                    {problem.value}%
                  </span>
                </div>
                <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full`}
                    style={{
                      width: `${problem.value}%`,
                      backgroundColor: getColorByValue(problem.value),
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600">{problem.description}</p>
                <Link
                  to={`/prodrecco?focus=${problem.label.toLowerCase()}`}
                  className="block text-center rounded-md text-sm px-3 py-2 bg-cyan-800 text-white  hover:bg-cyan-700 transition-colors"
                >
                  Get Recommendations
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Skin Score Card */}
        <div
          id="skin-score"
          className={`bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
            isHighlighted("skin-score")
              ? "ring-4 ring-blue-500 z-10"
              : showTour
              ? "opacity-40"
              : ""
          }`}
          style={{ minHeight: "180px" }}
        >
          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-start">
              <h2 className="text-lg md:text-xl text-white font-semibold">
                Overall Skin Score
              </h2>
              <button
                onClick={handleShareScore}
                className="text-gray-300 hover:text-white"
              >
                <Share className="w-5 h-5" />
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
            <div className="h-1 bg-gray-700 w-full mt-auto">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${skinScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <section
            id="spider-graph"
            className={`bg-white p-6 rounded-xl shadow-sm transition-all duration-300 ${
              isHighlighted("spider-graph")
                ? "ring-4 ring-blue-500 z-10"
                : showTour
                ? "opacity-40"
                : ""
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">
              Skin Issues Distribution
            </h2>
            <div className="h-[300px] md:h-[400px]">
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
          </section>

          {/* Bar Chart */}
          <section
            id="analytics-graph"
            className={`bg-white p-6 rounded-xl shadow-cyan-800 transition-all duration-300 ${
              isHighlighted("analytics-graph")
                ? "ring-4 ring-blue-500 z-10"
                : showTour
                ? "opacity-40"
                : ""
            }`}
          >
            <h2 className="text-xl font-semibold text-center mb-10">
              Skin Issues Analytics
            </h2>
            <div
              className="flex space-x-2 justify-center overflow-x-auto"
              style={{ scrollbarWidth: "none" }}
            >
              {currentData.analytics.map((issue) => (
                <div
                  key={issue.label}
                  className="flex flex-col items-center space-y-2"
                  style={{ width: "58px" }}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="text-sm font-medium"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                      }}
                    >
                      {issue.label}
                    </div>
                    <div className="relative w-7 min-h-80 bg-gray-700 rounded-md overflow-hidden flex">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${issue.value}%` }}
                        className="absolute bottom-0 w-full rounded-md"
                        style={{
                          backgroundColor: getColorByValue(issue.value),
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold">{issue.value}%</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* New Impurity Details Section */}
        <section
          id="impurity-details"
          className={`bg-white p-6 rounded-xl shadow-sm transition-all duration-300 ${
            isHighlighted("impurity-details")
              ? "ring-4 ring-blue-500 z-10"
              : showTour
              ? "opacity-40"
              : ""
          }`}
        >
          <h2 className="text-xl font-bold mb-6">Detailed Skin Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedImpurities.map((impurity, index) => (
              <motion.div
                key={`${impurity.label}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-lg"
              >
                <div className="w-full md:w-1/3 h-40 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={impurity.image}
                    alt={impurity.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{impurity.label}</h3>
                    <span
                      className="text-lg font-medium"
                      style={{ color: getColorByValue(impurity.value) }}
                    >
                      {impurity.value}%
                    </span>
                  </div>
                  <div className="h-5 w-full mt-3 bg-gray-200 rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-md"
                      style={{
                        width: `${impurity.value}%`,
                        backgroundColor: getColorByValue(impurity.value),
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    {impurity.description}
                  </p>

                  <button
                    onClick={() => toggleDetails(impurity.label)}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {expandedDetails === impurity.label
                      ? "Hide Details"
                      : "View More Details"}
                  </button>

                  {expandedDetails === impurity.label && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 bg-gray-50 p-3 rounded-md"
                    >
                      <div className="mb-2">
                        <h4 className="font-medium text-gray-800">Cause:</h4>
                        <p className="text-sm text-gray-600">
                          {skinIssueDetails[impurity.label]?.cause ||
                            "No cause information available"}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          Prevention:
                        </h4>
                        <p className="text-sm text-gray-600">
                          {skinIssueDetails[impurity.label]?.prevention ||
                            "No prevention information available"}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── TEST INSERT SECTION (unstyled) ──────────────────────────────────────────── */}
        {/* 
        <div className="p-4 bg-white border rounded-md mb-4">
          <button
            onClick={async () => {
              console.log("👉 Insert button was clicked");
              if (!currentUser) {
                console.warn("No currentUser; cannot insert.");
                return;
              }
              try {
                console.log("…calling insertFaceAnalysis");
                const result = await insertFaceAnalysis(
                  currentUser.id,
                  "2025-06-08",
                  [{ impurity: "Blackheads", percentage: 0.8 }]
                );
                console.log("✅ insertFaceAnalysis succeeded:", result);

                // Re-fetch everything so the UI reflects the new row
                const newData = await loadAnalysisData(currentUser.id);
                console.log("🚀 New loadAnalysisData result:", newData);
                setAnalysisData(newData);

                const newDates = Object.keys(newData);
                if (newDates.length > 0) setSelectedDate(newDates[0]);
              } catch (err) {
                console.error("❌ insertFaceAnalysis error:", err);
              }
            }}
            className="px-3 py-2 bg-red-200 text-red-800 rounded"
          >
            📌 Insert Test Face Data
          </button>
          <p className="mt-2 text-sm text-gray-600">
            Click to insert one dummy face‐impurity (Acne, 50%) on 2025-06-08,
            then re-load.
          </p>
        </div>
        {/* ──────────────────────────────────────────────────────────────────────────── */}

        {/* View Recommendations Button */}
        <div className="flex justify-center pb-8">
          <Link
            to="/prodrecco"
            className="px-6 py-3 bg-cyan-800 text-white rounded-lg hover:bg-cyan-700 text-md font-sm transition-colors flex items-center"
          >
            View Complete Product Recommendations
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
