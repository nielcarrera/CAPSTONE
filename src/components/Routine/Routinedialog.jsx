import { useState, useEffect, useRef } from "react"; // Import useRef
import { Plus, X, Trash, Edit } from "lucide-react";
import ProductSelectDropdown from "./ProductListDialog";
import { saveRoutine, updateRoutine } from "../../service/routineService";
import { supabase } from "../../lib/supabaseClient";

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  const ampm = i < 12 ? "AM" : "PM";
  return `${hour}:00 ${ampm}`;
});

const RoutineDialog = ({ open, onOpenChange, onSave, initialRoutineData }) => {
  const [routineData, setRoutineData] = useState({
    type: "Morning",
    name: "",
    time: timeOptions[7],
    duration: 10,
  });

  const [steps, setSteps] = useState([]);
  const [showProductSelect, setShowProductSelect] = useState(false);
  const [currentStepId, setCurrentStepId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  // ✅ FIX 1: Use a ref to create a stable, unique ID counter.
  // This counter persists across re-renders without causing them.
  const stepIdCounter = useRef(0);
  const getUniqueStepId = () => {
    stepIdCounter.current += 1;
    return stepIdCounter.current;
  };

  useEffect(() => {
    if (open) {
      // Reset the counter every time the dialog opens to keep IDs small
      stepIdCounter.current = 0;

      if (initialRoutineData) {
        setRoutineData({
          id: initialRoutineData.id,
          type: initialRoutineData.type || "Morning",
          name: initialRoutineData.name || "",
          time: initialRoutineData.time || timeOptions[7],
          duration: initialRoutineData.duration || 10,
        });

        const mappedSteps = initialRoutineData.steps.map((step) => ({
          id: getUniqueStepId(), // ✅ FIX 2: Assign a guaranteed unique ID
          productId: step.productId || null,
          productName: step.product || "",
          usage: step.usage || "",
        }));

        setSteps(
          mappedSteps.length > 0
            ? mappedSteps
            : [
                {
                  id: getUniqueStepId(),
                  productId: null,
                  productName: "",
                  usage: "",
                },
              ]
        );
      } else {
        setRoutineData({
          type: "Morning",
          name: "",
          time: timeOptions[7],
          duration: 10,
        });
        setSteps([
          {
            id: getUniqueStepId(),
            productId: null,
            productName: "",
            usage: "",
          },
        ]);
      }
      setValidationErrors({});
      setShowErrors(false);
    }
  }, [open, initialRoutineData]);

  const validateRoutine = () => {
    let errors = {};
    let isValid = true;
    if (!routineData.name.trim()) {
      errors.name = "Routine name is required.";
      isValid = false;
    }
    steps.forEach((step) => {
      if (!step.productId && !step.productName) {
        errors[`step_${step.id}`] = "Please select a product.";
        isValid = false;
      }
    });
    setValidationErrors(errors);
    return isValid;
  };

  const handleRoutineChange = (field, value) => {
    setRoutineData({ ...routineData, [field]: value });
  };

  const addStep = () => {
    // ✅ FIX 3: Use the counter function to add a new step with a unique ID
    setSteps([
      ...steps,
      { id: getUniqueStepId(), productId: null, productName: "", usage: "" },
    ]);
  };

  const handleDeleteStep = (id) => {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const handleProductSelect = (product) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === currentStepId
          ? {
              ...step,
              productId: product.id,
              productName: product.name,
              usage: product.usage || step.usage || "",
            }
          : step
      )
    );
    setShowProductSelect(false);
  };

  const handleUsageChange = (id, value) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, usage: value } : s))
    );
  };

  const handleSave = async () => {
    setShowErrors(true);
    if (!validateRoutine()) return;

    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to save a routine.");
        setIsSubmitting(false);
        return;
      }

      const routineToSave = {
        ...routineData,
        steps: steps
          .filter((s) => s.productId)
          // The mapping here remains correct, using the index for the database stepNumber
          .map(({ productId, usage }, index) => ({
            stepNumber: index + 1,
            product: productId,
            usage,
          })),
      };

      if (routineToSave.id) {
        await updateRoutine(routineToSave, user.id);
        alert("Routine updated successfully!");
      } else {
        await saveRoutine(routineToSave, user.id);
        alert("Routine saved successfully!");
      }
      onOpenChange(false);
      onSave(routineToSave);
    } catch (err) {
      alert("Failed to save routine: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const dialogTitle = initialRoutineData
    ? "Edit Routine"
    : "Create New Routine";
  const buttonText = initialRoutineData ? "Update Routine" : "Save Routine";

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-3xl w-full relative border border-gray-800 shadow-xl max-h-[90vh] flex flex-col">
            <div className="p-6 flex-grow overflow-auto">
              <button
                onClick={() => onOpenChange(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold mb-6">{dialogTitle}</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Routine Type
                    </label>
                    <select
                      value={routineData.type}
                      onChange={(e) =>
                        handleRoutineChange("type", e.target.value)
                      }
                      className="w-full rounded border border-gray-300 p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option>Morning</option>
                      <option>Night</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Routine Name
                    </label>
                    <input
                      type="text"
                      value={routineData.name}
                      onChange={(e) =>
                        handleRoutineChange("name", e.target.value)
                      }
                      placeholder="e.g. 'My Glow Routine'"
                      className={`w-full rounded border p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                        showErrors && validationErrors.name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {showErrors && validationErrors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.name}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Routine Steps
                  </label>
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <div key={step.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-medium">Step {index + 1}</span>
                          {steps.length > 1 && (
                            <button
                              onClick={() => handleDeleteStep(step.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Product
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={step.productName || ""}
                                readOnly
                                onClick={() => {
                                  setCurrentStepId(step.id);
                                  setShowProductSelect(true);
                                }}
                                placeholder="Select your product"
                                className={`w-full rounded border p-2 pr-10 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer ${
                                  showErrors &&
                                  validationErrors[`step_${step.id}`]
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                              />
                              <button
                                onClick={() => {
                                  setCurrentStepId(step.id);
                                  setShowProductSelect(true);
                                }}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                            {showErrors &&
                              validationErrors[`step_${step.id}`] && (
                                <p className="text-red-500 text-xs mt-1">
                                  {validationErrors[`step_${step.id}`]}
                                </p>
                              )}
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Usage
                            </label>
                            <input
                              type="text"
                              value={step.usage}
                              onChange={(e) =>
                                handleUsageChange(step.id, e.target.value)
                              }
                              placeholder="Auto-filled from selected product"
                              readOnly
                              className="w-full rounded border border-gray-300 p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addStep}
                      className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Step
                    </button>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => onOpenChange(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ProductSelectDropdown
        open={showProductSelect}
        onClose={() => setShowProductSelect(false)}
        onSelectProduct={handleProductSelect}
      />
    </>
  );
};

export default RoutineDialog;
