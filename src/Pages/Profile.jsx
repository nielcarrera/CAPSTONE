import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Edit,
  LogOut,
  ChevronRight,
  Save,
  X,
  User,
  Cake,
  VenetianMask,
  Mail,
  Droplets,
  Package,
  ListChecks,
  Shield,
  Info,
  HelpCircle,
} from "lucide-react";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabaseClient";
import { fetchUserSkinType } from "../service/skintypeService";
import { fetchUserSavedProducts } from "../service/productService";

// Import the modal components
import AboutUsModal from "../components/Profile/Aboutus";
import FaqsModal from "../components/Profile/Faqs";
import TermsAndPolicyModal from "../components/Profile/TermsandCondition";

const mockProducts = [];
const mockRoutines = [];

// --- Reusable Sub-components ---
const StatItem = ({ icon: Icon, value, label }) => (
  <div className="flex flex-col items-center gap-3 text-center p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="p-3 bg-cyan-50 rounded-full">
      <Icon className="w-6 h-6 text-cyan-700" />
    </div>
    <span className="text-2xl font-bold text-gray-900">{value}</span>
    <span className="text-sm text-gray-600 font-medium">{label}</span>
  </div>
);

const InfoField = ({
  icon: Icon,
  label,
  value,
  editing,
  onChange,
  type = "text",
  options = [],
}) => {
  const isSelect = type === "select";
  return (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <Icon className="w-5 h-5 text-cyan-700" />
      </div>
      <div className="flex-1 min-w-0">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {label}
        </label>
        {editing ? (
          isSelect ? (
            <select
              value={value}
              onChange={onChange}
              className="w-full p-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all duration-200"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={value}
              onChange={onChange}
              className="w-full p-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all duration-200"
            />
          )
        ) : (
          <p className="p-3 text-gray-900 bg-white rounded-lg border border-transparent">
            {value || "Not set"}
          </p>
        )}
      </div>
    </div>
  );
};

