import { lazy } from "react";
import Contact from "../pages/Contact";
import VerifyEmail from "../pages/VerifyEmail";
import Services from "../pages/Services";

import ServiceSignUp from "../pages/ServiceSignUp";
import AuthSuccess from "../components/AuthSuccess";
import AuthProviderSuccess from "../components/AuthProviderSuccess";

const Signup = lazy(() => import("../pages/SignUp"));
const routes = [
  { name: "Register", path: "/signUp", element: <Signup /> },
  { name: "RegisterProvider", path: "/ProviderSignUp", element: <ServiceSignUp/> },
  {name: "Contact" , path:"/contact",element:<Contact/>},
  {name:"VerifyEmail",path:"/verify-email/:verificationToken",element:<VerifyEmail/>},
  {name:"Services", path:"/services",element:<Services/>},
 
  {name:"AuthGoogle",path:"/auth-success",element:<AuthSuccess/>},
  {name:"AuthProvider",path:"/provider-success",element:<AuthProviderSuccess/>}
];

export default routes;
