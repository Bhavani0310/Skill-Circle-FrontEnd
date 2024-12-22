import ServiceProviderOnboarding from "../pages/ServiceProviderOnboarding";
import DashboardProvider from "../pages/DashBoardProvider";

const providerRoutes = [
    {name: "DashBoard" , path:"/proDashboard",element:<DashboardProvider/>},
    {name:"OnBoarding",path:"/onBoarding",element:<ServiceProviderOnboarding/>}
];

export default providerRoutes;