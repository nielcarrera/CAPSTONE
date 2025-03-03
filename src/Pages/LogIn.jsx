import { useState } from "react";
import { useNavigate } from "react-router-dom";
import google from "../assets/google.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import intro from "../Pages/Intro";
import reg1 from "../assets/home2.avif";
import reg2 from "../assets/home3.webp";
import reg3 from "../assets/home4.webp";
import logo from "../assets/weblogo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const goToRegister = () => {
    navigate("/register");
  };

  const handleSignIn = () => {
    navigate("/intro"); // Change "/dashboard" to the route you want
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Remember Me:", rememberMe);
  };

  const features = [
    { image: reg1, caption: "Seamless Skintype and Skin Impurity Identifying" },
    {
      image: reg2,
      caption: "Personalized Skin Product Recommendation Based on Needs",
    },
    {
      image: reg3,
      caption: "AI - Generated Skincare Routine to Ensure Personal Glow Up",
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-4 ">
      <div
        className="flex flex-col md:flex-row bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        style={{ maxWidth: "1000px", width: "100%" }}
      >
        <div className="p-10 md:w-1/2 w-full">
          <img
            src={logo} // Replace with your actual logo path
            alt="Logo"
            className="w-35 h-13"
          />
          <h2 className="text-2xl ml-5 md:text-3xl font-bold mb-10 mt-5">
            Welcome to Insecurity Free
          </h2>
          <p className="mb-4 text-sm md:text-base">
            Don't have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={goToRegister}
            >
              Sign up
            </span>
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2.5 border rounded bg-gray-700 text-white text-sm"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-2.5 border rounded bg-gray-700 text-white text-sm"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Remember me</span>
              </div>
              <a href="#" className="text-blue-400 text-sm hover:underline">
                Forgot password?
              </a>
            </div>
            <button
              type="button"
              className="bg-cyan-900 hover:bg-cyan-800 p-2.5 rounded text-base font-medium"
              onClick={handleSignIn}
            >
              Sign in
            </button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
            <button
              type="button"
              className="flex items-center justify-center gap-2 p-3 border border-gray-600 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <img src={google} alt="Google" className="w-5 h-5" />
              <span>Sign in with Google</span>
            </button>
          </form>
        </div>

        {/* Slideshow for Features */}
        <div className="md:w-1/2 relative" style={{ minHeight: "400px" }}>
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3000 }}
            navigation
            style={{ height: "100%" }}
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index} style={{ height: "100%" }}>
                <div className="relative w-full h-full">
                  <img
                    src={feature.image}
                    alt={`Feature ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                    <p className="text-white text-xl md:text-3xl font-bold text-center">
                      {feature.caption}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Login;
