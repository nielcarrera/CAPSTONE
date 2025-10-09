import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import reg1 from "../assets/home2.avif";
import reg2 from "../assets/home3.webp";
import reg3 from "../assets/home4.webp";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import TermsAndConditions from "../components/TermsandCondtion";

const Register = () => {
  const navigate = useNavigate();

  // form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // field errors
  const [errors, setErrors] = useState({});

  const validatePassword = (pwd) => {
    const minLength = /.{8,}/;
    const upper = /[A-Z]/;
    const number = /[0-9]/;
    const nonNumber = /[a-zA-Z]/;
    return (
      minLength.test(pwd) &&
      upper.test(pwd) &&
      number.test(pwd) &&
      nonNumber.test(pwd)
    );
  };

  const validateFields = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters, include an uppercase letter, a number, and a letter.";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!age) newErrors.age = "Age is required.";
    if (!gender) newErrors.gender = "Please select your gender.";
    if (!agree) newErrors.agree = "You must agree to the Terms & Conditions.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const insertUserData = async (userId, email, userData) => {
    const { error: userError } = await supabase
      .from("user")
      .insert([{ id: userId, email, first_time: true }])
      .select();

    if (userError)
      throw new Error(`Insert into user failed: ${JSON.stringify(userError)}`);

    const { error: detailsError } = await supabase.from("user_details").insert([
      {
        id: userId,
        first_name: userData.first_name,
        last_name: userData.last_name,
        age: userData.age,
        gender: userData.gender,
      },
    ]);

    if (detailsError)
      throw new Error(
        `Insert into user_details failed: ${JSON.stringify(detailsError)}`
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // 1️⃣ Create the user WITHOUT keeping them signed in
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: { first_name: firstName, last_name: lastName, age, gender },
        },
      });

      if (authError) throw authError;

      // 2️⃣ Insert additional user data into your custom table
      const userId = authData.user?.id;
      if (userId) {
        await insertUserData(userId, email, {
          first_name: firstName,
          last_name: lastName,
          age,
          gender,
        });
      }

      // 3️⃣ Immediately log the user out to prevent auto-login
      await supabase.auth.signOut();

      // 4️⃣ Redirect to login
      alert("Registration successful! Please log in to continue.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message);
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
        {/* Left side - Registration form */}
        <div className="p-10 md:w-1/2 w-full">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 mt-3">
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
            {/* First & Last Name */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="w-full sm:w-1/2">
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2.5 border rounded bg-gray-700 text-white text-sm"
                />
                {errors.firstName && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="w-full sm:w-1/2">
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2.5 border rounded bg-gray-700 text-white text-sm"
                />
                {errors.lastName && (
                  <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2.5 border rounded bg-gray-700 text-white text-sm w-full"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2.5 border rounded bg-gray-700 text-white text-sm w-full"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-300 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="p-2.5 border rounded bg-gray-700 text-white text-sm w-full"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-300 hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Age & Gender */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="w-full sm:w-1/2">
                <input
                  type="number"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-2.5 border rounded bg-gray-700 text-white text-sm"
                />
                {errors.age && (
                  <p className="text-red-400 text-xs mt-1">{errors.age}</p>
                )}
              </div>

              <div className="w-full sm:w-1/2">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2.5 border rounded bg-gray-700 text-white text-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-400 text-xs mt-1">{errors.gender}</p>
                )}
              </div>
            </div>

            {/* Terms */}
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="w-4 h-4"
                />
                <p className="text-sm">
                  I agree to the{" "}
                  <span
                    className="text-blue-400 cursor-pointer hover:underline"
                    onClick={() => setShowTerms(true)}
                  >
                    Terms & Conditions
                  </span>
                </p>
              </div>
              {errors.agree && (
                <p className="text-red-400 text-xs mt-1">{errors.agree}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-cyan-900 hover:bg-cyan-800 p-2.5 rounded text-base font-medium"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            {/* General error (e.g. Supabase insert fail) */}
            {errors.general && (
              <p className="text-red-400 text-sm mt-2 text-center">
                {errors.general}
              </p>
            )}
          </form>
        </div>

        {/* Right side - Slideshow */}
        <div className="md:w-1/2 relative" style={{ minHeight: "400px" }}>
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            loop
            autoplay={{ delay: 3000 }}
            navigation
            style={{ height: "100%" }}
          >
            {features.map((f, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-full">
                  <img
                    src={f.image}
                    alt={`Feature ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                    <p className="text-white text-xl md:text-3xl font-bold text-center">
                      {f.caption}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <TermsAndConditions
          onAgree={() => {
            setAgree(true);
            setShowTerms(false);
          }}
          onDecline={() => {
            setAgree(false);
            setShowTerms(false);
          }}
        />
      )}
    </div>
  );
};

export default Register;
