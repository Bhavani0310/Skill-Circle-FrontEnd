import React, { useState, useEffect } from "react";
import { BiUser, BiBookmark, BiStar, BiEdit, BiSave } from "react-icons/bi";
import { RiMenu3Line } from "react-icons/ri";
import {
  FiSearch,
  FiBell,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Header from "../components/Header";
import authApi from "../apis/auth.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import profile from "../assets/images/user.png";
import dashBoardApi from "../apis/dashboard.api";
import authProviderApi from "../apis/auth-provider.api";

async function getAddressFromCoordinates(latitude, longitude) {
  const apiKey = "3c67ac197999db273bdf7e9518a56bea"; // Replace with your Mappls API key

  const url = `https://apis.mapmyindia.com/advancedmaps/v1/${apiKey}/rev_geocode?lat=${latitude}&lng=${longitude}`;

  try {
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results[0]) {
      console.log("Address Details:", data.results[0]);
      return data.results[0];
    } else {
      console.log("No address found for the given coordinates.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching address:", error);
  }
}

function getUserLocation() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => reject(error),
        { enableHighAccuracy: true }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}

const DashboardProvider = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    location: "Mumbai, India",
    mobile: "",
    password: "*********",
  });
  const [add, setAddress] = useState();
  const [profilePicture, setProfilePicture] = useState(profile);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const [newProfile, setNewProfile] = useState();
  const handleProfileUpdate = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
