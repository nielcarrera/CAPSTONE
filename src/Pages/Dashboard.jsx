import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BodyPartNav from "../components/bodypartnav";
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
    <div className="min-h-screen bg-gray-50 p-4 ml-[240px]">
      <Sidebar></Sidebar>
      <Navbar></Navbar>
      <div className="mt-20 max-w-6xl mx-auto space-y-8 ">
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

        {/* Row for Spider Graph and Bar Graph Analytics */}
        <div className="grid grid-cols-2 gap-2">
          {/* Skin Issues Distribution (Spider Graph) */}
          <section className="bg-white w-12/12 h-12/12 p-8 rounded-xl  text-center mb-10 shadow-cyan-800">
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
          <section className="bg-white p-6 rounded-xl w-12/12 shadow-cyan-800 col-span-1 ">
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
                    flexShrink: 0, // Prevent columns from shrinking
                  }}
                >
                  {/* Label on the left side */}
                  <div className="flex items-center space-x-2">
                    <div
                      className="text-sm font-medium text-center"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)", // Rotate to make it readable from bottom to top
                        marginRight: "5px",
                      }}
                    >
                      {issue.label}
                    </div>

                    {/* Vertical bar with equal height */}
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

                  {/* Percentage at the bottom */}
                  <span className="text-sm font-semibold ml-5 mb-8">
                    {issue.value}%
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4  ">
              Note: The spider graph illustrates the severity of different skin
              issues. The further the point is from the center, the more severe
              the issue.
            </p>
          </section>
        </div>

        {/* Recommendation Button */}
        <div className="mt-8 flex justify-center">
          <button
            className="w-3/12 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
            onClick={() => setShowDialog(true)}
          >
            Recommend Product
          </button>
        </div>

        <RecommendationModal
          showDialog={showDialog}
          setShowDialog={setShowDialog}
        />
      </div>
    </div>
  );
};

export default Dashboard;
