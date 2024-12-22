import React, { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";
import dashBoardApi from "../apis/dashboard.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const ServiceProviderOnboarding = () => {

    const navigate=useNavigate()
  const [formData, setFormData] = useState({
    address: "",
    state: "",
    country: "",
    mobile:"",
    pincode: "",
    minPrice: "",
    maxPrice: "",
    experienceLevel: "",
    serviceCategory: "",
    serviceType: "",
  });

  const [errors, setErrors] = useState({
    address: "",
    state: "",
    country: "",
    pincode: "",
    mobile:"",
    minPrice: "",
    maxPrice: "",
    experienceLevel: "",
    serviceCategory: "",
    serviceType: "",
  });
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const experienceLevels = [
    {
        value:"beginner",
        key:"Beginner (0-2 years)",
    },
    {
        value:"intermediate",
        key:"Intermediate (2-5 years)",
    },
    {
        value:"expert",
        key:"Expert (5+ years)",
    }

  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  useEffect(() => {
    dashBoardApi.services({
      success: ({ data }) => {
        console.log(data.data);
        setCategories(data.data.categories);
        setServices(data.data.services);
      },
      error: (err) => {
        toast.error("Error in server", {
          position: "top-center",
          autoClose: 2000,
        });
      },
    });
  }, []);
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    const fields = [
      { name: "address", label: "Address" },
      { name: "state", label: "State" },
      {name:"mobile",label:"Mobile"},
      { name: "country", label: "Country" },
      { name: "pincode", label: "Pincode" },
      { name: "minPrice", label: "Minimum Price" },
      { name: "experienceLevel", label: "Experience Level" },
      { name: "serviceCategory", label: "Service Category" },
      { name: "serviceType", label: "Service Type" },
    ];

    fields.forEach((field) => {
      if (!formData[field.name].trim()) {
        newErrors[field.name] = `${field.label} field cannot be empty`;
        isValid = false;
      }
    });

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      dashBoardApi.onBoarding({
        payload: {
          services: [
            {
              categoryId: formData.serviceCategory,
              serviceId: formData.serviceType,
              pricingRange: formData.minPrice,
            },
          ],
          mobile:formData.mobile,
          address: formData.address,
          street: formData.street,
          state: formData.state,
          country: formData.country,
          pinCode: formData.pincode,
        },
        success: (res) => {
          toast.success("SuccessFully OnBoarded", {
            position: "top-center",
            autoClose: 2000,
          });
          setIsLoading(false);
          navigate("/proDashboard")
        },
        error: (err) => {
          toast.error("Error in server", {
            position: "top-center",
            autoClose: 2000,
          });
          setIsLoading(false);
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Service Provider Onboarding
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows="3"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.address
                    ? "border-red-500 animate-pulse"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200`}
                value={formData.address}
                onChange={handleInputChange}
                aria-describedby="address-error"
                aria-invalid={!!errors.address}
              />
              {errors.address && (
                <p
                  id="address-error"
                  className="text-red-500 text-sm mt-1 animate-fade-in"
                  role="alert"
                >
                  {errors.address}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.state
                    ? "border-red-500 animate-pulse"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200`}
                value={formData.state}
                onChange={handleInputChange}
              />
              {errors.state && (
                <p
                  className="text-red-500 text-sm mt-1 animate-fade-in"
                  role="alert"
                >
                  {errors.state}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.country
                    ? "border-red-500 animate-pulse"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200`}
                value={formData.country}
                onChange={handleInputChange}
              />
              {errors.country && (
                <p
                  className="text-red-500 text-sm mt-1 animate-fade-in"
                  role="alert"
                >
                  {errors.country}
                </p>
              )}
            </div>

            

            <div className="space-y-2">
              <label
                htmlFor="pincode"
                className="block text-sm font-medium text-gray-700"
              >
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.pincode
                    ? "border-red-500 animate-pulse"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200`}
                value={formData.pincode}
                onChange={handleInputChange}
              />
              {errors.pincode && (
                <p
                  className="text-red-500 text-sm mt-1 animate-fade-in"
                  role="alert"
                >
                  {errors.pincode}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="mobile"
                name="mobile"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.mobile
                    ? "border-red-500 animate-pulse"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200`}
                value={formData.mobile}
                onChange={handleInputChange}
              />
              {errors.mobile && (
                <p
                  className="text-red-500 text-sm mt-1 animate-fade-in"
                  role="alert"
                >
                  {errors.mobile}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label
                htmlFor="minPrice"
                className="block text-sm font-medium text-gray-700"
              >
                Minimum Price (₹)
              </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.minPrice
                    ? "border-red-500 animate-pulse"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200`}
                value={formData.minPrice}
                onChange={handleInputChange}
              />
              {errors.minPrice && (
                <p
                  className="text-red-500 text-sm mt-1 animate-fade-in"
                  role="alert"
                >
                  {errors.minPrice}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="experienceLevel"
                className="block text-sm font-medium text-gray-700"
              >
                Experience Level
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.experienceLevel
                    ? "border-red-500 animate-pulse"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200`}
                value={formData.experienceLevel}
                onChange={handleInputChange}
              >
                <option value="">Select experience level</option>
                {experienceLevels.map((level) => (
                  <option key={level.key} value={level.value}>
                    {level.key}
                  </option>
                ))}
              </select>
              {errors.experienceLevel && (
                <p
                  className="text-red-500 text-sm mt-1 animate-fade-in"
                  role="alert"
                >
                  {errors.experienceLevel}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="serviceCategory"
                className="block text-sm font-medium text-gray-700"
              >
                Service Category
              </label>
              <select
                id="serviceCategory"
                name="serviceCategory"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.serviceCategory
                    ? "border-red-500 animate-pulse"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200`}
                value={formData.serviceCategory}
                onChange={handleInputChange}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {errors.serviceCategory && (
                <p
                  className="text-red-500 text-sm mt-1 animate-fade-in"
                  role="alert"
                >
                  {errors.serviceCategory}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="serviceType"
                className="block text-sm font-medium text-gray-700"
              >
                Service Type
              </label>
              <select
                id="serviceType"
                name="serviceType"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.serviceType
                    ? "border-red-500 animate-pulse"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200`}
                value={formData.serviceType}
                onChange={handleInputChange}
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.serviceId} value={service.serviceId}>
                    {service.serviceName}
                  </option>
                ))}
              </select>
              {errors.serviceType && (
                <p
                  className="text-red-500 text-sm mt-1 animate-fade-in"
                  role="alert"
                >
                  {errors.serviceType}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3 px-6 rounded-lg font-medium text-lg hover:from-orange-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <FiLoader className="animate-spin mr-2" />
                Processing...
              </span>
            ) : (
              "Proceed"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceProviderOnboarding;
