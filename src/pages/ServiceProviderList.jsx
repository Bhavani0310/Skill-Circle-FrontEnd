import React, { useState, useEffect } from "react";
import { FaStar, FaMapMarkerAlt, FaFilter } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Header from "../components/Header";
import profile from "../assets/images/user.png"
import dashBoardApi from "../apis/dashboard.api";
import { toast } from "react-toastify";
const ServiceProviderList = ({ selectedService }) => {

  const urlParams = new URLSearchParams(window.location.search);
    const serviceName = urlParams.get('service');

    
  const [providers, setProviders] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      image:
        "images.unsplash.com/photo-1531891437562-4301cf35b7e4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
      rating: 4.8,
      price: 500,
      distance: 2.5,
      specialty: "Plumbing Services",
      reviews: 156,
      isBlocked: false,
    },
    {
      id: 2,
      name: "Priya Sharma",
      image:
        "images.unsplash.com/photo-1585399000684-d2f72660f092?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
      rating: 4.5,
      price: 450,
      distance: 3.8,
      specialty: "House Cleaning",
      reviews: 98,
      isBlocked: false,
    },
    {
      id: 3,
      name: "Amit Patel",
      image:
        "images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
      rating: 4.9,
      price: 600,
      distance: 1.2,
      specialty: "Electrical Work",
      reviews: 203,
      isBlocked: false,
    },
  ]);

  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: 1000,
    maxDistance: 10,
  });

  const [showFilters, setShowFilters] = useState(true);
  const [filteredProviders, setFilteredProviders] = useState(providers);
  const [showModal, setShowModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [customPrice, setCustomPrice] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerExpired, setTimerExpired] = useState(false);

  useEffect(()=>{
    dashBoardApi.provider({
      service:serviceName,
      success:({data})=>{
        console.log(data.data);
        setProviders(data.data)
      },
      error:(err)=>{
        toast.error("Error in server",{
          position:"top-center",
          autoClose:2000
        })
      }
    })
  },[])
  useEffect(() => {
    const filtered = providers.filter(
      (provider) =>
        provider.maxRating >= filters.minRating &&
        provider.minPrice <= filters.maxPrice
        // provider.distance <= filters.maxDistance
    );

    console.log(providers)
    setFilteredProviders(filtered);
  }, [filters, providers]);

  useEffect(() => {
    let timer;
    if (showTimer && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setTimerExpired(true);
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showTimer, timeLeft]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const handleOpenModal = (provider) => {
    setSelectedProvider(provider);
    setCustomPrice(provider.minPrice);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (!showTimer) {
      setShowModal(false);
      setSelectedProvider(null);
    }
  };

  const handleConfirmRequest = () => {
    if (selectedProvider) {
      setProviders((prevProviders) =>
        prevProviders.map((provider) =>
          provider._id === selectedProvider._id
            ? { ...provider, isBlocked: true }
            : provider
        )
      );
      setShowTimer(true);
      setTimeLeft(120);
      handleCloseModal();

      setTimeout(() => {
        setProviders((prevProviders) =>
          prevProviders.map((provider) =>
            provider._id === selectedProvider._id
              ? { ...provider, isBlocked: false }
              : provider
          )
        );
        setShowTimer(false);
        setTimerExpired(false);
      }, 120000);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <Header isScrolled={true} />
      <div className="min-h-screen bg-gray-100 p-4 mt-[90px]">
        <header className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Service Providers
            </h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="Toggle filters"
            >
              {showFilters ? <IoClose size={20} /> : <FaFilter size={20} />}
              <span>{showFilters ? "Close" : "Filters"}</span>
            </button>
          </div>

          {showFilters && (
            <div
              className="mt-4 p-4 bg-gray-50 rounded-lg"
              role="region"
              aria-label="Filter options"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="minRating"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Minimum Rating
                  </label>
                  <input
                    type="range"
                    id="minRating"
                    name="minRating"
                    min="0"
                    max="5"
                    step="0.1"
                    value={filters.minRating}
                    onChange={handleFilterChange}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">
                    {filters.minRating}
                  </span>
                </div>
                <div>
                  <label
                    htmlFor="maxPrice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Maximum Price (₹)
                  </label>
                  <input
                    type="range"
                    id="maxPrice"
                    name="maxPrice"
                    min="0"
                    max="2000"
                    step="100"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">
                    ₹{filters.maxPrice}
                  </span>
                </div>
                <div>
                  <label
                    htmlFor="maxDistance"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Maximum Distance (km)
                  </label>
                  <input
                    type="range"
                    id="maxDistance"
                    name="maxDistance"
                    min="0"
                    max="20"
                    step="0.5"
                    value={filters.maxDistance}
                    onChange={handleFilterChange}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">
                    {filters.maxDistance} km
                  </span>
                </div>
              </div>
            </div>
          )}
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <article
              key={provider._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
              role="article"
            >
              <div className="flex items-start space-x-4">
                <img
                  loading="lazy"
                  src={profile}
                  alt={`${provider.username}'s profile picture`}
                  className="w-24 h-24 rounded-full object-cover"
                  
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {provider.username}
                  </h2>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center text-yellow-400">
                      <FaStar />
                      <span className="ml-1 text-gray-700">
                        {provider.maxRating}
                      </span>
                    </div>
                    {/* <span className="text-gray-500 text-sm ml-2">
                      ({provider.reviews} reviews)
                    </span> */}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-gray-700 font-medium">
                      ₹{provider.minPrice}/hr
                    </span>
                    {/* <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{provider.distance} km</span>
                    </div> */}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleOpenModal(provider)}
                disabled={provider.isBlocked}
                className={`w-full mt-4 ${
                  provider.isBlocked
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-300 hover:text-black"
                } text-white py-2 rounded-lg transition-colors focus:ring-2 focus:ring-black focus:ring-offset-2 flex items-center justify-center space-x-2`}
                aria-label={`Send request to ${provider.username}`}
              >
                <span>
                  {provider.isBlocked ? "Request Sent" : "Send Request"}
                </span>
              </button>
            </article>
          ))}
        </main>

        {showModal && selectedProvider && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Customize Price
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <IoClose size={24} />
                </button>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Set Your Price (₹/hr)
                </label>
                <input
                  type="range"
                  min={Math.max(0, selectedProvider.minPrice - 200)}
                  max={selectedProvider.minPrice + 200}
                  value={customPrice}
                  onChange={(e) => setCustomPrice(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-600">
                    ₹{Math.max(0, selectedProvider.minPrice - 200)}
                  </span>
                  <span className="text-lg font-semibold text-green-600">
                    ₹{customPrice}
                  </span>
                  <span className="text-sm text-gray-600">
                    ₹{selectedProvider.minPrice + 200}
                  </span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 py-2 px-4 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRequest}
                  className="flex-1 py-2 px-4 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Confirm Request
                </button>
              </div>
            </div>
          </div>
        )}

        {showTimer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md text-center">
              <h3 className="text-2xl font-bold mb-4">
                {timerExpired ? "Time's up!" : "Waiting for service provider"}
              </h3>
              <div className="text-4xl font-bold text-green-600 mb-4">
                {formatTime(timeLeft)}
              </div>
              <p className="text-gray-600">
                {timerExpired
                  ? "The service provider did not respond in time."
                  : "The service provider will accept your request shortly."}
              </p>
              {timerExpired && (
                <button
                  onClick={() => {
                    setShowTimer(false);
                    setTimerExpired(false);
                  }}
                  className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        )}
        <footer className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="text-center text-gray-600">
            <p>© 2024 Service Provider Directory. All rights reserved.</p>
            <div className="mt-2">
              <a href="#" className="text-blue-600 hover:underline mx-2">
                Terms of Service
              </a>
              <a href="#" className="text-blue-600 hover:underline mx-2">
                Privacy Policy
              </a>
              <a href="#" className="text-blue-600 hover:underline mx-2">
                Contact Us
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ServiceProviderList;
