import React ,{useState,useEffect}from "react";
import logo from "../assets/images/logo.png";
import Header from "../components/Header";
import { ReactComponent as SigUpLogo } from "../assets/signUp.svg";
import authProviderApi from "../apis/auth-provider.api";
import { toast } from "react-toastify";


// Debounce function to control API call frequency
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const ServiceSignUp = () => {

  const [email,setEmail]=useState();
  const [username,setUserName]=useState();
  const [password,setPassword] = useState();


  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

  // Debounce the username input to avoid excessive API calls
  const debouncedUsername = useDebounce(username, 100);

  // Check username availability whenever debounced username changes
  useEffect(() => {
    if (debouncedUsername && username) {
      authProviderApi.handleUserName({
        payload: { username: debouncedUsername },
        success: (res) => {
          console.log(res)
          setIsUsernameAvailable(res.data.isAvailable);
          if (!res.data.isAvailable) {
            toast.error("Username is already taken", {
              position: "top-center",
              autoClose: 2000,
            });
          }
        },
        error: (err) => {
    
          toast.error(err.response.data.message, {
            position: "top-center",
            autoClose: 2000,
          });
        },
      });
    }
  }, [debouncedUsername]);

  const handleGoogleLogin = () => {


    const popupWidth = 500;
    const popupHeight = 600;
    const left = window.screen.width / 2 - popupWidth / 2;
    const top = window.screen.height / 2 - popupHeight / 2;
  
  

    const popup = window.open(
      `${process.env.REACT_APP_BACKEND}/auth/provider/google`,
      'GoogleLoginPopup',
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left},resizable,scrollbars`
    );
  
    if (!popup) {
      alert('Please allow popups for this website');
      return;
    }
  
    window.addEventListener('message', (event) => {

      if (event.origin === "http://localhost:3000") {
        const { token } = event.data;
        if (token) {
          window.location.href = '/dashboard';
          localStorage.setItem('authToken', token);
          
        }
      }
    });

    window.addEventListener('message', (event) => {
      if (event.origin === 'http://localhost:3000') {
        console.log('Valid message received:', event.data);
        const { provider } = event.data;
        if (provider) {
         // localStorage.setItem('authToken', provider);
          window.location.href = '/proDashboard';
        }
      } else {
        console.warn('Message from unauthorized origin:', event.origin);
      }
    });
    

  };

  const handleSubmit=(e)=>{
    e.preventDefault();

    let hasError = false;

    if (!email) {
      toast.error("Email is required", {
        position: "top-center",
        autoClose: 2000,
      });
      hasError = true;
    }
    
    if (!username) {
      toast.error("Username is required", {
        position: "top-center",
        autoClose: 2000,
      });
      hasError = true;
    }

    if (isUsernameAvailable === false) {
      toast.error("Please choose a different username", {
        position: "top-center",
        autoClose: 2000,
      });
      hasError = true;
    }

    if (!password) {
      toast.error("Password is required", {
        position: "top-center",
        autoClose: 2000,
      });
      hasError = true;
    }

    if (hasError) return;

    authProviderApi.handleRegister({
      payload:{
        username,
        email,
        password
      },
      success:(res)=>{
        toast.success("SuccessFully Registered", {
          position: "top-center",
          autoClose: 2000,
        });
      },
      error:(err)=>{
        console.log(err)
        toast.error(err.response.data.message, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    })
  }
  
  return (
    <div>
      <Header isScrolled={true} />
      <div class="min-h-screen bg-gray-100 text-gray-900 flex justify-center mt-[80px]">
        <div class="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div class="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div>
              <img src={logo} class="w-10 mx-auto" />
            </div>
            <div class="mt-12 flex flex-col items-center">
              <h1 class="text-2xl xl:text-3xl font-extrabold">Sign up as Service Provider</h1>
              <div class="w-full flex-1 mt-8">
                <div class="flex flex-col items-center">
                  <button class="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline" onClick={handleGoogleLogin}>
                    <div class="bg-white p-2 rounded-full">
                      <svg class="w-4" viewBox="0 0 533.5 544.3">
                        <path
                          d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                          fill="#4285f4"
                        />
                        <path
                          d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                          fill="#34a853"
                        />
                        <path
                          d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                          fill="#fbbc04"
                        />
                        <path
                          d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                          fill="#ea4335"
                        />
                      </svg>
                    </div>
                    <span class="ml-4">Sign Up with Google</span>
                  </button>
                </div>

                <div class="my-12 border-b text-center">
                  <div class="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Or sign up with e-mail
                  </div>
                </div>

                <div class="mx-auto max-w-xs">

                  <input
                    class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                  />
                  <input
                    class="w-full mt-5 px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="username"
                    placeholder="User Name"
                    value={username}
                    onChange={(e)=>setUserName(e.target.value)}
                  />
                  <input
                    class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                  <button class="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none" onClick={handleSubmit}>
                    <svg
                      class="w-6 h-6 -ml-2"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                    <span class="ml-3">Sign Up</span>
                  </button>
                  <p class="mt-6 text-xs text-gray-600 text-center">
                    I agree to abide by SkillCircle's{" "}
                    <a href="#" class="border-b border-gray-500 border-dotted">
                      Terms of Service
                    </a>{" "}
                    and its{" "}
                    <a href="#" class="border-b border-gray-500 border-dotted">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div class="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat">
              <SigUpLogo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSignUp;
