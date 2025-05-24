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
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const markIntroAsSeen = async () => {
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        const { error } = await supabase
          .from("userDetails")
          .update({ has_seen_intro: true })
          .eq("email", userEmail);
        if (error) console.error("Error updating intro status:", error);
      }
    };
    markIntroAsSeen();
  }, []);

  const nextSlide = () => {
    if (currentSlide === slides.length - 1) {
      navigate("/home");
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  // Responsive breakpoints
  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-cyan-900 to-slate-900" />

      {/* Content Container */}
      <div className="relative z-10 h-full w-full flex flex-col">
        <AnimatePresence mode="wait">
          {!showFeatures ? (
            // Welcome Screen
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="h-full flex flex-col items-center justify-center px-4 sm:px-6"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className={`${
                  isMobile ? "w-40 h-40" : "w-48 h-48 md:w-64 md:h-64"
                } mb-8 sm:mb-12 rounded-full overflow-hidden`}
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
                className={`${
                  isMobile ? "text-2xl" : "text-3xl md:text-4xl lg:text-5xl"
                } font-bold text-white mb-4 sm:mb-6 text-center max-w-3xl leading-tight px-2`}
              >
                Welcome to Insecurity Free!
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className={`${
                  isMobile ? "text-base" : "text-lg md:text-xl lg:text-2xl"
                } text-cyan-100 mb-8 sm:mb-12 text-center px-4`}
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
                className={`${
                  isMobile ? "px-6 py-3 text-sm" : "px-8 py-4 text-lg"
                } fixed bottom-8 sm:bottom-12 bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-400 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center`}
              >
                Proceed
                <ChevronRight
                  className={`${isMobile ? "w-4 h-4" : "w-6 h-6"} ml-2`}
                />
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
              className="h-full flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24"
            >
              <div className="max-w-7xl mx-auto w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className={`grid ${
                      isMobile ? "grid-cols-1" : "grid-cols-2"
                    } gap-6 md:gap-12 items-center`}
                  >
                    {/* Text Content - Order changes on mobile */}
                    <div
                      className={`text-white space-y-4 sm:space-y-6 md:space-y-8 ${
                        isMobile ? "order-2 mt-6" : "order-1"
                      }`}
                    >
                      <h2
                        className={`${
                          isMobile
                            ? "text-xl"
                            : "text-2xl sm:text-3xl md:text-4xl"
                        } font-bold leading-tight`}
                      >
                        {slides[currentSlide].header}
                      </h2>
                      <p
                        className={`${
                          isMobile
                            ? "text-sm"
                            : "text-base sm:text-lg md:text-xl"
                        } text-cyan-100 leading-relaxed`}
                      >
                        {slides[currentSlide].description}
                      </p>
                    </div>

                    {/* Image - Order changes on mobile */}
                    <motion.div
                      className={`${isMobile ? "order-1" : "order-2"}`}
                      whileHover={{ scale: isMobile ? 1 : 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].header}
                        className="rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl w-full aspect-video object-cover"
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div className="flex flex-col items-center space-y-4 sm:space-y-6 mt-8 sm:mt-12">
                  {/* Progress Dots */}
                  <div className="flex space-x-3 sm:space-x-4">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`${
                          isMobile ? "w-3 h-3" : "w-4 h-4"
                        } rounded-full transition-all duration-500 ${
                          currentSlide === index
                            ? "bg-cyan-400 scale-110"
                            : "border-2 border-cyan-400"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-center space-x-4 sm:space-x-6 w-full max-w-md">
                    {currentSlide > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={prevSlide}
                        className={`${
                          isMobile ? "px-4 py-2 text-sm" : "px-6 py-3 text-base"
                        } flex-1 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 rounded-full text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center`}
                      >
                        <ArrowLeft
                          className={`${
                            isMobile ? "w-4 h-4" : "w-5 h-5"
                          } mr-1 sm:mr-2`}
                        />
                        Back
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextSlide}
                      className={`${
                        isMobile ? "px-4 py-2 text-sm" : "px-6 py-3 text-base"
                      } flex-1 bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-400 rounded-full text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center`}
                    >
                      {currentSlide === slides.length - 1 ? (
                        <>
                          Start Now
                          <ChevronRight
                            className={`${
                              isMobile ? "w-4 h-4" : "w-5 h-5"
                            } ml-1 sm:ml-2`}
                          />
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight
                            className={`${
                              isMobile ? "w-4 h-4" : "w-5 h-5"
                            } ml-1 sm:ml-2`}
                          />
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