const navigate=useNavigate()
  const navItems = [
    { id: "profile", icon: BiUser, label: "Profile" },
    { id: "bookings", icon: BiBookmark, label: "Bookings" },
    { id: "settings", icon: FiSettings, label: "Settings" },
  ];
  async function fetchUserAddress() {
    try {
      const { latitude, longitude } = await getUserLocation();
      const address = await getAddressFromCoordinates(latitude, longitude);
      if (address) {
        setProfileData((prev) => ({
          ...prev,
          location: address.formatted_address,
          address: `${address.houseName}${" "}${address.street}`,
          state: address.state,
          country: address.area,
          zipCode: address.pincode,
          lat: address.lat,
          lng: address.lng,
        }));

        setAddress(address);
      }
      if (address) {
        console.log("User Address:", address);
      } else {
        console.log("Unable to retrieve the user's address.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    fetchUserAddress();

    authProviderApi.verifySession({
      success: ({ data }) => {
       
        if(!data.data.isOnboardingCompleted){
            navigate("/onBoarding")
        }
        setProfileData((prev) => ({
          ...prev,
          name: data.data?.username,
          email: data.data?.email,
          address: data.data?.address ?? " ",
          mobile: data.data?.mobile ?? " ",
          state: data.data?.state ?? " ",
          country: data.data?.country ?? "",
          zipCode: data.data?.pinCode ?? "",
        }));

        setProfilePicture(data?.data?.profilePhoto);
      },
      error: (err) => {
        toast.error("Error in server", {
          position: "top-center",
          autoClose: 2000,
        });
      },
    });

   
  }, []);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicture(event.target.result); // Update the profile picture with the new image URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const handleSave = () => {
    if (isEditing) {
      const formData = new FormData();

      if (newProfile) {
        formData.append("profilePhoto", newProfile);
      }
      const appendIfValid = (key, value) => {
        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, value);
        }
      };

      // Append each field only if it's valid
      appendIfValid("email", profileData.email);
      appendIfValid("username", profileData.name);
      appendIfValid("address", profileData?.address);
      appendIfValid("state", profileData?.state);
      appendIfValid("country", profileData?.country);
      appendIfValid("pinCode", profileData?.zipCode);
      appendIfValid("longitude", profileData?.lng);
      appendIfValid("latitude", profileData?.lat);
      appendIfValid("mobile", profileData?.mobile);

      dashBoardApi.updateCustomerProfile({
        payload: formData,
        success: (res) => {
          toast.success("Profile updated SuccessFully", {
            position: "top-center",
            autoClose: 2000,
          });
          setIsEditing(!isEditing);
        },
        error: (err) => {
          toast.error("Error in server", {
            position: "top-center",
            autoClose: 2000,
          });
          setIsEditing(!isEditing);
        },
      });
    } else {
      return;
    }
  };
  const ProfileContent = () => (
    <div className="p-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-24 h-24 overflow-hidden rounded-full relative group">
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <>
                  {/* Overlay with edit button */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="text-white p-2 rounded-full hover:bg-gray-700"
                      onClick={() =>
                        document.getElementById("profilePictureInput").click()
                      } // Trigger file input click
                    >
                      <BiEdit className="text-xl" />
                    </button>
                  </div>
                  {/* Hidden file input */}
                  <input
                    type="file"
                    id="profilePictureInput"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleProfilePictureChange(e)}
                  />
                </>
              )}
            </div>

            <div className="ml-4 mt-4 md:mt-0 text-center md:text-left">
              {isEditing ? (
                <input
                  type="text"
                  defaultValue={profileData.name}
                  readOnly
                  className="text-xl font-bold text-gray-800 border-b-2 border-blue-500 focus:outline-none"
                />
              ) : (
                <h3 className="text-xl font-bold text-gray-800">
                  {profileData.name}
                </h3>
              )}
              {isEditing ? (
                <input
                  type="email"
                  defaultValue={profileData.email}
                  className="text-gray-600 border-b-2 w-56 border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-gray-600">{profileData.email}</p>
              )}
            </div>
          </div>

          {isEditing ? (
            <button
              onClick={handleSave}
              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2 mt-4 md:mt-0"
            >
              <BiSave className="text-xl" />
              <span>{isEditing ? "Save" : "Edit Profile"}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2 mt-4 md:mt-0"
            >
              <BiEdit className="text-xl" />
              <span>{isEditing ? "Save" : "Edit Profile"}</span>
            </button>
          )}
        </div>
        <div className="space-y-4">
          {/* Address Field */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="text-gray-700">Address</span>
            {isEditing ? (
              <input
                type="text"
                value={profileData.address}
                onChange={(e) => handleProfileUpdate("address", e.target.value)}
                className="text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent"
              />
            ) : (
              <span className="text-gray-900">{profileData.address}</span>
            )}
          </div>

          {/* State Field */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="text-gray-700">State</span>
            {isEditing ? (
              <input
                type="text"
                value={profileData.state}
                onChange={(e) => handleProfileUpdate("state", e.target.value)}
                className="text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent"
              />
            ) : (
              <span className="text-gray-900">{profileData.state}</span>
            )}
          </div>

          {/* Country Field */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="text-gray-700">Country</span>
            {isEditing ? (
              <input
                type="text"
                value={profileData.country}
                onChange={(e) => handleProfileUpdate("country", e.target.value)}
                className="text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent"
              />
            ) : (
              <span className="text-gray-900">{profileData.country}</span>
            )}
          </div>

          {/* Pin Code Field */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="text-gray-700">Pin Code</span>
            {isEditing ? (
              <input
                type="text"
                value={profileData.zipCode}
                onChange={(e) => handleProfileUpdate("zipCode", e.target.value)}
                className="text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent"
              />
            ) : (
              <span className="text-gray-900">{profileData.zipCode}</span>
            )}
          </div>

          {/* Phone Field */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="text-gray-700">Phone</span>
            {isEditing ? (
              <input
                type="text"
                value={profileData.mobile}
                onChange={(e) => handleProfileUpdate("mobile", e.target.value)}
                className="text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent"
              />
            ) : (
              <span className="text-gray-900">{profileData.mobile}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const BookingsContent = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterDate, setFilterDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const bookings = [
      {
        id: 1,
        serviceProvider: "John Doe",
        service: "Math Tutoring",
        date: "2024-02-15",
        status: "Confirmed",
        price: "₹999/hr",
        rating: 4.8,
        expertise: "Advanced Mathematics",
      },
      {
        id: 2,
        serviceProvider: "Jane Smith",
        service: "Physics Tutoring",
        date: "2024-03-01",
        status: "Pending",
        price: "₹899/hr",
        rating: 4.5,
        expertise: "Quantum Physics",
      },
      {
        id: 3,
        serviceProvider: "Mike Johnson",
        service: "Chemistry Tutoring",
        date: "2024-03-15",
        status: "Completed",
        price: "₹799/hr",
        rating: 4.7,
        expertise: "Organic Chemistry",
      },
      {
        id: 4,
        serviceProvider: "John Doe",
        service: "Math Tutoring",
        date: "2024-02-15",
        status: "Confirmed",
        price: "₹999/hr",
        rating: 4.8,
        expertise: "Advanced Mathematics",
      },
      {
        id: 5,
        serviceProvider: "Jane Smith",
        service: "Physics Tutoring",
        date: "2024-03-01",
        status: "Pending",
        price: "₹899/hr",
        rating: 4.5,
        expertise: "Quantum Physics",
      },
      {
        id: 6,
        serviceProvider: "Mike Johnson",
        service: "Chemistry Tutoring",
        date: "2024-03-15",
        status: "Completed",
        price: "₹799/hr",
        rating: 4.7,
        expertise: "Organic Chemistry",
      },
      {
        id: 7,
        serviceProvider: "John Doe",
        service: "Math Tutoring",
        date: "2024-02-15",
        status: "Confirmed",
        price: "₹999/hr",
        rating: 4.8,
        expertise: "Advanced Mathematics",
      },
      {
        id: 8,
        serviceProvider: "Jane Smith",
        service: "Physics Tutoring",
        date: "2024-03-01",
        status: "Pending",
        price: "₹899/hr",
        rating: 4.5,
        expertise: "Quantum Physics",
      },
      {
        id: 9,
        serviceProvider: "Mike Johnson",
        service: "Chemistry Tutoring",
        date: "2024-03-15",
        status: "Completed",
        price: "₹799/hr",
        rating: 4.7,
        expertise: "Organic Chemistry",
      },
    ];

    const filteredBookings = bookings.filter(
      (booking) =>
        (booking.serviceProvider
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
          booking.service.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterStatus === "all" || booking.status === filterStatus) &&
        (!filterDate || booking.date === filterDate)
    );

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBookings.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <input
                type="text"
                placeholder="Search by provider or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border rounded-md w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 border rounded-md w-full md:w-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="p-2 border rounded-md w-full md:w-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          {currentItems.map((booking) => (
            <div
              key={booking.id}
              className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="space-y-2 text-center md:text-left mb-4 md:mb-0">
                  <h3 className="font-semibold text-gray-800">
                    {booking.serviceProvider}
                  </h3>
                  <p className="text-sm text-gray-600">{booking.service}</p>
                  <p className="text-sm text-gray-600">
                    Expertise: {booking.expertise}
                  </p>
                  <p className="text-sm text-gray-600">Date: {booking.date}</p>
                  <div className="flex items-center gap-1 justify-center md:justify-start">
                    <span className="text-sm font-medium text-gray-700">
                      {booking.rating}
                    </span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <BiStar
                          key={i}
                          className={`text-lg ${
                            i < Math.floor(booking.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {booking.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                <FiChevronLeft />
                Previous
              </button>
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`w-8 h-8 rounded-full ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
                <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const SettingsContent = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md min-w-[600px] min-h-[300px]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Account Settings
        </h2>
        <form>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                readOnly
                defaultValue={profileData.name}
                className="w-1/2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                defaultValue={profileData.email}
                readOnly
                className="w-1/2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                defaultValue={profileData.password}
                className="w-1/2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                autoComplete="new-password"
                className="w-1/2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                autoComplete="new-password"
                className="w-1/2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="w-30 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileContent />;
      case "bookings":
        return <BookingsContent />;
      case "settings":
        return <SettingsContent />;
      default:
        return <ProfileContent />;
    }
  };

  return (
    <>
      <Header isScrolled={true} />
      <div className="flex mt-[90px]">
        {/* Sidebar Navigation */}
        <nav
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } md:block w-full md:w-64 bg-white shadow-lg md:min-h-[calc(100vh-88px)] transition-all duration-300 md:sticky md:top-[88px]`}
        >
          <div className="md:hidden flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-gray-800">Menu</h2>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <RiMenu3Line className="text-xl text-gray-600" />
            </button>
          </div>
          <ul className="flex md:flex-col md:space-y-2 overflow-x-auto md:overflow-visible p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id} className="flex-shrink-0 w-full">
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
                      activeTab === item.id
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="text-xl" />
                    <span className="ml-3">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 px-4">{renderContent()}</main>
      </div>
    </>
  );
};

export default DashboardProvider;
