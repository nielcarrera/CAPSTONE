import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import home1 from "../assets/home1.jpg";
import home2 from "../assets/home2.avif";
import home3 from "../assets/home3.webp";
import home4 from "../assets/home4.webp";

const Home = () => {
  const navigate = useNavigate();

  // Consolidated feature data
  const features = {
    core: [
      {
        title: "User Dashboard",
        description: "Track your progress",
        path: "/db",
        image: home1,
      },
      {
        title: "Identify Skintype",
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
        description: "Skin Product Recommendation",
        path: "/manage-product",
        image: home4,
      },
    ],
    sections: [
      {
        title: "User Dashboard",
        description:
          "Track your progress with comprehensive analysis reports and graphic organizers.",
        path: "/db",
        image: home1,
        buttonText: "Go to Dashboard",
        reverse: false,
      },
      {
        title: "Skin Impurity Detection",
        description:
          "Identify skin impurities and type with face scanning technology.",
        path: "/download",
        image: home2,
        buttonText: "Download App",
        reverse: true,
      },
      {
        title: "Product Management",
        description:
          "Get personalized skincare product recommendations based on your skin's needs.",
        path: "/manage-product",
        image: home3,
        buttonText: "Go to Products",
        reverse: false,
      },
      {
        title: "Routine Builder",
        description:
          "Create customized skincare routines tailored to your skin type and goals.",
        path: "/routine",
        image: home4,
        buttonText: "Go to Routine",
        reverse: true,
      },
    ],
  };

  // Navigation handlers
  const navigateTo = (path) => navigate(path);

  // Feature card component
  const FeatureCard = ({ title, description, path, image }) => (
    <Link
      to={path}
      className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      <div className="aspect-square relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent opacity-95 transition-opacity duration-300 group-hover:opacity-90" />
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
          <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
            {title}
          </h3>
          {description && (
            <p className="text-white/90 text-sm transform opacity-0 transition-all duration-300 group-hover:opacity-100">
              {description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );

  // Section component
  const Section = ({
    title,
    description,
    image,
    buttonText,
    path,
    reverse,
  }) => (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16 ${
        reverse ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div className="px-4 md:px-0">
        <h2 className="text-2xl font-bold text-center md:text-left mb-10">
          {title}
        </h2>
        <p className="text-gray-600 text-xl text-center md:text-left">
          {description}
        </p>
        <button
          onClick={() => navigateTo(path)}
          className="bg-cyan-900 text-white px-20 py-4 font-bold rounded-md hover:bg-cyan-800 transition-colors mt-10"
        >
          {buttonText}
        </button>
      </div>
      <div className="flex justify-center md:justify-end">
        <div className="w-full max-w-[400px]">
          <img
            src={image}
            alt={title}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="w-full px-4 md:px-20 pt-20 tracking-wide">
        {/* Hero Section */}
        <h1 className="text-4xl font-bold mb-12 px-4 py-12 text-center">
          INSECURITY FREE
        </h1>

        {/* Core Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">CORE FEATURES</h2>
          <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
            {features.core.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </section>

        {/* Mobile App Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Download our Mobile Application
          </h2>
          <div className="text-center">
            <p className="text-gray-600 mb-8 text-xl">
              Start your personal glow-up journey with our mobile application
              featuring{" "}
              <span className="font-semibold text-blue-400">
                Skintype Detection and Skin Impurity Detection
              </span>
              .
            </p>
            <button
              onClick={() => navigateTo("/download")}
              className="bg-gray-800 text-white px-8 py-4 font-bold rounded-md hover:bg-cyan-900 transition-colors"
            >
              Download App
            </button>
          </div>
        </section>

        {/* Feature Sections */}
        {features.sections.map((section, index) => (
          <Section key={index} {...section} />
        ))}
      </div>
    </div>
  );
};

export default Home;
