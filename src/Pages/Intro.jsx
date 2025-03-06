import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import introimg from "../assets/char.png";
import s1 from "../assets/slide1.png";
import s2 from "../assets/slide2.png";
import s3 from "../assets/slide3.png";
import supabase from "../supabase";

const slides = [
  {
    image: s1,
    header: "Track Your Skin Impurities and Identify Your Skin Type",
    description:
      "Start tracking skin impurities in different type of bodies and identifying skintype by simply using your camera phones.",
  },
  {
    image: s2,
    header: "Personalized Routines and Skin Products",
    description:
      "Receive credible and personalized skincare routine and product recommendation made just for you.",
  },
  {
    image: s3,
    header: "Useful Tools and Analytics",
    description:
      "Track your personal glow up progress by utilizing our useful analytical tools and dashboard.",
  },
];

const IntroScreen = () => {
  const [showFeatures, setShowFeatures] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const markIntroAsSeen = async () => {
      // Get the current user's email from local storage or state
      const userEmail = localStorage.getItem("userEmail");

      if (userEmail) {
        // Update the `has_seen_intro` field in the database
        const { error } = await supabase
          .from("userDetails")
          .update({ has_seen_intro: true })
          .eq("email", userEmail);

        if (error) {
          console.error("Error updating intro status:", error);
        }
      }
    };

    markIntroAsSeen();
  }, []);

  const nextSlide = () => {
    if (currentSlide === slides.length - 1) {
      navigate("/home"); // Navigate to main app when finished
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-cyan-900 to-slate-900" />

      {/* Content Container */}
      <div className="relative z-10 h-full">
        <AnimatePresence mode="wait">
          {!showFeatures ? (
            // Welcome Screen
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="h-full flex flex-col items-center mb-20 justify-center px-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="w-48 h-48 md:w-72 md:h-72 mb-12 rounded-full overflow-hidden"
              >
                <img
                  src={introimg}
                  alt="Welcome"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-4xl md:text-6xl font-bold text-white mb-6 text-center max-w-3xl leading-tight"
              >
                Welcome to Insecurity Free!
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-xl md:text-2xl text-cyan-100 mb-12 text-center"
              >
                Your Personal Glow Up Companion
              </motion.p>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFeatures(true)}
                className="fixed bottom-15 right-30 px-15 py-4 text-lg bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-400 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
              >
                Proceed
                <ChevronRight className="w-8 h-6 ml-2" />
              </motion.button>
            </motion.div>
          ) : (
            // Features Slideshow
            <motion.div
              key="features"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="h-full flex flex-col justify-center mt-10 px-6 md:px-12 lg:px-24"
            >
              <div className="max-w-7xl mx-auto w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="grid md:grid-cols-2 gap-25 items-center"
                  >
                    {/* Text Content */}
                    <div className="text-white space-y-8 order-2 md:order-1">
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                        {slides[currentSlide].header}
                      </h2>
                      <p className="text-lg md:text-xl text-cyan-100 leading-relaxed">
                        {slides[currentSlide].description}
                      </p>
                    </div>

                    {/* Image */}
                    <motion.div
                      className="order-1 md:order-2"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].header}
                        className="rounded-2xl shadow-2xl w-full aspect-video object-cover"
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div className="flex flex-col items-center space-y-10">
                  {/* Progress Dots */}
                  <div className="flex space-x-4 mt-15">
                    {slides.map((_, index) => (
                      <div
                        key={index}
                        className={`w-4 h-4 rounded-full transition-all duration-500 ${
                          currentSlide === index
                            ? "bg-cyan-400 scale-110"
                            : "border-2 border-cyan-400"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-center space-x-20 mt-5">
                    {currentSlide > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={prevSlide}
                        className="px-15 py-3 text-lg bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextSlide}
                      className="px-15 py-3 text-lg bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-400 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                    >
                      {currentSlide === slides.length - 1 ? (
                        <>
                          Start Now
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IntroScreen;
