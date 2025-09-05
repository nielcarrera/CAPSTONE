// src/Pages/BodyImpurityDashboard.jsx

import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// Import the service
import { fetchSavedImpurities } from "../service/bodyimpurityService";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthProvider";

const BodyImpurityDashboard = () => {
  const [fetchedImpurities, setFetchedImpurities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImpurity, setCurrentImpurity] = useState(null);
  const currentUser = useAuth();
  const id = currentUser.id;
  useEffect(() => {
    async function loadImpurities() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const userId = user.id;

      try {
        setLoading(true);
        const rows = await fetchSavedImpurities(userId);

        // FLATTEN all saved_body_impurity arrays into a single array
        const flat = rows.flatMap((row) =>
          (row.saved_body_impurity || []).map((sbi) => ({
            id: sbi.id,
            detected_at: sbi.detected_at,
            name: sbi.body_impurities?.name || "",
            description: sbi.body_impurities?.description || "",
            common_locations: sbi.body_impurities?.common_locations || "",
            prevalence: sbi.body_impurities?.prevalence || "",
            image: sbi.body_impurities?.image || "",
            // Optionally include parent (row) info if needed:
            parent_id: row.id,
            user_id: row.user_id,
            kind: row.kind,
          }))
        );

        setFetchedImpurities(flat);
      } catch (error) {
        console.error("Error fetching body impurities:", error);
      } finally {
        setLoading(false);
      }
    }
    loadImpurities();
  }, []);

  // Date filtering
  const allDates = [
    ...new Set(fetchedImpurities.map((imp) => imp.detected_at.split("T")[0])),
  ].sort((a, b) => new Date(b) - new Date(a));

  const [selectedDate, setSelectedDate] = useState("");
  const dateFilteredImpurities = selectedDate
    ? fetchedImpurities.filter(
        (imp) => imp.detected_at.split("T")[0] === selectedDate
      )
    : fetchedImpurities;

  const BODY_PARTS = [
    "Arm",
    "Back",
    "Neck",
    "Abdomen",
    "Hands",
    "Chest",
    "Legs",
    "Feet",
  ];

  const sortedImpurities = [...dateFilteredImpurities].sort(
    (a, b) => new Date(b.detected_at) - new Date(a.detected_at)
  );

  const processedImpurities = sortedImpurities.filter(
    (imp) =>
      selectedBodyParts.length === 0 ||
      selectedBodyParts.includes(imp.common_locations)
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
  const handleGenerateRecommendations = () => {
    setIsGenerating(true);
    setShowRecommendationModal(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 6000);
  };

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

      <div className="mt-20 max-w-6xl mx-auto space-y-8 px-4">
        <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          {/* Header & Date Filter */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Detailed Body Analysis
            </h2>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Dates</option>
                {allDates.map((date) => (
                  <option key={date} value={date}>
                    {formatDate(date + "T00:00:00Z")}
                  </option>
                ))}
              </select>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-md">
                {processedImpurities.length}{" "}
                {processedImpurities.length === 1 ? "item" : "items"} found
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors border border-gray-200"
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
                transition={{ duration: 0.2 }}
                className="mt-4 overflow-hidden p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Body Part</h4>
                  <button
                    onClick={toggleAllBodyParts}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {selectedBodyParts.length === BODY_PARTS.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-2">
                  {BODY_PARTS.map((part) => (
                    <button
                      key={part}
                      onClick={() => toggleBodyPart(part)}
                      className={`px-3 py-2 text-sm rounded-md border transition-colors flex items-center justify-center ${
                        selectedBodyParts.includes(part)
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedBodyParts.includes(part)}
                        readOnly
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-2"
                      />
                      {part}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Impurity Cards */}
          {loading ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Loading…</p>
            </div>
          ) : processedImpurities.length > 0 ? (
            <div
              className={`grid ${
                processedImpurities.length <= 2
                  ? "justify-center grid-cols-1 sm:grid-cols-2 gap-4"
                  : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              }`}
            >
              {processedImpurities.map((impurity) => (
                <motion.div
                  key={impurity.id}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 15px rgba(0,0,0,0.2)",
                  }}
                  className="border border-gray-200 rounded-lg overflow-hidden flex flex-col bg-white shadow-lg"
                  style={{ maxWidth: "18rem" }} // about 10% bigger
                >
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                      src={impurity.image}
                      alt={impurity.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-grow p-4">
                    <h3 className="font-semibold text-base text-gray-800 mb-1">
                      {impurity.name}
                    </h3>
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mb-2">
                      {impurity.common_locations}
                    </span>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {impurity.description}
                    </p>
                    <div className="text-[15px] text-gray-600 mb-3">
                      Detected: {formatDate(impurity.detected_at)}
                    </div>
                    <button
                      onClick={() => openDetailsModal(impurity)}
                      className="mt-auto w-full text-center text-sm px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
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
                  <h3 className="text-xl font-bold">{currentImpurity.name}</h3>
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
                      {/* After (modal now shows the actual image): */}
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex flex-col">
                        <img
                          src={currentImpurity.image}
                          alt={currentImpurity.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="mt-4"></div>
                    </div>

                    <div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Detection Date:
                          </h4>
                          <p className="text-gray-600">
                            {formatDate(currentImpurity.detected_at)}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-800">
                            Body Part (Location):
                          </h4>
                          <p className="text-gray-600">
                            {currentImpurity.common_locations}
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
                            Prevalence:
                          </h4>
                          <p className="text-gray-600">
                            {currentImpurity.prevalence}
                          </p>
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
    </div>
  );
};

export default BodyImpurityDashboard;
