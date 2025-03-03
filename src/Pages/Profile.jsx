import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit2, ChevronRight, Check } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import prodimage from "../assets/home4.webp";

const Profile = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Venniel",
    lastName: "Carrera",
    nickname: "DEBI",
    email: "vennielcarrera@gmail.com",
    age: "20",
    gender: "Male",
    height: "175",
    weight: "60",
    skinType: "Combination",
    avatar: "/placeholder.svg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "user_123", // Replace with actual user ID from auth
  });

  // Dummy data for routines and products
  const routines = [
    { id: 1, name: "Morning Routine", time: "7:00 AM", steps: 4 },
    { id: 2, name: "Night Routine", time: "9:00 PM", steps: 5 },
  ];

  const products = [
    {
      id: 1,
      name: "Salicylic Acid Cleanser",
      targetedImpurity: "Blackheads",
      image: [prodimage],
    },
    {
      id: 2,
      name: "Vitamin C Serum",
      targetedImpurity: "Dark spots",
      image: [prodimage],
    },
    {
      id: 3,
      name: "Moisturizing Cream",
      targetedImpurity: "Dryness",
      image: [prodimage],
    },
  ];

  // Handle input changes
  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle edit mode
  const handleEdit = () => {
    setEditing((prev) => !prev);
  };

  // Save profile data (mock API call)
  const handleSave = async () => {
    try {
      // Simulate API call to save data
      console.log("Saving profile data:", profileData);
      // Replace with actual API call
      // await axios.post("/api/profile", profileData);

      // Show success alert
      showSuccessAlert();
      setEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  // Show aesthetic success alert
  const showSuccessAlert = () => {
    const alertDiv = document.createElement("div");
    alertDiv.className =
      "fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in";
    alertDiv.innerHTML = `
      <Check className="w-5 h-5" />
      <span>Changes Successful!</span>
    `;
    document.body.appendChild(alertDiv);

    // Remove the alert after 3 seconds
    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  };

  // Render editable field
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

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <Sidebar />
      <Navbar />
      <div className="p-8 lg:ml-64">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <img
                  src={profileData.avatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <label className="absolute bottom-0 right-0 bg-cyan-800 p-2 rounded-full cursor-pointer group-hover:bg-cyan-600 transition-colors shadow-lg">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                  {editing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-800">
                      {profileData.firstName} {profileData.lastName}
                    </h1>
                  )}
                  <button
                    onClick={handleEdit}
                    className="p-2 rounded-full hover:bg-white/50 transition-colors"
                  >
                    <Edit2 className="w-5 h-5 text-blue-600" />
                  </button>
                </div>
                {editing ? (
                  <input
                    type="text"
                    value={profileData.nickname}
                    onChange={(e) =>
                      handleInputChange("nickname", e.target.value)
                    }
                    className="text-gray-500 mb-4 bg-transparent border-b focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-500 mb-4">@{profileData.nickname}</p>
                )}
                <div className="inline-flex gap-2">
                  <p className="text-gray-600">
                    Skintype:{" "}
                    {editing ? (
                      <select
                        value={profileData.skinType}
                        onChange={(e) =>
                          handleInputChange("skinType", e.target.value)
                        }
                        className="px-3 py-1 bg-white text-blue-600 rounded-full text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Combination">Combination</option>
                        <option value="Dry">Dry</option>
                        <option value="Oily">Oily</option>
                        <option value="Normal">Normal</option>
                      </select>
                    ) : (
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                        {profileData.skinType}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Personal Information */}
            <div className="bg-gray-300 rounded-2xl shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Personal Information
                </h2>
                {!editing && (
                  <button
                    onClick={handleEdit}
                    className="text-white rounded-lg hover:text-cyan-600 transition-colors text-sm bg-cyan-800 px-4 py-2"
                  >
                    Edit Information
                  </button>
                )}
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-gray-500">Email</label>
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
                <button
                  onClick={handleSave}
                  className="w-full mt-6 px-4 py-2 bg-cyan-800 text-white rounded-lg hover:bg-cyan-900 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Save Changes
                </button>
              )}
            </div>

            {/* Skincare Overview */}
            <div className="space-y-8">
              {/* Routines Preview */}
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    My Routines
                  </h2>
                  <button
                    onClick={() => navigate("/routine")}
                    className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2 text-sm"
                  >
                    View all
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {routines.map((routine) => (
                    <div
                      key={routine.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border-1 shadow-gray-800 shadow-sm hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {routine.name}
                        </h3>
                        <p className="text-sm text-gray-500">{routine.time}</p>
                      </div>
                      <span className="text-sm text-gray-600">
                        {routine.steps} steps
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Products Preview */}
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    My Products
                  </h2>
                  <button
                    onClick={() => navigate("/products")}
                    className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2 text-sm"
                  >
                    View all
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid gap-4 grid-cols-1">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 border-1 shadow-sm shadow-gray-800 bg-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {product.name}
                        </h3>
                        <p className="text-sm text-blue-600">
                          Targets: {product.targetedImpurity}
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
