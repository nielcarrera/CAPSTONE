import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/NavbarSplashScreen";
import home1 from "../assets/home1.jpg";
import home2 from "../assets/home2.avif";
import home3 from "../assets/home3.webp";
import home4 from "../assets/home4.webp";

const Home = () => {
  const navigate = useNavigate();

  const coreFeatures = [
    {
      title: "User Dashboard",
      description: "Track your progress",
      path: "/login",
      image: home1,
    },
    {
      title: "Identify Skintype",
      description: "Mobile app feature",
      path: "/download",
      image: home2,
    },
    {
      title: "Create Routine",
      description: "AI Generated Routines",
      path: "/login",
      image: home3,
    },
    {
      title: "Product Management",
      description: "Personalized Recommendations",
      path: "/login",
      image: home4,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Main Content */}
      <main className="w-full mt-20 px-4 sm:px-8 md:px-12 lg:px-20 pt-8 md:pt-16 pb-20">
        {/* Hero Section */}
        <section className="mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-center md:text-left">
            <span className="bg-gradient-to-r from-cyan-600 to-gray-800 bg-clip-text text-transparent">
              INSECURITY FREE
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl">
            Your personalized skincare companion for healthier, glowing skin.
            Discover your skin type, track progress, and build perfect routines.
          </p>
        </section>

        {/* Core Features */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Core Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreFeatures.map((feature, index) => (
              <Link
                key={index}
                to={feature.path}
                className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="aspect-square relative">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Mobile Application Section */}
        <section className="mb-20 py-12 px-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Download Our Mobile App
            </h2>
            <p className="text-gray-600 mb-8 text-lg text-center">
              Start your personal glow-up journey with our mobile application.
              Enjoy features including{" "}
              <span className="font-semibold text-cyan-700">
                Skintype Detection and Skin Impurity Analysis
              </span>
              .
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/download")}
                className="bg-gradient-to-r from-cyan-600 to-gray-700 text-white px-10 py-3 font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-800 transition-all shadow-md"
              >
                Download Now
              </button>
            </div>
          </div>
        </section>

        {/* Dashboard Section */}
        <section className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Comprehensive Dashboard
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Track your progress with detailed analysis reports and visual
              organizers to monitor skin improvements and track product
              effectiveness over time.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-cyan-800 text-white px-8 py-3 font-semibold rounded-lg hover:bg-cyan-800 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="w-full max-w-md overflow-hidden rounded-xl shadow-xl">
              <img
                src={home1}
                alt="Dashboard preview"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Skin Analysis Section */}
        <section className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-md overflow-hidden rounded-xl shadow-xl">
              <img
                src={home2}
                alt="Skin analysis"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Advanced Skin Analysis
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Our mobile app uses advanced camera analysis to identify skin
              impurities like acne and blackheads, and determine your skin type
              (oily, normal, sensitive, or dry) with just a simple scan.
            </p>
            <button
              onClick={() => navigate("/download")}
              className="bg-cyan-800 text-white px-8 py-3 font-semibold rounded-lg hover:bg-cyan-800 transition-colors"
            >
              Get the App
            </button>
          </div>
        </section>

        {/* Product Recommendations Section */}
        <section className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Personalized Product Recommendations
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Get tailored skincare product suggestions based on your skin's
              unique needs. Save and organize your favorite products to build an
              effective, personalized routine.
            </p>
            <button className="bg-cyan-800 text-white px-8 py-3 font-semibold rounded-lg hover:bg-cyan-800 transition-colors">
              Browse Products
            </button>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md overflow-hidden rounded-xl shadow-xl">
              <img
                src={home3}
                alt="Product recommendations"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Routine Builder Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-md overflow-hidden rounded-xl shadow-xl">
              <img
                src={home4}
                alt="Routine builder"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              AI-Powered Routine Builder
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Create customized skincare routines tailored to your skin type and
              goals. Choose from morning, night, or fully personalized regimens
              designed by our AI technology.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-cyan-800 text-white px-8 py-3 font-semibold rounded-lg hover:bg-cyan-800 transition-colors"
            >
              Build Your Routine
            </button>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-8">
        <div className="max-w-6xl  grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-cyan-800">
              Insecurity Free
            </h3>
            <p className="text-gray-400">
              Your trusted skincare companion helping you achieve healthier,
              glowing skin through personalized routines and expert
              recommendations.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/download"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Download App
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Routine Builder
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>support@insecurityfree.com</li>
              <li>+1 (123) 456-7890</li>
              <li className="mt-4">
                Follow us on social media
                <div className="flex space-x-4 mt-2">
                  <a href="#" className="hover:text-cyan-800 transition-colors">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="hover:text-cyan-800 transition-colors">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="hover:text-cyan-800 transition-colors">
                    <i className="fab fa-facebook"></i>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Insecurity Free. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
