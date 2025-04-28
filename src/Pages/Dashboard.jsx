import { useEffect, useState } from "react";
import { ChevronDown, Share, HelpCircle, X } from "lucide-react";
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
import RecommendationModal from "../components/ReccomendationModal";
import {
  ANALYSIS_DATA,
  SEVERITY_COLORS,
  getColorByValue,
} from "../Pages/utils/DummyData";
import { skinIssues } from "../Pages/utils/SkinIssueconfig";
import {
  computeSkinScore,
  enrichImpurities,
} from "../Pages/utils/SkinAnalytics";

const Dashboard = () => {
  // Main state
  const [selectedDate, setSelectedDate] = useState(
    Object.keys(ANALYSIS_DATA)[0]
  );
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedImpurity, setSelectedImpurity] = useState(null);

  // Tour state
  const [tourStep, setTourStep] = useState(0);
  const [showTour, setShowTour] = useState(false);

  // Data processing
  const currentData = ANALYSIS_DATA[selectedDate];
  const enrichedImpurities = enrichImpurities(
    currentData.impurities,
    skinIssues
  );
  const sortedImpurities = [...enrichedImpurities].sort(
    (a, b) => b.value - a.value
  );
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
        "See your top skin concerns ranked by severity with visual indicators.",
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
      id: "recommendations",
      title: "Recommendations",
      content: "Personalized product suggestions based on your skin analysis.",
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

  const handleShareScore = () => alert(`Sharing skin score: ${skinScore}`);

  return (
    <div className="min-h-screen bg-gray-50 p-4 ml-[240px] relative">
      <Sidebar />
      <Navbar />

      {/* Dark overlay when tour is active */}
      {showTour && (
        <div
          className="fixed inset-1  bg-opacity-30 z-20 pointer-events-none"
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

      {/* Tour Tooltip */}
      <AnimatePresence>
        {showTour && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 border-1 border-cyan-800 bg-white rounded-lg shadow-xl w-11/12 max-w-md p-4"
            style={{ marginLeft: "120px" }}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">
                {tourSteps[tourStep]?.title}
              </h3>
              <button
                onClick={endTour}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">{tourSteps[tourStep]?.content}</p>
            <div className="flex justify-between items-center">
              <div>
                {tourStep > 0 && (
                  <button
                    onClick={prevStep}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Back
                  </button>
                )}
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-3">
                  {tourStep + 1} of {tourSteps.length}
                </span>
                <button
                  onClick={nextStep}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {tourStep === tourSteps.length - 1 ? "Finish" : "Next"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="mt-20 max-w-6xl mx-auto space-y-8">
        {/* Date Selector */}
        <div
          id="date-selector"
          className={`relative bg-white rounded-lg shadow-sm border-1 border-cyan-700 transition-all duration-300 ${
            isHighlighted("date-selector")
              ? "ring-4 ring-blue-500 z-10"
              : showTour
              ? "opacity-40"
              : ""
          }`}
        >
          <button
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 w-full"
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
                {Object.keys(ANALYSIS_DATA).map((date) => (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setIsDateDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
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
          <h2 className="text-xl font-bold mb-10">Key Problems Detected</h2>
          <div className="grid grid-cols-3 gap-10">
            {currentData.keyProblems.map((problem) => (
              <div key={problem.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{problem.label}</span>
                  <span>{problem.value}%</span>
                </div>
                <div className="relative w-10/12 h-6 bg-gray-300 rounded-xl overflow-hidden">
                  <div
                    className={`h-full rounded-xl ${
                      SEVERITY_COLORS[problem.severity] ||
                      SEVERITY_COLORS.default
                    }`}
                    style={{ width: `${problem.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skin Score Card */}
        <div
          id="skin-score"
          className={`bg-gray-800 rounded-xl mx-6 px-5 shadow-sm overflow-hidden transition-all duration-300 ${
            isHighlighted("skin-score")
              ? "ring-4 ring-blue-500 z-10"
              : showTour
              ? "opacity-40"
              : ""
          }`}
          style={{ height: "180px" }}
        >
          <div className="p-3 md:p-4 h-full flex flex-col">
            <div className="flex justify-between items-start">
              <h2 className="text-lg md:text-xl text-white font-semibold">
                Overall Skin Score
              </h2>
              <button
                onClick={handleShareScore}
                className="text-gray-300 hover:text-white"
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
            <div className="h-1 bg-gray-700 w-full mt-auto">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${skinScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-2">
          {/* Radar Chart */}
          <section
            id="spider-graph"
            className={`bg-white p-8 rounded-xl shadow-cyan-800 transition-all duration-300 ${
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

        {/* Product Recommendations */}
        <section
          id="recommendations"
          className={`bg-white p-6 rounded-xl shadow-sm transition-all duration-300 ${
            isHighlighted("recommendations")
              ? "ring-4 ring-blue-500 z-10"
              : showTour
              ? "opacity-40"
              : ""
          }`}
        >
          <h2 className="text-xl font-bold mb-6">Product Recommendations</h2>
          <div className="space-y-6">
            {sortedImpurities.map((impurity) => (
              <div
                key={impurity.label}
                className="flex flex-col p-4 border border-gray-100 rounded-lg"
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
                      <span className="text-md font-lg mb-3 px-2 py-1 rounded">
                        {impurity.value}%
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="h-5 w-full bg-gray-300 rounded-sm overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${impurity.value}%` }}
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
                    className="px-6 py-3 bg-cyan-900 text-white rounded-lg hover:bg-gray-600"
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
