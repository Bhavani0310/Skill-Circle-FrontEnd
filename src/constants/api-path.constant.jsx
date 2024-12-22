const BASEURL = process.env.REACT_APP_BACKEND;

const setBaseUrlPrefix = (path) => {
  return BASEURL.concat(path);
};

const apiPathConstants = {
  auth: {
    login: setBaseUrlPrefix("/auth/login"),
    logout: setBaseUrlPrefix("/auth/logout"),
    CheckUserName:setBaseUrlPrefix("/auth/checkUserName"),
    register: setBaseUrlPrefix("/auth/register"),
    verifySession: setBaseUrlPrefix("/auth/verify-session"),
    sendVerifyEmail:setBaseUrlPrefix("/auth/send/verification-email"),
    changePassword: setBaseUrlPrefix("/auth/reset-password"),
    forgotPassword: setBaseUrlPrefix("/auth/forgot-password"),
    verificationEmail: setBaseUrlPrefix("/auth/verify-email"),
  },
  authProvider:{
    login: setBaseUrlPrefix("/auth/provider/login"),
    logout: setBaseUrlPrefix("/auth/provider/logout"),
    CheckUserName:setBaseUrlPrefix("/auth/provider/checkUserName"),
    register: setBaseUrlPrefix("/auth/provider/register"),
    verifySession: setBaseUrlPrefix("/auth/provider/verify-session"),
    changePassword: setBaseUrlPrefix("/auth/provider/reset-password"),
    forgotPassword: setBaseUrlPrefix("/auth/provider/forgot-password"),
    verificationEmail: setBaseUrlPrefix("/auth/provider/verify-email/"),
  },
  dashBoardUser:{
    updateProfile:setBaseUrlPrefix("/home/userprofile")
  },
  services:{
    getAllServices:setBaseUrlPrefix("/home/services"),
    onBoarding:setBaseUrlPrefix("/home/onBoarding"),
    allServices:setBaseUrlPrefix("/home/allServices"),
    providerList:setBaseUrlPrefix('/home/providerList')
  }
};

export default apiPathConstants;
