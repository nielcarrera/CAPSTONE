import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit2, ChevronRight, Check, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import supabase from "../supabase";
import { products } from "../Pages/utils/Productdata"; // Import products data

const Profile = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: "Venniel",
    lastName: "Carrera",
    nickname: "debi",
    email: "vennielcarrera@gmail.com",
    age: "20",
    gender: "Male",
    skinType: "Oily",
    height: "175",
    weight: "70",
    avatar: "https://via.placeholder.com/150",
  });

  // Dummy data for routines matching the routines page
  const routines = [
    {
      id: 1,
      name: "Morning Routine",
      time: "7:00 AM",
      steps: 4,
      products: [
        "Salicylic Acid Cleanser",
        "Hydrating Toner",
        "Vitamin C Serum",
        "Moisturizing Cream",
      ],
    },
    {
      id: 2,
      name: "Night Routine",
      time: "9:00 PM",
      steps: 5,
      products: [
        "Cleansing Oil",
        "Exfoliating Toner",
        "Retinol Serum",
        "Hydrating Mask",
        "Night Cream",
      ],
    },
  ];

  // Use products from Productdata.js
  const userProducts = [
    products[0], // Salicylic Acid Cleanser
    products[1], // Benzoyl Peroxide Treatment Gel
    products[2], // Hydrating Cream Cleanser
  ];

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real app, you would fetch from Supabase here
      // const { data, error } = await supabase.from('profiles').select('*').single();

      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
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
      // In a real app, upload to Supabase Storage
      // const { data, error } = await supabase.storage
      //   .from('avatars')
      //   .upload(`public/${file.name}`, file);

      // Simulate upload
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
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app:
      // const { error } = await supabase.from('profiles').upsert(profileData);

      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to save profile");
    }
  };

  const renderEditableField = (label, field, value, type = "text") => {
    const unit = field === "height" ? "cm" : field === "weight" ? "kg" : "";
    return (
      <div className="space-y-2">
        <label className="text-sm text-gray-500">{label}</label>
        {editing ? (
          type === "select" ? (
            <select
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-800"
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
              className="w-full p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-800"
            />
          )
        ) : (
          <p className="text-gray-800 p-2">
            {value} {unit}
          </p>
        )}
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

      <div className="p-4 md:p-8 lg:ml-20 mt-20">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6 md:mb-8 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="relative group">
                <img
                  src={profileData.avatar}
                  alt="Profile"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {editing && (
                  <label className="absolute bottom-0 right-0 bg-cyan-800 p-2 rounded-full cursor-pointer group-hover:bg-cyan-600 transition-colors shadow-lg">
                    <Camera className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4 mb-2">
                  {editing ? (
                    <div className="flex flex-col md:flex-row gap-2 w-full">
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="text-xl md:text-2xl font-bold text-gray-800 bg-transparent border-b-2 focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="text-xl md:text-2xl font-bold text-gray-800 bg-transparent border-b-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ) : (
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                      {profileData.firstName} {profileData.lastName}
                    </h1>
                  )}

                  <button
                    onClick={handleEdit}
                    className="p-1 md:p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  </button>
                </div>

                {editing ? (
                  <input
                    type="text"
                    value={profileData.nickname}
                    onChange={(e) =>
                      handleInputChange("nickname", e.target.value)
                    }
                    className="text-gray-500 mb-3 md:mb-4 bg-transparent border-b focus:outline-none focus:border-blue-500 w-full md:w-auto"
                  />
                ) : (
                  <p className="text-gray-500 mb-3 md:mb-4">
                    @{profileData.nickname}
                  </p>
                )}

                <div className="inline-flex gap-2">
                  <p className="text-gray-600">
                    Skintype:{" "}
                    <span className="px-2 md:px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs md:text-sm">
                      {profileData.skinType}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid gap-6 md:gap-8 md:grid-cols-2">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
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

              <div className="space-y-4 md:space-y-6">
                <div>
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

            {/* Skincare Overview */}
            <div className="space-y-6 md:space-y-8 md:ml-20">
              {/* Routines Preview */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
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
                      className="flex justify-between items-center p-5 md:p-4 bg-gray-50 rounded-lg border border-gray-400 hover:bg-gray-100 transition-colors"
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
                </div>
              </div>

              {/* Products Preview */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                    My Products
                  </h2>
                  <button
                    onClick={() => navigate("/products")}
                    className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 text-xs md:text-sm"
                  >
                    View all
                    <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>

                <div className="grid gap-3 md:gap-4">
                  {userProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 md:gap-4 p-5 md:p-4 border border-gray-400 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm md:text-base text-gray-800 truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs md:text-sm text-blue-600 truncate">
                          Targets: {product.impurity}
                        </p>
                      </div>
                    </div>
                  ))}
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