const SettingsLink = ({ icon: Icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 text-left bg-white rounded-xl border border-gray-200 hover:border-cyan-200 hover:bg-cyan-50 transition-all duration-200 group"
  >
    <div className="p-2 bg-cyan-100 rounded-lg group-hover:bg-cyan-200 transition-colors duration-200">
      <Icon className="w-5 h-5 text-cyan-700" />
    </div>
    <span className="flex-1 font-semibold text-gray-800">{text}</span>
    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-700 transition-colors duration-200" />
  </button>
);

// --- Main Profile Component ---
const Profile = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});
  const [userProducts, setUserProducts] = useState(mockProducts);
  const [routines, setRoutines] = useState(mockRoutines);
  const [originalProfileData, setOriginalProfileData] = useState({});

  // State for modals
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isFaqsModalOpen, setIsFaqsModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError || !session?.user)
          throw new Error("No active session");

        const userId = session.user.id;

        const { data: userDetails, error: detailsError } = await supabase
          .from("user_details")
          .select("first_name, last_name, age, gender")
          .eq("id", userId)
          .single();
        if (detailsError) throw detailsError;

        const skinTypeData = await fetchUserSkinType(userId);
        const savedProducts = await fetchUserSavedProducts(userId);

        const fetchedData = {
          firstName: userDetails.first_name || "",
          lastName: userDetails.last_name || "",
          age: userDetails.age || "",
          gender: userDetails.gender || "Not set",
          email: session.user.email || "",
          avatar:
            session.user.user_metadata.avatar_url ||
            `https://i.pravatar.cc/150?u=${userId}`,
          skinType: skinTypeData?.skintype || "Unknown",
        };

        setProfileData(fetchedData);
        setOriginalProfileData(fetchedData);
        setUserProducts(savedProducts);
      } catch (error) {
        console.error("Error fetching profile:", error.message);
        toast.error("Could not load profile data.");
        setProfileData(mockUser);
        setOriginalProfileData(mockUser);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditToggle = () => {
    if (editing) {
      setProfileData(originalProfileData);
    }
    setEditing(!editing);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const updates = {
        id: user.id,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        age: profileData.age,
        gender: profileData.gender,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("user_details").upsert(updates);
      if (error) throw error;

      setEditing(false);
      setOriginalProfileData(profileData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error.message);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-700"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
        <Sidebar />

        <main className="lg:ml-64 pt-5 pb-8">
          <div className="max-w-6xl mx-auto px-6">
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="relative">
                  <div className="relative">
                    <img
                      src={profileData.avatar}
                      alt="Profile Avatar"
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                    />
                    <button className="absolute bottom-2 right-2 bg-cyan-700 p-3 rounded-xl text-white hover:bg-cyan-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <p className="text-gray-600 text-lg mb-4">
                    {profileData.email}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    <div className="px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full text-sm font-medium">
                      {profileData.skinType || "N/A"} Skin
                    </div>
                    <div className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {userProducts.length} Products
                    </div>
                    <div className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {routines.length} Routines
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleEditToggle}
                    className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-200 ${
                      editing
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
                        : "bg-cyan-700 hover:bg-cyan-800 text-white shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {editing ? (
                      <>
                        <X className="w-4 h-4" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4" />
                        Edit Profile
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-3 text-gray-500 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Skin Profile & Personal Info */}
              <div className="xl:col-span-2 space-y-8">
                {/* Skin Profile Stats */}
                <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <Droplets className="w-6 h-6 text-cyan-700" />
                    </div>
                    Skin Profile Overview
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <StatItem
                      icon={Droplets}
                      value={profileData.skinType || "N/A"}
                      label="Skin Type"
                    />
                    <StatItem
                      icon={Package}
                      value={userProducts.length}
                      label="Saved Products"
                    />
                    <StatItem
                      icon={ListChecks}
                      value={routines.length}
                      label="Active Routines"
                    />
                  </div>
                </section>

                {/* Personal Information */}
                <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <div className="p-2 bg-cyan-100 rounded-lg">
                        <User className="w-6 h-6 text-cyan-700" />
                      </div>
                      Personal Information
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <InfoField
                      icon={User}
                      label="Full Name"
                      value={`${profileData.firstName} ${profileData.lastName}`}
                      editing={editing}
                      onChange={(e) => {
                        const [first, ...last] = e.target.value.split(" ");
                        handleInputChange("firstName", first);
                        handleInputChange("lastName", last.join(" "));
                      }}
                    />
                    <InfoField
                      icon={Cake}
                      label="Age"
                      value={profileData.age}
                      editing={editing}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      type="number"
                    />
                    <InfoField
                      icon={VenetianMask}
                      label="Gender"
                      value={profileData.gender}
                      editing={editing}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      type="select"
                      options={["Male", "Female", "Other", "Prefer not to say"]}
                    />
                    <InfoField
                      icon={Mail}
                      label="Email"
                      value={profileData.email}
                      editing={false}
                    />
                  </div>

                  {editing && (
                    <div className="flex gap-4  pt-8 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setEditing(false);
                          setProfileData(originalProfileData);
                        }}
                        className="flex-1 py-3 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex-1 py-3 px-6 rounded-xl font-semibold text-white bg-cyan-700 hover:bg-cyan-800 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <Save className="w-5 h-5" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </section>
              </div>

              {/* Right Column - Settings & Information */}
              <div className="space-y-8">
                {/* Settings */}
                <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <Shield className="w-5 h-5 text-cyan-700" />
                    </div>
                    Settings
                  </h2>
                  <div className="space-y-3">
                    <SettingsLink
                      icon={Shield}
                      text="Terms & Policy"
                      onClick={() => setIsTermsModalOpen(true)}
                    />
                  </div>
                </section>

                {/* More Information */}
                <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <Info className="w-5 h-5 text-cyan-700" />
                    </div>
                    More Information
                  </h2>
                  <div className="space-y-3">
                    <SettingsLink
                      icon={Info}
                      text="About Us"
                      onClick={() => setIsAboutModalOpen(true)}
                    />
                    <SettingsLink
                      icon={HelpCircle}
                      text="Frequently Asked Questions"
                      onClick={() => setIsFaqsModalOpen(true)}
                    />
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Render Modals */}
      <AboutUsModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
      <FaqsModal
        isOpen={isFaqsModalOpen}
        onClose={() => setIsFaqsModalOpen(false)}
      />
      <TermsAndPolicyModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </>
  );
};

export default Profile;
