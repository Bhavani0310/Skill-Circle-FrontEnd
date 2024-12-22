import React, { useState, useEffect } from "react";
import {
  FaSpinner,
  FaStar,
  FaTimes,
  FaUser,
  FaShoppingCart,
  FaHome,
  FaGraduationCap,
  FaPaw,
  FaCalendarAlt,
  FaHeartbeat,
  FaLaptop,
  FaUtensils,
  FaCut,
  FaPaintBrush,
  FaShippingFast,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { IoMenuOutline } from "react-icons/io5";
import dashBoardApi from "../apis/dashboard.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProductFilterSidebar = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [topRatedOnly, setTopRatedOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [data, setData] = useState([]);
  const navigate=useNavigate()
  const categories = [
    "Home Improvement",
    "Tutoring",
    "Pet Care",
    "Event Planning",
    "Health & Wellness",
    "Technology",
    "Home Cooking",
    "Beauty & Personal Care",
    "Arts & Crafts",
    "Errands & Delivery",
  ];

  const categoryIcons = {
    "Home Improvement": <FaHome />,
    "Tutoring": <FaGraduationCap />,
    "Pet Care": <FaPaw />,
    "Event Planning": <FaCalendarAlt />,
    "Health & Wellness": <FaHeartbeat />,
    "Technology": <FaLaptop />,
    "Home Cooking": <FaUtensils />,
    "Beauty & Personal Care": <FaCut />,
    "Arts & Crafts": <FaPaintBrush />,
    "Errands & Delivery": <FaShippingFast />,
  };

  const AllServices = async () => {
    setLoading(true);
    dashBoardApi.AllServices({
      success: (res) => {
        console.log(res.data.data);
        setData(res.data.data);
        setLoading(false);
      },
      error: (err) => {
        toast.error("Error in Server", {
          position: "top-center",
          autoClose: "2000",
        });
      },
    });
  };

  const flattenedServices = data
    ?.reduce((acc, category) => {
      return [...acc, ...category.services];
    }, [])
    .sort(() => 0.5 - Math.random());

  useEffect(() => {
    AllServices();

    setServices(flattenedServices);
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = flattenedServices.filter((service) =>
      service.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
    setCurrentPage(1);
  };

  const handleFilter = () => {
    setLoading(true);
    setTimeout(() => {
      let filtered = [...flattenedServices];
      if (selectedCategory) {
        filtered = filtered.filter(
          (service) => service.category === selectedCategory
        );
      }
      if (searchTerm) {
        filtered = filtered.filter((service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (topRatedOnly) {
        filtered = filtered.filter((service) => service.rating >= 4.8);
      }
      setServices(filtered);
      setCurrentPage(1);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    handleFilter();
  }, [selectedCategory, topRatedOnly, searchTerm, data]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = services.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(services.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookBtn=(service)=>{
    navigate(`/list?service=${service}`)
  }
  return (
    <>
      <Header isScrolled={true} />
      <div className="min-h-screen bg-white-100 mt-[90px]">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-20 left-4 z-50 p-2 bg-white rounded-md shadow-lg md:hidden"
        >
          {isSidebarOpen ? <FaTimes size={20} /> : <IoMenuOutline size={30} />}
        </button>

        <div
          className={`fixed top left-0 w-64 h-full bg-white shadow-lg p-6 overflow-y-auto z-40 transition-transform duration-300 ease-in-out transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div className="space-y-6 mt-12 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {suggestions.length > 0 && searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {suggestions.map((service) => (
                    <div
                      key={service.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSearchTerm(service.name);
                        setSuggestions([]);
                        setIsSidebarOpen(false);
                      }}
                    >
                      {service.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(
                        category === selectedCategory ? "" : category
                      );
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                      category === selectedCategory
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-lg">{categoryIcons[category]}</span>
                    <span>{category}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setTopRatedOnly(!topRatedOnly);
                setIsSidebarOpen(false);
              }}
              className={`w-full px-4 py-2 rounded-md transition-colors ${
                topRatedOnly
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FaStar
                  className={topRatedOnly ? "text-yellow-300" : "text-gray-400"}
                />
                <span>Top Rated</span>
              </div>
            </button>
          </div>
        </div>

        <div className="ml-0 md:ml-64 p-6 mt-16">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
          ) : data.length > 0 ? (
            currentItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentItems.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
                    >
                      <div className="relative w-full h-48">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          
                        />
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl text-blue-500">
                            {categoryIcons[service.category]}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {service.name}
                          </h3>
                        </div>
                        <p className="text-gray-600">{service.category}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FaStar className="text-yellow-400" />
                            <span className="ml-1 text-gray-700">
                              {service.rating}
                            </span>
                          </div>
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                            onClick={() => handleBookBtn(service.name)}
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center items-center mt-8 space-x-4">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-500 hover:bg-blue-100"
                    }`}
                  >
                    <FaChevronLeft />
                  </button>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className={`w-8 h-8 rounded-full ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "text-blue-500 hover:bg-blue-100"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-500 hover:bg-blue-100"
                    }`}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <ServiceSkeleton key={item} />
                ))}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p className="text-xl">No services found</p>
              <p className="mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
      {/* <Footer/> */}
    </>
  );
};

const ServiceSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform animate-pulse">
      {" "}
      {/* Add animate-pulse for the loading effect */}
      <div className="relative w-full h-48 bg-gray-200"></div>{" "}
      {/* Placeholder for the image */}
      <div className="p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>{" "}
          {/* Placeholder for the category icon */}
          <div className="w-24 h-6 bg-gray-200 rounded-md"></div>{" "}
          {/* Placeholder for the service name */}
        </div>
        <div className="w-16 h-4 bg-gray-200 rounded-md"></div>{" "}
        {/* Placeholder for the category name */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-4 bg-gray-200 rounded-md"></div>{" "}
          {/* Placeholder for the rating */}
          <div className="w-20 h-8 bg-gray-200 rounded-md"></div>{" "}
          {/* Placeholder for the button */}
        </div>
      </div>
    </div>
  );
};

export default ProductFilterSidebar;
