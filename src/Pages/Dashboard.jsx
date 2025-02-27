import { useState } from "react";
import { ChevronDown, Menu as MenuIcon, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BodyPartNav from "../components/bodypartnav";
import { useNavigate } from "react-router-dom";
import RecommendationModal from "../components/ReccomendationModal";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

// Dummy data for different analysis dates
const analysisData = {
  "Feb 20, 2024 14:30": {
    keyProblems: [
      { label: "Moisture", value: 80, severity: "severe" },
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

const Dashboard = () => {
  const [showDistribution, setShowDistribution] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    Object.keys(analysisData)[0]
  );
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const currentData = analysisData[selectedDate];
  // Helper function to get color based on value
  const getColorByValue = (value) => {
    if (value >= 80) return "#ea384c"; // Red
    if (value >= 60) return "#F97316"; // Orange
    if (value >= 40) return "#eab308"; // Dark Yellow
    return "#22c55e"; // Green
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 ml-[280px]">
      <Sidebar></Sidebar>
      <Navbar></Navbar>
      <div className="mt-20 max-w-6xl mx-auto space-y-8">
        <BodyPartNav />
        {/* Date Selector */}
        <div className="relative">
          <button
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
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

        {/* Key Problems Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-bold">Key Problems Detected</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 ">
              {currentData.keyProblems.map((problem) => (
                <div key={problem.label} className="space-y-2">
                  <div className="text-m font-semibold">{problem.label}</div>
                  <div
                    className={`h-6 w-4/12 rounded-lg ${getSeverityColor(
                      problem.severity
                    )}`}
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Note: Colors illustrate the severity of impurity: Red being
              severe, Orange being moderate and Green being mild
            </p>
          </div>
        </section>

        {/* Skin Issues Distribution */}
        <section className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Skin Issues Distribution</h2>
            <button
              onClick={() => setShowDistribution(!showDistribution)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MenuIcon size={20} />
            </button>
          </div>

          <AnimatePresence>
            {showDistribution && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
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
                <p className="text-sm text-gray-500">
                  Note: The spider graph illustrates the severity of different
                  skin issues. The further the point is from the center, the
                  more severe the issue. This visualization helps track multiple
                  skin concerns simultaneously.
                </p>
                <button
                  className="w-3/12 ml-90  bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
                  onClick={() => setShowDialog(true)}
                >
                  Recommend Product
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <RecommendationModal
          showDialog={showDialog}
          setShowDialog={setShowDialog}
        />

        {/* Skin Issues Analytics */}
        <section className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Skin Issues Analytics</h2>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MenuIcon size={20} />
            </button>
          </div>

          <AnimatePresence>
            {showAnalytics && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {currentData.analytics.map((issue) => (
                  <div key={issue.label} className="mt-10 space-y-2">
                    <div className="flex justify-between ">
                      <span className="font-medium ">{issue.label}</span>
                      <span className="font-semibold mr-20">
                        {issue.value}%
                      </span>
                    </div>
                    <div className="h-4 bg-gray-800 w-10/12 rounded-full">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${issue.value}%` }}
                        transition={{ duration: 0.5 }}
                        style={{
                          height: "100%",
                          borderRadius: "9999px",
                          backgroundColor: getColorByValue(issue.value),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-15">
            <button
              className="w-3/12 ml-90  bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
              onClick={() => setShowDialog(true)}
            >
              Recommend Product
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
