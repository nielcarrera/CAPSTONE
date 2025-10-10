import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import google from "../assets/google.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import reg1 from "../assets/home2.avif";
import reg2 from "../assets/home3.webp";
import reg3 from "../assets/home4.webp";
import logo from "../assets/logo.webp";
import { supabase } from "../lib/supabaseClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const goToRegister = () => navigate("/register");

  const insertUserDataIfMissing = async (userId, userEmail) => {
    // Check if user exists in our custom tables
    const { data: existingUser, error: fetchError } = await supabase
      .from("user") // ✅ correct table name
      .select("id")
      .eq("id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is the code for no rows found
      throw fetchError;
    }

    if (!existingUser) {
      // Get user metadata from auth
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userPayload = {
        id: userId,
        email: userEmail,
        first_name: user.user_metadata?.first_name || "",
        last_name: user.user_metadata?.last_name || "",
        age: Number(user.user_metadata?.age) || null,
        gender: user.user_metadata?.gender || "",
        created_at: new Date().toISOString(),
      };

      // Insert into users table
      // Insert into user table
      const { error: userError } = await supabase
        .from("user") // ✅ correct table
        .insert([userPayload]);

      if (userError) throw userError;

      // Insert into user_details table
      const { error: detailsError } = await supabase
        .from("user_details")
        .insert([userPayload]);

      if (detailsError) throw detailsError;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sign in with Supabase Auth
      const {
        data: { session },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Email not confirmed") {
          toast.error("Please confirm your email address before logging in.", {
            position: "top-center",
            autoClose: 3000,
          });
        } else {
          throw error;
        }
        return;
      }

      if (!session) {
        console.error("No session found after login.");
        return;
      }

      // Ensure user data exists in our custom tables
      await insertUserDataIfMissing(session.user.id, email);

      localStorage.setItem("userEmail", email);

      // Check if user has seen intro (you might want to adjust this logic)
      const { data: userData, error: userError } = await supabase
        .from("user")
        .select("first_time")
        .eq("id", session.user.id)
        .single();

      if (userError) throw userError;

      if (userData?.first_time) {
        // Update first_time to false
        await supabase
          .from("user")
          .update({ first_time: false })
          .eq("id", session.user.id);

        navigate("/intro");
      } else {
        navigate("/lp");
      }

      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.message || "Something went wrong. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  const signUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-4 ">
        <ToastContainer />
        <div
          className="flex flex-col md:flex-row bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          style={{ maxWidth: "1000px", width: "100%" }}
        >
          <div className="p-10 md:w-1/2 w-full">
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
              </div>
              <button
                type="submit"
                className="bg-cyan-900 hover:bg-cyan-800 p-2.5 rounded text-base font-medium"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm"></div>
              </div>
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
  } else {
    return null;
  }
};

export default Login;
