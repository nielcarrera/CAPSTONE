import { useState } from "react";
import { ChevronDown, X, ArrowRight, Filter, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import {
  BODY_ANALYSIS_DATA,
  BODY_PARTS,
  getColorByValue,
} from "../Pages/utils/DummyData";
import RecommendationModal_Body from "../components/BodyReccomendationModal";

const BodyImpurityDashboard = () => {
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImpurity, setCurrentImpurity] = useState(null);

  // Get all unique dates for filtering (sorted newest first)
  const allDates = [
    ...new Set(
      Object.values(BODY_ANALYSIS_DATA)
        .flatMap((analysis) =>
          (analysis.impurities || []).map((imp) => imp.dateFound)
        )
        .filter(Boolean)
    ),
  ].sort((a, b) => new Date(b) - new Date(a));

  const [selectedDate, setSelectedDate] = useState(""); // "" means all dates

  // Get all impurities from all dates and flatten them into one array
  const allImpurities = Object.values(BODY_ANALYSIS_DATA).flatMap(
    (analysis) => analysis.impurities || []
  );

  // Filter by date if selected
  const dateFilteredImpurities = selectedDate
    ? allImpurities.filter((imp) => imp.dateFound === selectedDate)
    : allImpurities;

  // Sort by date (newest first)
  const sortedImpurities = [...dateFilteredImpurities].sort(
    (a, b) => new Date(b.dateFound) - new Date(a.dateFound)
  );

  const processedImpurities = sortedImpurities.filter(
    (imp) =>
      selectedBodyParts.length === 0 || selectedBodyParts.includes(imp.bodyPart)
  );

  const toggleBodyPart = (part) => {
    setSelectedBodyParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const toggleAllBodyParts = () => {
    setSelectedBodyParts((prev) =>
      prev.length === BODY_PARTS.length ? [] : BODY_PARTS
    );
  };

  const openDetailsModal = (impurity) => {
    setCurrentImpurity(impurity);
    setShowDetailsModal(true);
  };

  const handleGenerateRecommendations = (impurity) => {
    setIsGenerating(true);
    setShowRecommendationModal(true);

    // Simulate API call or processing
    setTimeout(() => {
      setIsGenerating(false);
    }, 6000);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 ml-0 md:ml-[240px] relative">
      <Sidebar />
      <Navbar />

      {/* Main Content Area */}
      <div className="mt-20 max-w-6xl mx-auto space-y-8 px-4">
        {/* Detailed Body Analysis Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold">Detailed Body Analysis</h2>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              {/* Date Filter */}
              <div>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                  <option value="">All Dates</option>
                  {allDates.map((date) => (
                    <option key={date} value={date}>
                      {formatDate(date)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-500">
                {processedImpurities.length}{" "}
                {processedImpurities.length === 1 ? "item" : "items"} found
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <Filter size={16} />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className="space-y-6">
                  {/* Body Part Filter */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-700 ring-cyan-80">
                        Body Part
                      </h4>
                      <button
                        onClick={toggleAllBodyParts}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {selectedBodyParts.length === BODY_PARTS.length
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {BODY_PARTS.map((part) => (
                        <button
                          key={part}
                          onClick={() => toggleBodyPart(part)}
                          className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                            selectedBodyParts.includes(part)
                              ? "bg-blue-50 border-blue-200 text-blue-700 ring-cyan-800"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {part}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Impurity Cards */}
          {processedImpurities.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {processedImpurities.map((impurity) => (
                <div
                  key={impurity.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full bg-white p-2 sm:p-3 md:p-4"
                >
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden rounded-md">
                    <img
                      src={impurity.image}
                      alt={impurity.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-grow mt-2">
                    <h3 className="font-semibold text-xs sm:text-sm md:text-base text-gray-800">
                      {impurity.label}
                    </h3>
                    <span className="text-xs sm:text-sm text-gray-500 mt-1 mb-1 block">
                      {impurity.bodyPart}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 flex-grow line-clamp-2">
                      {impurity.description}
                    </p>
                    {/* Detection Date */}
                    <div className="text-[11px] sm:text-xs text-gray-400 mb-2">
                      Detected: {formatDate(impurity.dateFound)}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => openDetailsModal(impurity)}
                        className="flex-1 text-center rounded-md text-xs sm:text-sm px-2 py-2 bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                      >
                        View more details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No impurities found for selected filters
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && currentImpurity && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-40"
              onClick={() => setShowDetailsModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
            >
              <div className="bg-white border-1 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-xl font-bold">{currentImpurity.label}</h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex flex-col">
                      <img
                        src={currentImpurity.image}
                        alt={currentImpurity.label}
                        className="w-full h-full object-cover mb-4"
                      />
                      <div className="mt-4">
                        <button
                          onClick={() => setShowRecommendationModal(true)}
                          className="block w-full text-center rounded-md px-4 py-2 bg-cyan-800 text-white hover:bg-cyan-700 transition-colors"
                          type="button"
                        >
                          Get Product Recommendations
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Detection Date:
                          </h4>
                          <p className="text-gray-600">
                            {formatDate(currentImpurity.dateFound)}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-800">
                            Body Part:
                          </h4>
                          <p className="text-gray-600">
                            {currentImpurity.bodyPart}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-800">
                            Description:
                          </h4>
                          <p className="text-gray-600">
                            {currentImpurity.description}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-800">
                            Causes and Triggers:
                          </h4>
                          <ul className="list-disc list-inside text-gray-600 space-y-1">
                            {currentImpurity.causes.map((cause, i) => (
                              <li key={i}>{cause}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-800">
                            Cautions:
                          </h4>
                          <ul className="list-disc list-inside text-gray-600 space-y-1">
                            {currentImpurity.cautions.map((caution, i) => (
                              <li key={i}>{caution}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Recommendation Modal */}
      <RecommendationModal_Body
        showDialog={showRecommendationModal}
        setShowDialog={setShowRecommendationModal}
        impurity={currentImpurity}
        onGenerate={handleGenerateRecommendations}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default BodyImpurityDashboard;
