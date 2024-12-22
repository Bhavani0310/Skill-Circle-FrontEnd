
import ServiceProviderList from "../pages/ServiceProviderList";
import UserDashboard from "../pages/UserDashboard";
const navigationRoutes = [
    {name: "DashBoard" , path:"/dashBoard",element:<UserDashboard/>},
    {name:"List",path:"/list",element:<ServiceProviderList/>},
];

export default navigationRoutes;