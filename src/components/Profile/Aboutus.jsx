import { X, Info } from "lucide-react";

const AboutUsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Info className="w-6 h-6 text-cyan-800" />
            <h2 className="text-xl font-bold text-gray-800">
              About Insecurity Free
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <main className="p-6 overflow-y-auto text-gray-600 space-y-4">
          <p>
            <strong>Insecurity Free</strong> is a student-led innovation created
            by Bachelor of Science in Information Technology students at
            National University – Dasmariñas. Our goal is to empower individuals
            on their personal glow-up journey by combining technology with
            skincare awareness.
          </p>
          <p>
            The app helps users understand their skin better by using image
            processing to detect common impurities, identify skin types, and
            recommend reliable, ingredient-based skincare solutions.
          </p>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Features include:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-cyan-800">
              <li>
                <span className="text-gray-600">Skin type identification</span>
              </li>
              <li>
                <span className="text-gray-600">
                  Real-time impurity detection
                </span>
              </li>
              <li>
                <span className="text-gray-600">
                  Personalized skincare recommendations
                </span>
              </li>
              <li>
                <span className="text-gray-600">
                  Routine builder and progress tracking
                </span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg border-l-4 border-cyan-800">
            <p className="text-sm">
              <strong>Note:</strong> Insecurity Free is not a replacement for
              professional dermatological care, but a supportive companion to
              help you gain confidence and consistency in your skincare journey.
            </p>
          </div>
        </main>

        <footer className="p-4 bg-gray-50 border-t border-gray-200 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-cyan-800 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AboutUsModal;
