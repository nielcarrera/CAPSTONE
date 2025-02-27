import { useState } from "react";
import { Plus, X } from "lucide-react";

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  const ampm = i < 12 ? "AM" : "PM";
  return `${hour}:00 ${ampm}`;
});

const RoutineDialog = ({ open, onOpenChange, onSave }) => {
  const [steps, setSteps] = useState([{ id: 1, product: "", note: "" }]);
  const [showProductDialog, setShowProductDialog] = useState(false);

  const addStep = () => {
    const newStep = {
      id: steps.length + 1,
      product: "",
      note: "",
    };
    setSteps([...steps, newStep]);
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4 ">
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
                <label className="block text-sm font-medium ml-15 text-gray-700">
                  Steps
                </label>
                {steps.map((step) => (
                  <div key={step.id} className="grid grid-cols-7 gap-4">
                    <div className="col-span-3 flex items-center ml-20  ">
                      <span className="font-medium">{step.id}</span>
                    </div>
                    <div className="col-span-3">
                      <button
                        className="w-full px-4 py-2 border bg-gray-800 rounded-md hover:bg-gray-600 text-white transition-colors"
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
                  className=" ml-7 mb-3 inline-flex items-center px-3 py-2 text-sm font-sm border text-white bg-cyan-800 rounded-md hover:bg-cyan-600 transition-colors"
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
            {/* Content will be added later */}
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
