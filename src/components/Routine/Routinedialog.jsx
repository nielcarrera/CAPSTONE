import { useState } from "react";
import { Plus, X } from "lucide-react";

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  const ampm = i < 12 ? "AM" : "PM";
  return `${hour}:00 ${ampm}`;
});

// Predefined list of products
const predefinedProducts = [
  "Salicylic Acid Cleanser",
  "Vitamin C Serum",
  "Moisturizing Cream",
  "Sunscreen SPF 50",
  "Retinol Serum",
  "Hyaluronic Acid",
  "Niacinamide",
  "AHA/BHA Exfoliant",
];

const RoutineDialog = ({ open, onOpenChange, onSave }) => {
  const [steps, setSteps] = useState([
    { id: 1, product: "", note: "", isCustom: false },
  ]);
  const [showProductDialog, setShowProductDialog] = useState(false);

  const addStep = () => {
    const newStep = {
      id: steps.length + 1,
      product: "",
      note: "",
      isCustom: false, // Default to dropdown
    };
    setSteps([...steps, newStep]);
  };

  const handleProductChange = (stepId, value) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId ? { ...step, product: value } : step
      )
    );
  };

  const handleProductSelectFromDialog = (stepId, product) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId ? { ...step, product, isCustom: false } : step
      )
    );
    setShowProductDialog(false); // Close the dialog after selection
  };

  const toggleCustomInput = (stepId) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId
          ? { ...step, isCustom: !step.isCustom, product: "" }
          : step
      )
    );
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full relative border-2 border-cyan-800 p-5">
          <div className="p-6">
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-semibold">Add New Routine</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Routine Type
                </label>
                <select className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500">
                  <option>Morning</option>
                  <option>Night</option>
                  <option>Custom</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <select className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500">
                    {timeOptions.map((time) => (
                      <option key={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    defaultValue="10"
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Routine Name
                </label>
                <input
                  type="text"
                  placeholder="Enter routine name"
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-4 border-1 rounded-xl border-gray-800 shadow-lg pt-3 shadow-gray-800">
                <label className="block text-sm font-medium ml-16 text-gray-800">
                  Steps
                </label>
                {steps.map((step) => (
                  <div key={step.id} className="grid grid-cols-7 gap-4">
                    <div className="col-span-3 flex items-center ml-20">
                      <span className="font-medium">{step.id}</span>
                    </div>
                    <div className="col-span-3">
                      {/* Dropdown or Text Field */}
                      {step.isCustom ? (
                        <div className="relative">
                          <input
                            type="text"
                            value={step.product}
                            onChange={(e) =>
                              handleProductChange(step.id, e.target.value)
                            }
                            placeholder="Enter your own product"
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                          />
                          <button
                            onClick={() => toggleCustomInput(step.id)}
                            className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <select
                            value={step.product}
                            onChange={(e) => {
                              if (e.target.value === "custom") {
                                toggleCustomInput(step.id);
                              } else {
                                handleProductChange(step.id, e.target.value);
                              }
                            }}
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 appearance-none"
                          >
                            <option value="">Select a product</option>
                            {predefinedProducts.map((product) => (
                              <option key={product} value={product}>
                                {product}
                              </option>
                            ))}
                            <option value="custom">Enter my own</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                      {/* Go to My Products Button */}
                      <button
                        className="w-full mt-2 px-4 py-2 border bg-gray-800 rounded-md hover:bg-gray-600 text-white transition-colors"
                        onClick={() => setShowProductDialog(true)}
                      >
                        Go to My Products
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addStep}
                  className="ml-7 mb-3 inline-flex items-center px-3 py-2 text-sm font-sm border text-white bg-cyan-800 rounded-md hover:bg-cyan-600 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </button>
              </div>

              <button
                className="w-full px-4 py-2 bg-cyan-800 text-white rounded-md hover:bg-cyan-900 transition-colors"
                onClick={() => {
                  onSave?.();
                  onOpenChange(false);
                }}
              >
                Save Routine
              </button>
            </div>
          </div>
        </div>
      </div>

      {showProductDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setShowProductDialog(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">My Products</h2>
            {/* Example saved products */}
            <div className="space-y-4">
              {["Saved Product 1", "Saved Product 2"].map((product) => (
                <div
                  key={product}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    handleProductSelectFromDialog(steps[0].id, product)
                  }
                >
                  <p className="text-gray-800">{product}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Generate Routine Button */}
      <button
        className="fixed bottom-6 right-6 px-6 py-3 bg-cyan-800 text-white rounded-full shadow-lg hover:bg-cyan-900 transition-colors flex items-center"
        onClick={() => {
          // Add your logic to generate routine here
          alert("Generate Routine clicked!");
        }}
      >
        <span className="mr-2">Need some help?</span>
        <Plus className="w-5 h-5" />
      </button>
    </>
  );
};

export default RoutineDialog;
