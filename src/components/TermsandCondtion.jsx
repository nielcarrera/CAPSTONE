import React from "react";

// This component displays the terms and conditions in a modal dialog.
const TermsAndConditions = ({ onAgree, onDecline }) => {
  return (
    <div className="fixed inset-0  bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            Terms and Conditions
          </h2>
        </div>
        <div className="p-6 overflow-y-auto text-gray-300 space-y-4 text-sm">
          <p>
            Welcome to <strong>[Insecurity Free]</strong> (“we,” “our,” “us”).
            By downloading, accessing, or using our mobile and web applications
            (collectively, the “Services”), you agree to these Terms and
            Conditions. Please read them carefully.
          </p>

          <div>
            <h3 className="font-semibold text-white mb-2">
              1. Use of the Service
            </h3>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                The app is designed to analyze skin images and provide general
                skincare product recommendations.
              </li>
              <li>
                The app is not a substitute for professional medical advice,
                diagnosis, or treatment. Always consult a qualified
                dermatologist or healthcare provider for medical concerns.
              </li>
              <li>
                You must be at least [minimum age, e.g., 16 or 18] to use the
                Service.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-2">
              2. User Responsibilities
            </h3>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                You agree to provide accurate information (e.g., skin type,
                personal details if required).
              </li>
              <li>
                You must not use the app for unlawful purposes or attempt to
                interfere with its functionality.
              </li>
              <li>
                You are responsible for any decisions you make based on the
                recommendations provided.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-2">
              3. Image Processing & Data
            </h3>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                The app may require access to your device’s camera to capture
                images for analysis.
              </li>
              <li>
                By uploading or capturing images, you consent to our use of
                those images for the purpose of analysis and recommendations.
              </li>
              <li>
                We do not share your personal data or images with third parties
                without your consent, except as required by law. For details,
                see our Privacy Policy.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-2">
              4. Product Recommendations
            </h3>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                Recommendations are based on general datasets and algorithms.
              </li>
              <li>
                We do not guarantee results, product effectiveness, or that
                recommendations will be suitable for everyone.
              </li>
              <li>
                Users with allergies or medical skin conditions should consult
                professionals before using recommended products.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-2">
              5. Intellectual Property
            </h3>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                All content, features, and software in the app are the property
                of [App/Team Name] and are protected by copyright and trademark
                laws.
              </li>
              <li>
                You may not copy, distribute, or reverse-engineer any part of
                the Service without permission.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-2">
              6. Limitations of Liability
            </h3>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                We are not liable for: Incorrect impurity detection, skin
                reactions from recommended products, any damages (direct,
                indirect, incidental, etc.) arising from the use of the app.
              </li>
              <li>Use of the app is at your own risk.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-2">
              7. Termination of Use
            </h3>
            <p>
              We reserve the right to suspend or terminate your access to the
              Service if you violate these Terms.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-2">
              8. Changes to Terms
            </h3>
            <p>
              We may update these Terms at any time. Continued use of the app
              after updates means you accept the revised Terms.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-2">9. Governing Law</h3>
            <p>These Terms are governed by the laws of [the Philippines].</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-2">10. Contact Us</h3>
            <p>
              If you have questions about these Terms, contact us at: 📧 [Your
              Team/Email Address]
            </p>
          </div>
        </div>
        <div className="p-4 bg-gray-900 border-t border-gray-700 flex justify-end gap-3 rounded-b-lg">
          <button
            onClick={onDecline}
            className="px-6 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-500 font-semibold transition-colors duration-200"
          >
            Decline
          </button>
          <button
            onClick={onAgree}
            className="px-6 py-2 rounded-md text-white bg-cyan-800 hover:bg-cyan-700 font-semibold transition-colors duration-200"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
