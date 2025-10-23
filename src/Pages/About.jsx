import React from "react";
import { Lightbulb, Layers, Zap, CheckCircle } from "lucide-react"; // Example icons from lucide-react
import NavbarSS from "../components/NavbarSplashScreen";

const AboutInsecurityFree = () => {
  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      <NavbarSS />
      {/* Header Section */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mt-20 mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            About <span className="text-green-600">Insecurity Free</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Empowering your personal glow-up journey with technology and
            skincare awareness.
          </p>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Section 1: Our Mission and Origin */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg border-t-4 border-green-500">
            <div className="flex items-center space-x-4 mb-6">
              <Lightbulb className="w-8 h-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Our Vision and Genesis
              </h2>
            </div>

            <p className="mt-4 text-lg text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-800">
                Insecurity Free
              </span>{" "}
              is a student-led innovation created by Bachelor of Science in
              Information Technology students at National University –
              Dasmariñas.
            </p>

            <p className="mt-4 text-lg text-gray-700 leading-relaxed">
              Our core goal is to **empower individuals on their personal
              glow-up journey** by skillfully combining cutting-edge
              **technology with essential skincare awareness**. We believe
              confidence starts with understanding your unique skin.
            </p>
          </div>

          {/* Section 2: Core Functionality - Image Processing */}
          <div className="lg:col-span-1 bg-green-50 p-8 rounded-xl shadow-lg">
            <div className="flex items-center space-x-4 mb-6">
              <Layers className="w-8 h-8 text-green-700" />
              <h2 className="text-2xl font-bold text-green-800">
                How We Help You
              </h2>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              The app helps users understand their skin better by using
              **advanced image processing** to:
            </p>
            <ul className="mt-4 space-y-3 text-lg text-gray-700 list-disc pl-5">
              <li>Detect common impurities</li>
              <li>Identify skin types accurately</li>
              <li>Recommend reliable, ingredient-based skincare solutions</li>
            </ul>
          </div>
        </div>

        {/* --- */}

        {/* Section 3: Key Features Showcase */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            Our Powerful Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition duration-300">
              <Zap className="w-10 h-10 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">
                Skin Profile Identification
              </h3>
              <p className="mt-2 text-gray-600">
                Quickly and accurately determine your specific skin type and
                skintone to guide your routine.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition duration-300">
              <CheckCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">
                Real-time Impurity Detection
              </h3>
              <p className="mt-2 text-gray-600">
                See immediate analysis of common impurities on your skin via
                image processing.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition duration-300">
              <Lightbulb className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">
                Personalized Recommendations
              </h3>
              <p className="mt-2 text-gray-600">
                Get tailored skincare product and ingredient suggestions based
                on your analysis.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition duration-300">
              <Layers className="w-10 h-10 text-teal-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">
                Routine Builder & Tracking
              </h3>
              <p className="mt-2 text-gray-600">
                Develop a consistent routine and monitor your progress over
                time.
              </p>
            </div>
          </div>
        </section>

        {/* --- */}

        {/* Disclaimer/Note Section */}
        <section className="mt-16 bg-blue-50 p-6 rounded-xl shadow-md border-l-4 border-blue-600">
          <h3 className="text-xl font-bold text-blue-800 mb-3">
            Important Note
          </h3>
          <p className="text-lg text-gray-700">
            **Insecurity Free is not a replacement for professional
            dermatological care**, but a supportive companion to help you gain
            confidence and consistency in your skincare journey. Always consult
            a professional for persistent or severe skin conditions.
          </p>
        </section>
      </main>

      {/* Footer (Optional, but good for professionalism) */}
      <footer className="mt-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          &copy; {new Date().getFullYear()} Insecurity Free. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
};

export default AboutInsecurityFree;
