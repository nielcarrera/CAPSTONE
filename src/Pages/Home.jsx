import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import apk from "../assets/apk.png";
import routine from "../Pages/Routine";

import home1 from "../assets/home1.jpg";
import home2 from "../assets/home2.avif";
import home3 from "../assets/home3.webp";
import home4 from "../assets/home4.webp";

const Home = () => {
  const coreFeatures = [
    {
      title: "User Dashboard",
      description: "Track your progress",
      path: "/lp",
      image: home1, // You can replace this with actual feature-specific images
    },
    {
      title: "Identify Skintype and Impurities",
      description: "(for mobile application)",
      path: "download",
      image: home2,
    },
    {
      title: "Create Routine",
      description: "AI Generated Routines",
      path: "/create-routine",
      image: home3,
    },
    {
      title: "Manage Product",
      description: "Skin Product Reccomendation",
      path: "/manage-product",
      image: home4,
    },
  ];

  const handleRoutine = () => {
    navigate("/routine"); // Change "/dashboard" to the route you want
  };

  const navigate = useNavigate();
  const goToDownload = () => {
    navigate("/download");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <br></br>
      {/* Main Content */}
      <div className="w-full px-20 pt-20 tracking-wide">
        {/* Hero Section */}
        <h1 className="text-4xl font-bold mb-12 px-4 py-12">INSECURITY FREE</h1>

        {/* Core Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">CORE FEATURES</h2>
          <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
            {coreFeatures.map((feature, index) => (
              <Link
                key={index}
                to={feature.path}
                className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="aspect-square relative">
                  {/* Image */}
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent opacity-95 transition-opacity duration-300 group-hover:opacity-90" />

                  {/* Text Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                      {feature.title}
                    </h3>
                    {feature.description && (
                      <p className="text-white/90 text-sm transform opacity-0 transition-all duration-300 group-hover:opacity-100">
                        {feature.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <br></br>
        <br></br>
        <br></br>
        {/* Mobile Application Section */}
        <section className="mb-16 w-full ">
          <h2 className="text-3xl font-bold mb-20 text-center">
            Download our Mobile Application
          </h2>
          <div className="grid grid-rows-[auto_1fr_auto] h-full">
            <p className="text-gray-600 mb-20 text-xl flex-wrap w-full tracking-wide">
              Start your personal glow-up journey by downloading our{" "}
              <span className="font-semibold">mobile application</span>. Enjoy
              useful features designed to enhance your skincare routine.
              <p>
                {" "}
                Access useful features including{" "}
                <span className="font-semibold text-blue-400">
                  {" "}
                  Skintype Detection and Skin Impurity Detection.
                </span>{" "}
              </p>
            </p>

            <button
              className="bg-gray-800 text-white px-25 py-5 font-bold rounded-md hover:bg-cyan-900 transition-colors place-self-end"
              onClick={goToDownload}
            >
              Download App
            </button>
          </div>
        </section>

        {/*Dasboard  Section */}
        <div className="mb-16 mt-20 grid grid-cols-3 md:grid-cols-2 gap-8 items-center">
          <div className="px-4 md:px-0">
            <h2 className="text-2xl font-bold text-center md:text-left mb-10 md:mb-20">
              User Dashboard
            </h2>
            <p className="text-gray-600 text-xl  md:text-left">
              Track your progress by having comprehensive analysis reports,
              including useful graphic organizers to provide accurate and
              comprehensive report to analyze skin issues and impurities.
            </p>
            <button
              className="bg-gray-800 text-white px-20 py-4 font-bold rounded-md bg-cyan-900 hover:bg-cyan-900 transition-colors place-self-end transition-colors place-self-end mt-20"
              onClick={() => navigate("/db")}
            >
              Go to Dashboard
            </button>
          </div>

          <div className="flex md:justify-end">
            <div className="w-[100%] sm:w-[60%] md:w-full max-w-[400px]">
              <img
                src={home1}
                alt="Skintype detection"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>

        <br></br>
        <br></br>
        <br></br>
        <br></br>

        {/* Skin Impurity Detection Section */}

        <div className="grid grid-cols-2 md:grid-cols-2 gap-8 items-center mb-16">
          {/* Text Section */}
          <div className="px-4 md:px-0 order-2">
            <h2 className="text-2xl font-bold text-center md:text-left mb-20">
              Skin Impurity and Skin Type Detection
            </h2>
            <p className="text-gray-600 text-xl text-center md:text-left">
              Just a single face scanning using your cellphone cameras we can
              seamlessly identify skin impurities such as acne, blackheads, and
              redness using our advanced camera analysis. Helps identify skin
              type as well , we can tell rather it is oily,normal,sensitive or
              dry. Start downloading our{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate("/download")}
              >
                Mobile Application
              </span>
            </p>
            <button className="bg-gray-800 text-white  px-20 py-4 font-bold rounded-md hover:bg-cyan-900 transition-colors place-self-end mt-20">
              Go to Routine
            </button>
          </div>

          {/* Image Section */}
          <div className=" md:justify-end">
            <div className=" w-[100%] sm:w-[60%] md:w-full max-w-[400px]">
              <img
                src={home2}
                alt="Skintype detection"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>

        <br></br>
        <br></br>
        <br></br>
        <br></br>

        {/* Product Recommendation & Management Section */}
        <section className="mb-30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Text Section */}
            <div className="px-4 md:px-0">
              <h2 className="text-2xl font-bold text-center md:text-left mb-10 md:mb-20">
                Product Recommendation & Management
              </h2>
              <p className="text-gray-600 text-xl md:text-left">
                Get personalized skincare product recommendations based on your
                skin’s needs. Save and manage your favorite products to build an
                effective routine.
              </p>
              <button className="bg-gray-800 text-white px-20 py-4 font-bold rounded-md hover:bg-cyan-900 transition-colors place-self-end mt-10">
                Go to Products
              </button>
            </div>

            {/* Image Section */}
            <div className="flex md:justify-end">
              <div className="w-[100%] sm:w-[60%] md:w-full max-w-[500px]">
                <img
                  src={home3}
                  alt="Product management"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Routine Builder Section */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
          {/* Text Section */}
          <div className="px-4 md:px-0 order-2">
            <h2 className="text-2xl font-bold text-center md:text-left mb-20">
              Routine Builder
            </h2>
            <p className="text-gray-600 text-xl text-center md:text-left">
              Create a customized skincare routine tailored to your skin type
              and goals. Choose from morning, night, or fully personalized
              skincare routines.
            </p>
            <button
              className="bg-gray-800 text-white  px-20 py-4 font-bold rounded-md hover:bg-cyan-900 transition-colors place-self-end mt-20"
              onClick={handleRoutine}
            >
              Go to Routine
            </button>
          </div>

          {/* Image Section */}
          <div className="md:justify-end">
            <div className="h-[100%] sm:w-[60%] md:w-full max-w-[500px]">
              <img
                src={home4}
                alt="Routine builder"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
