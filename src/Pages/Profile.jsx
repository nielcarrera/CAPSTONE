import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit2, ChevronRight, Check } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import prodimage from "../assets/home4.webp";
import supabase from "../supabase"; // Import Supabase client

const Profile = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Venniel",
    lastName: "Carrera",
    nickname: "debi",
    email: "vennielcarrera@gmail.com",
    age: "20",
    gender: "Male",
    skinType: "Oily", // Dummy data
    avatar: "/placeholder.svg", // Dummy data
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

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Fetch user data based on email stored in localStorage
  const fetchProfileData = async () => {
    const userEmail = localStorage.getItem("userEmail"); // Get the user's email from localStorage
    if (!userEmail) {
      console.error("No user email found in localStorage");
      return;
    }

    console.log("Fetching profile data for email:", userEmail);

    try {
      // Step 1: Ensure the user is authenticated
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser(); // Use `getUser` instead of `getSession` for clarity

      if (authError) {
        throw authError;
      }

      if (!user) {
        console.error("No authenticated user found");
        return;
      }

      const userId = user.id; // Get the user's UUID from the auth response
      console.log("Authenticated user ID:", userId);

      // Step 2: Fetch the profile data from the `userDetails` table using the user's UUID
      const { data: profileData, error: profileError } = await supabase
        .from("userDetails") // Ensure this matches your table name in Supabase
        .select("firstName, lastName, age, gender") // Fetch only necessary fields
        .eq("userId", userId) // Match the user's UUID (foreign key in `userDetails`)
        .single(); // Fetch a single record

      if (profileError) {
        throw profileError;
      }

      console.log("Profile data fetched:", profileData);

      // Step 3: Fetch the height and weight from the `user_statistics` table
      const { data: userStatistics, error: statisticsError } = await supabase
        .from("user_statistics") // Ensure this matches your table name in Supabase
        .select("height, weight") // Fetch height and weight
        .eq("userId", userId) // Match the user's UUID (foreign key in `user_statistics`)
        .single(); // Fetch a single record

      if (statisticsError) {
        throw statisticsError;
      }

      console.log("User statistics fetched:", userStatistics);

      // Step 4: Merge all fetched data into the profileData state
      if (profileData && userStatistics) {
        setProfileData((prev) => ({
          ...prev,
          ...profileData, // firstName, lastName, age, gender
          ...userStatistics, // height, weight
          email: userEmail, // Add the email from the `auth.users` table
        }));
        console.log("Profile data updated in state:", {
          ...profileData,
          ...userStatistics,
          email: userEmail,
        });
      } else {
        console.error("No profile data found for the user");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
      console.error("Supabase error details:", error);
    }
  };
  // Handle input changes
  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  // Toggle edit mode
  const handleEdit = () => {
    setEditing((prev) => !prev);
  };

  // Handle image upload (optional, can be implemented later)
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

  // Save profile data to Supabase
  const handleSave = async () => {
    const userEmail = localStorage.getItem("userEmail"); // Get the user's email from localStorage
    if (!userEmail) {
      console.error("No user email found in localStorage");
      return;
    }

    try {
      // Step 1: Get the authenticated user's ID
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser(); // Fetch the authenticated user

      if (authError) {
        throw authError;
      }

      if (!user) {
        console.error("No authenticated user found");
        return;
      }

      const userId = user.id; // Get the user's UUID

      // Step 2: Update the user's profile data in the `userDetails` table
      const { error } = await supabase
        .from("userDetails") // Ensure this matches your table name in Supabase
        .update({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          nickname: profileData.nickname,
          age: profileData.age,
          gender: profileData.gender,
        })
        .eq("userId", userId); // Use the user's UUID as the foreign key

      if (error) {
        throw error;
      }

      // Step 3: Exit editing mode and show success feedback
      setEditing(false);
      showSuccessAlert(); // Ensure this function displays a success message to the user
      console.log("Profile data updated successfully!");
    } catch (error) {
      console.error("Error updating profile data:", error.message);
      // Show an error message to the user
      toast.error("Failed to update profile. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Show success alert
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
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                      {profileData.skinType}
                    </span>
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
