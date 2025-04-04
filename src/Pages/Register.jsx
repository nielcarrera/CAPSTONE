import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import reg1 from "../assets/home2.avif";
import reg2 from "../assets/home3.webp";
import reg3 from "../assets/home4.webp";
import logo from "../assets/weblogo.png";
import supabase from "../supabase";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!agree) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Register the user using Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        // Check if the error is due to the email already being registered
        if (authError.message.includes("User already registered")) {
          alert(
            "This email is already registered. Please use a different email or log in."
          );
        } else {
          console.error("Auth Error:", authError);
          throw new Error(`Authentication failed: ${authError.message}`);
        }
        return; // Stop further execution
      }

      if (!authData.user) {
        throw new Error("User registration failed. No user data returned.");
      }

      const userId = authData.user.id;
      console.log("User ID:", userId); // Debugging line

      // Optional: Add a small delay to ensure the user is fully registered
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay

      // Step 2: Insert user details into the 'userDetails' table
      const { data: detailsData, error: detailsError } = await supabase
        .from("userDetails")
        .insert([
          {
            firstName,
            lastName,
            age: parseInt(age),
            gender,
            userId, // Associate details with the authenticated user's ID
          },
        ]);

      if (detailsError) {
        console.error("Details Error:", detailsError);
        throw new Error(
          `Failed to insert user details: ${detailsError.message}`
        );
      }

      alert(
        "Registration successful! Please check your email to confirm your account."
      );
      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error.message);
      alert("Error during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const features = [
    {
      image: reg1,
      caption: "Seamless Skintype and Skin Impurity Identifying",
    },
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
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-4">
      <div
        className="flex flex-col md:flex-row bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        style={{ maxWidth: "1150px", width: "100%" }}
      >
        <div className="p-10 md:w-1/2 p-6 w-full">
          <img
            src={logo} // Replace with your actual logo path
            alt="Logo"
            className="w-35 h-13"
          />
          <h2 className="text-2xl ml-5 md:text-3xl font-bold mb-10 mt-5">
            Create an account
          </h2>
          <p className="mb-4 text-sm md:text-base">
            Already have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Log In
            </span>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full sm:w-1/2 p-2.5 border rounded bg-gray-700 text-white text-sm"
              />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full sm:w-1/2 p-2.5 border rounded bg-gray-700 text-white text-sm"
              />
            </div>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-2.5 border rounded bg-gray-700 text-white text-sm"
            />
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="p-2.5 border rounded bg-gray-700 text-white text-sm"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="w-full sm:w-1/2 p-2.5 border rounded bg-gray-700 text-white text-sm"
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="w-full sm:w-1/2 p-2.5 border rounded bg-gray-700 text-white text-sm"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-4 h-4"
              />
              <p className="text-sm">
                I agree to the{" "}
                <a href="#" className="text-blue-400">
                  Terms & Conditions
                </a>
              </p>
            </div>
            <button
              type="submit"
              className="bg-cyan-900 hover:bg-cyan-800 p-2.5 rounded text-base font-medium"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
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

export default Register;
