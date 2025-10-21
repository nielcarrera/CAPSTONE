import { useState } from "react";
import { X, HelpCircle, ChevronDown } from "lucide-react";

const faqData = [
  {
    question: "1. Is Insecurity Free a substitute for a dermatologist?",
    answer:
      "No. The app provides general skincare insights and recommendations based on datasets and algorithms. It is not a replacement for professional medical advice. Always consult a dermatologist for serious concerns.",
  },
  {
    question: "2. How does the skin analysis work?",
    answer:
      "The app uses image processing to analyze your skin and detect common impurities such as acne, blackheads, redness, or wrinkles. It then suggests suitable routines and products based on your detected skin type.",
  },
  {
    question: "3. Will my photos and data remain private?",
    answer:
      "Yes. Your uploaded images and personal data are kept secure and are not shared with third parties without your consent. The app follows strict privacy guidelines.",
  },
  {
    question: "4. Can I use the app even if I don’t know my skin type?",
    answer:
      "Yes. One of the app’s main features is helping users identify their skin type through the analysis process. Once identified, it will recommend routines and products tailored for your needs.",
  },
];

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-4 px-2"
      >
        <span className="font-semibold text-gray-800">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-cyan-800 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-4 px-2 text-gray-600">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FaqsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-cyan-800" />
            <h2 className="text-xl font-bold text-gray-800">
              Frequently Asked Questions
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <main className="p-6 overflow-y-auto">
          <div className="space-y-2">
            {faqData.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
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

export default FaqsModal;
