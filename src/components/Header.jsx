import { useState } from "react";
import LoginPopup from "./LoginPopup";
import logo from "../assets/images/logo.png";
import { useNavigate ,Link} from "react-router-dom";
import currentUserState from "../store/user.store";
import { useRecoilState } from "recoil";
import ProviderLogin from "./ProviderLogin";
import authApi from "../apis/auth.api";
import { toast } from "react-toastify";
import authProviderApi from "../apis/auth-provider.api";
const Header = ({ isScrolled }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userType, setUserType] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [currentLoggedInUser, setCurrentLoggedInUser] =
  useRecoilState(currentUserState);

  console.log(currentLoggedInUser)
  const navigate = useNavigate();
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const [showPopup, setShowPopup] = useState(false);

  const [providerPopup,setProviderPopup] = useState(false);

  const closePopup = () => setShowPopup(false);

  const ProviderClosePopup = () => setProviderPopup(false);

  const signUpBtn = () => {
    navigate("/signUp");
  };
  const handleProfileBtn=(type)=>{
    if(type=="Customer"){
      navigate("/dashboard")
    }else{
      navigate("/proDashboard")
    }
  }
  const handleLoginSelection = (type) => {
    setUserType(type);
    setShowDropdown(false);
    if(type==='Customer'){
      setShowPopup(true);
    }else{
      setProviderPopup(true);
    }
   
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleLogout = (type) => {
    if(type==="Customer"){
    authApi.handleLogout({
      success:(res)=>{
        toast.success("Logged Out",{
          position:"top-center",
          autoClose:2000
        })
        navigate("/")
      },
      error:(err)=>{

      }
    })
  }else{
    authProviderApi.handleLogout({
      success:(res)=>{
        toast.success("Logged Out",{
          position:"top-center",
          autoClose:2000
        })
        navigate("/")
      },
      error:(err)=>{

      }
    })
  }
    console.log("Logging out...");
    setShowUserDropdown(false);
  };
  
  return (
    <>
      <header
        className={`fixed top-0 left-0 z-10 w-full flex justify-between items-center text-white px-10 py-5 transition-colors duration-300 ${
          isScrolled ? "bg-black text-white" : "bg-transparent text-white"
        }`}
      >
        <div className="flex items-center justify-start">
          <Link to="/">
            <img src={logo} alt="SkillCircle Logo" className="w-10 h-auto" />
          </Link>
        </div>

        {/* Mobile Hamburger Menu */}
        
        <div className="md:hidden flex justify-end">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            {menuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="hidden md:flex items-center">
          <ul className="nav flex justify-center mr-6 text-xl">
            <li className="mx-4">
              <Link to="/" className="font-bold">
                Home
              </Link>
            </li>
            <li className="mx-4">
              <Link to="/services" className="font-bold">
                Services
              </Link>
            </li>
            <li className="mx-4">
              <Link to="/contact" className="font-bold">
                Contact
              </Link>
            </li>
          </ul>
        </div>
{currentLoggedInUser.isLoggedIn ? (
        <div className="flex items-center relative">
         
          <button
            onClick={toggleUserDropdown}
            className="bg-transparent  text-white font-bold py-2 px-4 rounded  relative"
          >
            {currentLoggedInUser?.profilePicture ? 
            <img src={currentLoggedInUser?.profilePicture} loading="lazy" className="w-10 rounded-3xl h-auto"/>
            :(<svg fill="none" viewBox="0 0 15 15" height="2em" width="2em" >
      <path
        fill="currentColor"
        d="M3 13v.5h1V13H3zm8 0v.5h1V13h-1zm-7 0v-.5H3v.5h1zm2.5-3h2V9h-2v1zm4.5 2.5v.5h1v-.5h-1zM8.5 10a2.5 2.5 0 012.5 2.5h1A3.5 3.5 0 008.5 9v1zM4 12.5A2.5 2.5 0 016.5 10V9A3.5 3.5 0 003 12.5h1zM7.5 3A2.5 2.5 0 005 5.5h1A1.5 1.5 0 017.5 4V3zM10 5.5A2.5 2.5 0 007.5 3v1A1.5 1.5 0 019 5.5h1zM7.5 8A2.5 2.5 0 0010 5.5H9A1.5 1.5 0 017.5 7v1zm0-1A1.5 1.5 0 016 5.5H5A2.5 2.5 0 007.5 8V7zm0 7A6.5 6.5 0 011 7.5H0A7.5 7.5 0 007.5 15v-1zM14 7.5A6.5 6.5 0 017.5 14v1A7.5 7.5 0 0015 7.5h-1zM7.5 1A6.5 6.5 0 0114 7.5h1A7.5 7.5 0 007.5 0v1zm0-1A7.5 7.5 0 000 7.5h1A6.5 6.5 0 017.5 1V0z"
      />
    </svg>)}
          </button>

          {/* User dropdown */}
          {showUserDropdown && (
            <div className="absolute top-16 right-0 bg-white rounded-lg shadow-lg p-2 z-20">
              <div className="flex items-center w-full px-4 py-2 text-gray-700">
                <span className="text-sm">{currentLoggedInUser.name}</span>
              </div>
              <button
                onClick={() => handleProfileBtn(currentLoggedInUser.userType)}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200 rounded-md"
              >
                <span className="text-sm">Profile</span>
              </button>
              <button
                onClick={()=>handleLogout(currentLoggedInUser.userType)}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200 rounded-md"
              >
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center relative">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 hidden md:block"
            onClick={signUpBtn}
          >
            Sign Up
          </button>
          <button
            onClick={toggleDropdown}
            className="bg-transparent hover:bg-black text-white font-bold py-2 px-4 rounded border border-white relative hidden md:block"
          >
            Login
          </button>

          {showDropdown && (
            <div className="absolute top-16 right-0 bg-white rounded-lg shadow-lg p-2 z-20">
              <button
                onClick={() => handleLoginSelection("Service Provider")}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200 rounded-md"
              >
                <span className="text-sm">Provider</span>
              </button>
              <button
                onClick={() => handleLoginSelection("Customer")}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200 rounded-md"
              >
                <span className="text-sm">Customer</span>
              </button>
            </div>
          )}
        </div>
      )}
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-black text-white shadow-lg md:hidden">
            <ul className="flex flex-col p-4">
              <li className="py-2">
                <Link to="/" className="block font-bold">
                  Home
                </Link>
              </li>
              <li className="py-2">
                <Link to="/services" className="block font-bold">
                  Services
                </Link>
              </li>
              <li className="py-2">
                <Link to="/contact" className="block font-bold">
                  Contact
                </Link>
              </li>
            </ul>
            <div className="flex flex-col p-4">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2">
                Sign Up
              </button>
              <button
                onClick={toggleDropdown}
                className="bg-transparent hover:bg-gray-700 text-white font-bold py-2 px-4 rounded border border-white"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </header>
      <LoginPopup isOpen={showPopup} onClose={closePopup} userType={userType} />
      <ProviderLogin isOpen={providerPopup} onClose={ProviderClosePopup} userType={userType}/>
    </>
  );
};

export default Header;
