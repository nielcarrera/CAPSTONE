import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import reg1 from "../assets/home2.avif";
import reg2 from "../assets/home3.webp";
import reg3 from "../assets/home4.webp";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import TermsAndConditions from "../components/TermsandCondtion";

// A small, reusable component for rendering each validation checklist item
const ValidationCriterion = ({ isValid, text }) => (
  <div
    className={`flex items-center gap-2 text-xs ${
      isValid ? "text-green-400" : "text-gray-400"
    }`}
  >
    {isValid ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
    <span>{text}</span>
  </div>
);

const Register = () => {
  const navigate = useNavigate();

  // Consolidated form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
  });

  // State for agreement, loading, and modal visibility
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false); // State to control button disability

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for validation
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({}); // Tracks fields the user has focused on

  // Real-time validation state for checklists
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSymbol: false,
  });
  const [emailValidation, setEmailValidation] = useState({
    hasAt: false,
    hasDot: false,
  });

  // Effect for real-time password validation
  useEffect(() => {
    const pwd = formData.password;
    setPasswordValidation({
      minLength: pwd.length >= 8,
      hasUpper: /[A-Z]/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSymbol: /[\W_]/.test(pwd),
    });
  }, [formData.password]);

  // Effect for real-time email validation
  useEffect(() => {
    const email = formData.email;
    setEmailValidation({
      hasAt: email.includes("@"),
      hasDot: email.includes("."),
    });
  }, [formData.email]);

  // Effect to check overall form validity in real-time to enable/disable the submit button
  useEffect(() => {
    const allPasswordCriteriaMet =
      Object.values(passwordValidation).every(Boolean);
    const allEmailCriteriaMet = Object.values(emailValidation).every(Boolean);

    const isValid =
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      allEmailCriteriaMet &&
      formData.email.trim() !== "" &&
      allPasswordCriteriaMet &&
      formData.password === formData.confirmPassword &&
      Number(formData.age) >= 16 && // Age check
      formData.gender !== "" &&
      agree;

    setIsFormValid(isValid);
  }, [formData, passwordValidation, emailValidation, agree]);

  // Handler to update form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler to track when a user enters a field
  const handleFocus = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Final validation check to generate error messages on submit attempt
  const validateOnSubmit = () => {
    const newErrors = {};
    const allPasswordCriteriaMet =
      Object.values(passwordValidation).every(Boolean);

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailValidation.hasAt || !emailValidation.hasDot) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!allPasswordCriteriaMet) {
      newErrors.password = "Please meet all password requirements.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.age) {
      newErrors.age = "Age is required.";
    } else if (Number(formData.age) < 13) {
      // New age validation message
      newErrors.age = "You must be at least 13 years old to register.";
    }
    if (!formData.gender) newErrors.gender = "Please select your gender.";
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
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
      age: true,
      gender: true,
      agree: true,
    });

    if (!validateOnSubmit()) return;

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            age: formData.age,
            gender: formData.gender,
          },
        },
      });

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (userId) {
        await insertUserData(userId, formData.email, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          age: formData.age,
          gender: formData.gender,
        });
      }

      await supabase.auth.signOut();
      alert(
        "Registration successful! Please check your email to verify your account, then you can log in."
      );
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: error.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
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
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-4">
      <div
        className="flex flex-col md:flex-row bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        style={{ maxWidth: "1150px", width: "100%" }}
      >
        {/* Left side - Registration form */}
        <div
          className="p-10 md:w-1/2 w-full overflow-y-auto"
          style={{ maxHeight: "95vh" }}
        >
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
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`w-full p-2.5 border rounded bg-gray-700 text-white text-sm ${
                    touched.firstName && errors.firstName
                      ? "border-red-500"
                      : "border-gray-600"
                  }`}
                />
                {touched.firstName && errors.firstName && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="w-full sm:w-1/2">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`w-full p-2.5 border rounded bg-gray-700 text-white text-sm ${
                    touched.lastName && errors.lastName
                      ? "border-red-500"
                      : "border-gray-600"
                  }`}
                />
                {touched.lastName && errors.lastName && (
                  <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                onFocus={handleFocus}
                className={`p-2.5 border rounded bg-gray-700 text-white text-sm w-full ${
                  touched.email && errors.email
                    ? "border-red-500"
                    : "border-gray-600"
                }`}
              />
              {touched.email && (
                <div className="mt-2 space-y-1">
                  <ValidationCriterion
                    isValid={emailValidation.hasAt}
                    text="Contains an @ symbol"
                  />
                  <ValidationCriterion
                    isValid={emailValidation.hasDot}
                    text="Contains a period (.)"
                  />
                </div>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onFocus={handleFocus}
                className={`p-2.5 border rounded bg-gray-700 text-white text-sm w-full ${
                  touched.password && errors.password
                    ? "border-red-500"
                    : "border-gray-600"
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-300 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {touched.password && (
              <div className="space-y-1 pl-1">
                <ValidationCriterion
                  isValid={passwordValidation.minLength}
                  text="At least 8 characters"
                />
                <ValidationCriterion
                  isValid={passwordValidation.hasUpper}
                  text="Contains an uppercase letter"
                />
                <ValidationCriterion
                  isValid={passwordValidation.hasLower}
                  text="Contains a lowercase letter"
                />
                <ValidationCriterion
                  isValid={passwordValidation.hasNumber}
                  text="Contains a number"
                />
                <ValidationCriterion
                  isValid={passwordValidation.hasSymbol}
                  text="Contains a symbol (e.g. !@#$)"
                />
              </div>
            )}

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={handleFocus}
                className={`p-2.5 border rounded bg-gray-700 text-white text-sm w-full ${
                  touched.confirmPassword && errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-600"
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-300 hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {touched.confirmPassword && errors.confirmPassword && (
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
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`w-full p-2.5 border rounded bg-gray-700 text-white text-sm ${
                    touched.age && errors.age
                      ? "border-red-500"
                      : "border-gray-600"
                  }`}
                />
                {touched.age && errors.age && (
                  <p className="text-red-400 text-xs mt-1">{errors.age}</p>
                )}
              </div>
              <div className="w-full sm:w-1/2">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`w-full p-2.5 border rounded bg-gray-700 text-white text-sm ${
                    touched.gender && errors.gender
                      ? "border-red-500"
                      : "border-gray-600"
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {touched.gender && errors.gender && (
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
                  onFocus={() =>
                    setTouched((prev) => ({ ...prev, agree: true }))
                  }
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
              {touched.agree && errors.agree && (
                <p className="text-red-400 text-xs mt-1">{errors.agree}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`p-2.5 rounded text-base font-medium mt-2 transition-colors ${
                isFormValid && !loading
                  ? "bg-cyan-900 hover:bg-cyan-800"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
              disabled={!isFormValid || loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
            {errors.general && (
              <p className="text-red-400 text-sm mt-2 text-center">
                {errors.general}
              </p>
            )}
          </form>
        </div>

        {/* Right side - Slideshow */}
        <div
          className="hidden md:block md:w-1/2 relative"
          style={{ minHeight: "400px" }}
        >
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
