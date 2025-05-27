import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit2, ChevronRight, Check, X, Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { products } from "../Pages/utils/Productdata";
import { mockUser, mockRoutines } from "../Pages/utils/DummyData";

import { supabase } from "../lib/supabaseClient"; // adjust path as needed
import { fetchUserSkinType } from "../service/skintypeService";
import { fetchUserSavedProducts } from "../service/productService"; // import it

const Profile = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(mockUser);

  // Mock data - replace with database integration
  const [routines, setRoutines] = useState(mockRoutines);
  const [userProducts, setUserProducts] = useState([
    products[0], // Salicylic Acid Cleanser
    products[1], // Benzoyl Peroxide Treatment Gel
  ]);

  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  useEffect(() => {
    if (userProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentProductIndex(
        (prevIndex) => (prevIndex + 1) % userProducts.length
      );
    }, 3000); // change every 3 seconds

    return () => clearInterval(interval);
  }, [userProducts]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) throw new Error("No session");

      const userId = session.user.id;

      // Fetch basic profile info (no avatar, height, weight)
      const { data: userDetails, error: userDetailsError } = await supabase
        .from("user_details")
        .select("first_name, last_name, age, gender")
        .eq("id", userId)
        .single();

      if (userDetailsError) throw userDetailsError;

      // Fetch user email
      const { data: userData, error: userError } = await supabase
        .from("user")
        .select("email")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      // Fetch skin type
      const skinTypeData = await fetchUserSkinType(userId);

      // Set profile state with dummy avatar/height/weight
      setProfileData({
        firstName: userDetails.first_name || "",
        lastName: userDetails.last_name || "",
        age: userDetails.age || "",
        gender: userDetails.gender || "",
        avatar: "https://via.placeholder.com/100", // dummy avatar
        height: "Not set", // dummy data
        weight: "Not set", // dummy data
        email: userData.email || "",
        skinType: skinTypeData?.skintype || "Unknown",
      });

      const savedProducts = await fetchUserSavedProducts(userId);
      setUserProducts(savedProducts);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = () => {
    setEditing((prev) => !prev);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, avatar: reader.result }));
        toast.success("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) throw new Error("No session");

      const userId = session.user.id;

      const { error: upsertError } = await supabase
        .from("user_details")
        .upsert({
          id: userId,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          age: profileData.age,
          gender: profileData.gender,
        });

      if (upsertError) throw upsertError;

      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error.message);
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const renderEditableField = (
    label,
    field,
    value,
    type = "text",
    disabled = false
  ) => {
    const unit = field === "height" ? "cm" : field === "weight" ? "kg" : "";

    return (
      <div className="space-y-2">
        <label className="text-sm text-gray-500">{label}</label>
        <div className="p-2 border border-gray-200 rounded-lg bg-gray-50">
          {editing && !disabled ? (
            type === "select" ? (
              <select
                value={value}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="w-full p-2 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-800"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <input
                type={type}
                value={value}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="w-full p-2 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-800"
              />
            )
          ) : (
            <p className="text-gray-800">
              {value} {unit}
            </p>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <Navbar />
        <div className="p-8 lg:ml-64 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />

      <div className="p-4 md:p-8 lg:ml-64 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-8 flex flex-col items-center text-center">
            <div className="relative group mb-4">
              <img
                src={profileData.avatar}
                alt="Profile"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
              />
              {editing && (
                <label className="absolute bottom-0 right-0 bg-cyan-800 p-2 rounded-full cursor-pointer group-hover:bg-cyan-600 transition-colors shadow-lg">
                  <Camera className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            {editing ? (
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mb-2">
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="text-xl md:text-2xl font-bold text-center bg-transparent border-b-2 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className="text-xl md:text-2xl font-bold text-center bg-transparent border-b-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            ) : (
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                {profileData.firstName} {profileData.lastName}
              </h1>
            )}

            <div className="text-center mt-5">
              <span className="px-10 py-2 bg-blue-100 text-cyan-800 rounded-full text-md md:text-base font-bold">
                Skin Type: {profileData.skinType}
              </span>
            </div>

            <button
              onClick={handleEdit}
              className="mt-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Edit2 className="w-5 h-5 text-blue-600" />
            </button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left: Personal Info - Wider column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 h-8/12">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                    Personal Information
                  </h2>
                  {!editing && (
                    <button
                      onClick={handleEdit}
                      className="text-white rounded-lg text-xs md:text-sm bg-cyan-800 px-3 py-1 md:px-4 md:py-2"
                    >
                      Edit Information
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="md:col-span-2">
                    <label className="text-xs md:text-sm text-gray-500">
                      Email
                    </label>
                    <p className="text-gray-800 p-2">{profileData.email}</p>
                  </div>
                  {renderEditableField("Age", "age", profileData.age, "number")}
                  {renderEditableField(
                    "Gender",
                    "gender",
                    profileData.gender,
                    "select"
                  )}
                  {renderEditableField(
                    "Height",
                    "height",
                    profileData.height,
                    "number"
                  )}
                  {renderEditableField(
                    "Weight",
                    "weight",
                    profileData.weight,
                    "number"
                  )}
                </div>
                {editing && (
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setEditing(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 px-4 py-2 bg-cyan-800 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Routines & Products */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Routines Preview */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 h-full">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                    My Routines
                  </h2>
                  <button
                    onClick={() => navigate("/routine")}
                    className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 text-xs md:text-sm"
                  >
                    View all
                    <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
                <div className="space-y-3 md:space-y-4">
                  {routines.map((routine) => (
                    <div
                      key={routine.id}
                      className="flex justify-between items-center p-5 md:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-sm md:text-base text-gray-800">
                          {routine.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500">
                          {routine.time}
                        </p>
                      </div>
                      <span className="text-xs md:text-sm text-gray-600">
                        {routine.steps} steps
                      </span>
                    </div>
                  ))}

                  {/* Add Routine Button if less than 2 */}
                  {routines.length < 2 && (
                    <button
                      onClick={() => navigate("/routine")}
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-500">Add Routine</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Products Preview */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 h-full">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                    My Products
                  </h2>
                  <button
                    onClick={() => navigate("/product")}
                    className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 text-xs md:text-sm"
                  >
                    View all
                    <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {userProducts.length > 0 ? (
                    <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 sm:col-span-2">
                      <img
                        src={userProducts[currentProductIndex].image}
                        alt={userProducts[currentProductIndex].name}
                        className="w-24 h-24 md:w-40 md:h-40 rounded-xl object-cover mb-4"
                      />
                      <h3 className="text-lg font-semibold text-gray-800">
                        {userProducts[currentProductIndex].name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Area: {userProducts[currentProductIndex].area}
                      </p>
                      <p className="text-sm text-cyan-700 font-semibold mt-1">
                        Targets: {userProducts[currentProductIndex].impurity}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center sm:col-span-2">
                      No products saved yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
