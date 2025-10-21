import React, { useState } from "react";
import { FileText, HelpCircle, ChevronDown } from "lucide-react";
import NavbarSS from "../components/NavbarSplashScreen"; // ✅ Imported actual navbar component

// --- Data Definitions ---

const legalContent = {
  lastUpdated: "September 11, 2025",
  sections: [
    {
      title: "1. Use of the Service",
      content: [
        "The app is designed to analyze skin images and provide general skincare product recommendations.",
        "The app is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified dermatologist or healthcare provider for medical concerns.",
        "You must be at least 16 years old to use the Service.",
      ],
    },
    {
      title: "2. User Responsibilities",
      content: [
        "You agree to provide accurate information (e.g., skin type, personal details if required).",
        "You must not use the app for unlawful purposes or attempt to interfere with its functionality.",
        "You are responsible for any decisions you make based on the recommendations provided.",
      ],
    },
    {
      title: "3. Image Processing & Data",
      content: [
        "The app may require access to your device’s camera to capture images for analysis.",
        "By uploading or capturing images, you consent to our use of those images for the purpose of analysis and recommendations.",
        "We do not share your personal data or images with third parties without your consent, except as required by law. See our Privacy Policy.",
      ],
    },
    {
      title: "4. Product Recommendations",
      content: [
        "Recommendations are based on general datasets and algorithms.",
        "We do not guarantee results, product effectiveness, or that recommendations will be suitable for everyone.",
        "Users with allergies or medical skin conditions should consult professionals before using recommended products.",
      ],
    },
    {
      title: "5. Intellectual Property",
      content: [
        "All content, features, and software in the app are the property of Insecurity Free and are protected by copyright and trademark laws.",
        "You may not copy, distribute, or reverse-engineer any part of the Service without permission.",
      ],
    },
    {
      title: "6. Limitations of Liability",
      content: [
        "We are not liable for: incorrect impurity detection, skin reactions from recommended products, or any damages (direct, indirect, incidental, etc.) arising from the use of the app.",
        "Use of the app is at your own risk.",
      ],
    },
    {
      title: "7. Termination of Use",
      content: [
        "We reserve the right to suspend or terminate your access to the Service if you violate these Terms.",
      ],
    },
    {
      title: "8. Changes to Terms",
      content: [
        "We may update these Terms at any time. Continued use of the app after updates means you accept the revised Terms.",
      ],
    },
    {
      title: "9. Governing Law",
      content: ["These Terms are governed by the laws of the Philippines."],
    },
    {
      title: "10. Contact Us",
      content: [
        "If you have questions about these Terms, contact us at: insecurityfree@gmail.com",
      ],
    },
  ],
};

const faqs = [
  {
    q: "1. Is Insecurity Free a substitute for a dermatologist?",
    a: "No. The app provides general skincare insights and recommendations based on datasets and algorithms. It is not a replacement for professional medical advice. Always consult a dermatologist for serious concerns.",
  },
  {
    q: "2. How does the skin analysis work?",
    a: "The app uses image processing to analyze your skin and detect common impurities such as acne, blackheads, redness, or wrinkles. It then suggests suitable routines and products based on your detected skin type.",
  },
  {
    q: "3. Will my photos and data remain private?",
    a: "Yes. Your uploaded images and personal data are kept secure and are not shared with third parties without your consent. The app follows strict privacy guidelines.",
  },
  {
    q: "4. Can I use the app even if I don’t know my skin type?",
    a: "Yes. One of the app’s main features is helping users identify their skin type through the analysis process. Once identified, it will recommend routines and products tailored for your needs.",
  },
];

// --- Sub-Components ---

const AccordionItem = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-4 px-4 text-left font-semibold text-gray-800 hover:bg-gray-100 transition duration-150 rounded-lg"
      >
        <span>{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-green-600 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {isOpen && (
        <p className="px-4 pb-4 text-gray-600 text-base leading-relaxed">
          {content}
        </p>
      )}
    </div>
  );
};

const TermsContent = () => (
  <div>
    <p className="text-sm text-gray-500 italic mb-8">
      Last Updated: {legalContent.lastUpdated}
    </p>
    <div className="space-y-6">
      {legalContent.sections.map((section, index) => (
        <div
          key={index}
          className="border-l-4 border-green-500 pl-4 py-1 bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition duration-200"
        >
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">
            {section.title}
          </h3>
          <ul className="list-disc ml-5 space-y-2 text-base text-gray-700">
            {section.content.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

const FAQsContent = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 divide-y divide-gray-200">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-4 border-b">
      General Questions
    </h2>
    <div className="divide-y divide-gray-100">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} title={faq.q} content={faq.a} />
      ))}
    </div>
  </div>
);

// --- Main Component ---
const LegalSupportCenter = () => {
  const [activeTab, setActiveTab] = useState("Terms");

  const tabs = [
    { name: "Terms & Policy", component: TermsContent, icon: FileText },
    { name: "FAQs", component: FAQsContent, icon: HelpCircle },
  ];

  const ActiveComponent = tabs.find((t) => t.name === activeTab)?.component;

  return (
    <div className="min-h-screen mt-20 bg-gray-100 antialiased font-sans">
      {/* ✅ Real Navbar placed at top just like in About page */}
      <NavbarSS />

      {/* Header Section */}
      <header className="bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Legal & Support Center
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Understand our terms, policies, and frequently asked questions.
          </p>
        </div>
      </header>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto -mt-10 mb-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex justify-start border-b border-gray-200 bg-gray-50 rounded-t-xl">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm sm:text-base font-semibold transition duration-200 ease-in-out border-b-4 
                  ${
                    activeTab === tab.name
                      ? "text-green-600 border-green-600 bg-white"
                      : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Active Content */}
          <div className="p-6 sm:p-8 bg-gray-50 min-h-[60vh]">
            {ActiveComponent ? <ActiveComponent /> : null}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Insecurity Free. All Rights
          Reserved.
        </div>
      </footer>
    </div>
  );
};

export default LegalSupportCenter;
