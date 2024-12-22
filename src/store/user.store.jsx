import { atom } from "recoil";

const userState = atom({
  key: "UserState",
  default: {
    isLoggedIn: false,
    userType: "", 
    Id: "",
    name: "",
    address:"",
    profilePicture: "",
    username: "",
    email: "",
    mobile:"",
    onBoarding:false,
    isActive: false,
  },
});

export default userState;
