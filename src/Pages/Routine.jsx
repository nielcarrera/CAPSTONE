import { useState } from "react";
import { ChevronDown, Plus, Menu as MenuIcon } from "lucide-react";
import RoutineDialog from "../components/Routine/Routinedialog";
import RoutineCard from "../components/Routine/Routinecard";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SkinTypeDialog from "../components/Generateroutinemodal";

// Dummy data with more complete routine steps
const dummyRoutines = {
  morning: [
    {
      id: 1,
      name: "AM Skincare Routine",
      time: "7:00 AM",
      duration: 15,
      notifications: true,
      steps: [
        { id: 1, product: "Gentle Cleanser", bodyPart: "Face" },
        { id: 2, product: "Vitamin C Serum", bodyPart: "Face" },
        {
          id: 3,
          product: "Moisturizer",
          bodyPart: "Face",
        },
        { id: 4, product: "Sunscreen SPF 50", bodyPart: "Face" },
      ],
    },
  ],
  night: [
    {
      id: 2,
      name: "PM Skincare Routine",
      time: "8:00 PM",
      duration: 20,
      notifications: true,
      steps: [
        { id: 1, product: "Oil Cleanser", bodyPart: "Face" },
        { id: 2, product: "Foam Cleanser", bodyPart: "Face" },
        { id: 3, product: "Toner", bodyPart: "Face" },
        { id: 4, product: "Retinol Serum", bodyPart: "Face" },
        { id: 5, product: "Night Cream", bodyPart: "Face" },
      ],
    },
  ],
  custom: [],
};

const RoutinesPage = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [showSkinTypeDialog, setShowSkinTypeDialog] = useState(false);
  const [visibleSections, setVisibleSections] = useState({
    morning: true,
    night: true,
    custom: true,
  });

  const toggleSection = (section) => {
    setVisibleSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderSection = (title, routines, key) => (
    <section className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-xl mt-10 font-semibold text-gray-800">{title}</h2>
        <button
          onClick={() => toggleSection(key)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <MenuIcon size={20} className="text-gray-600" />
        </button>
      </div>

      <AnimatePresence>
        {visibleSections[key] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {routines.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">No routine yet</p>
                <button
                  onClick={() => setShowDialog(true)}
                  className="inline-flex items-center px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Routine
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {routines.map((routine) => (
                  <RoutineCard
                    key={routine.id}
                    routine={routine}
                    onEdit={() => {
                      /* Implement edit logic */
                    }}
                    onDelete={() => {
                      /* Implement delete logic */
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <div className="p-8 lg:ml-64">
        {" "}
        {/* Adjust margin to account for sidebar */}
        <div className="max-w-5xl mt-25 mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">My Routines</h1>
            <button
              onClick={() => setShowDialog(true)}
              className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Routine
            </button>
          </div>

          <div className="grid gap-6">
            {renderSection("Morning Routine", dummyRoutines.morning, "morning")}
            {renderSection("Night Routine", dummyRoutines.night, "night")}
            {renderSection("Custom Routine", dummyRoutines.custom, "custom")}
          </div>
        </div>
      </div>
      {/* Floating Generate Routine Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-10 right-15 px-13 py-4 bg-cyan-800 text-white rounded-full shadow-lg hover:bg-cyan-900 transition-all duration-300 flex items-center"
        onClick={() => setShowSkinTypeDialog(true)}
      >
        <span className="mr-2">Generate Routine</span>
        <Plus className="w-5 h-5" />
      </motion.button>
      <SkinTypeDialog
        showDialog={showSkinTypeDialog}
        setShowDialog={setShowSkinTypeDialog}
      />
      <RoutineDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onSave={() => {
          // Here we would typically save the routine data
        }}
      />
      ;
    </div>
  );
};

export default RoutinesPage;
