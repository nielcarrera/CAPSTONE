// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { ChevronDown, Share, HelpCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import WalkthroughTour from "../components/Walkthroughtour";
import { Link } from "react-router-dom";
import ImpurityDetailsCard from "../components/Dashboard/Impuritycard"; // --- IMPORT NEW COMPONENT ---

// Centralized services & utils
import { loadAnalysisData } from "../service/dashboard/analysisdataService";
import { useAuth } from "../context/AuthProvider";
import { getColorByValue } from "../Pages/utils/DummyData";
import { skinIssues } from "../Pages/utils/SkinIssueconfig"; // Using single source of truth for configs
import {
  computeSkinScore,
  enrichImpurities,
} from "../Pages/utils/SkinAnalytics";

// Import the single source of truth for tour logic
import { useTour } from "../Pages/hooks/Dashboard/usetour";

const Dashboard = () => {
  // All state and functions from before remain here
  const [analysisData, setAnalysisData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const { currentUser } = useAuth();
  const {
    showTour,
    tourStep,
    tourSteps,
    isHighlighted,
    startTour,
    nextStep,
    prevStep,
    endTour,
  } = useTour();

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

  useEffect(() => {
    if (!currentUser) return;
    loadAnalysisData(currentUser.id).then((data) => {
      setAnalysisData(data);
      const dates = Object.keys(data).sort((a, b) => b.localeCompare(a));
      if (dates.length > 0) setSelectedDate(dates[0]);
    });
  }, [currentUser]);

  const handleShareScore = () => alert(`Sharing skin score: ${skinScore}`);

  const formatDateFormal = (dateString) => {
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
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 ml-0 md:ml-[240px] relative">
      <Sidebar />
      <Navbar />

      {/* Dark overlay when tour is active */}
      {showTour && (
        <div
          className="fixed inset-0 bg-opacity-30 z-20 pointer-events-none"
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
        {/* Date Selector (UNCHANGED) */}
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

        {/* Key Problems Section (UNCHANGED) */}
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
              </div>
            ))}
          </div>
        </section>

        {/* Skin Score Card (UNCHANGED) */}
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

        {/* Charts Section (UNCHANGED) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* --- REFACTORED IMPURITY DETAILS SECTION --- */}
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
              <ImpurityDetailsCard
                key={`${impurity.label}-${index}`}
                impurity={impurity}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* View Recommendations Button (UNCHANGED) */}
        <div className="flex justify-center pb-8"></div>
      </div>
    </div>
  );
};

export default Dashboard;
