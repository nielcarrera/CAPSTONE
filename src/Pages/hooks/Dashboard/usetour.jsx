// src/hooks/useTour.js

import { useState, useEffect } from "react";

// This is the single source of truth for your tour steps.
// Keep them here for easy editing.
export const tourSteps = [
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
    content: "Detailed breakdown of each skin issue with severity percentages.",
  },
  {
    id: "impurity-details",
    title: "Impurity Details",
    content:
      "Detailed information about each skin issue detected in your analysis.",
  },
];

export const useTour = () => {
  const [tourStep, setTourStep] = useState(0);
  const [showTour, setShowTour] = useState(false);

  // Initialize tour for first-time users
  useEffect(() => {
    const tourCompleted = localStorage.getItem("skinAnalysisTourCompleted");
    if (!tourCompleted) {
      setShowTour(true);
    }
  }, []);

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

  const isHighlighted = (id) => showTour && tourSteps[tourStep]?.id === id;

  return {
    showTour,
    tourStep,
    tourSteps,
    isHighlighted,
    startTour,
    nextStep,
    prevStep,
    endTour,
  };
};
