import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";

const RoutineCard = ({ routine, onEdit, onDelete }) => {
  const [notifications, setNotifications] = useState(routine.notifications);

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-5">
              {routine.name}
            </h3>
            <div className="text-sm text-gray-600 mt-1 space-y-1">
              <p>Time: {routine.time}</p>
              <p>Duration: {routine.duration} mins</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-green-500text-sm text-gray-600">Notify Me</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer "
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-300 border-1 border-cyan-800 rounded-2xl w-10/12 ">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-600 border-b">
              <th className="pb-3 pl-4 w-1/4">Step</th>
              <th className="pb-3 w-1/2">Product</th>
              <th className="pb-3 w-1/4">Body Part</th>
            </tr>
          </thead>
          <tbody>
            {routine.steps.map((step) => (
              <tr
                key={step.id}
                className="border-b border-gray-50 last:border-0"
              >
                <td className="py-3 pl-4 text-gray-800">{step.id}</td>
                <td className="py-3 font-medium text-gray-800">
                  {step.product}
                </td>
                <td className="py-3 text-sm text-gray-600">{step.bodyPart}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
        <button
          className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center"
          onClick={() => onEdit(routine)}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </button>
        <button
          className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors inline-flex items-center"
          onClick={() => onDelete(routine.id)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default RoutineCard;
