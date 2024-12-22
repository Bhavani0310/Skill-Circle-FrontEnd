// Importing constants
import apiPath from "../constants/api-path.constant";

import axios from "../configs/axios-instances";

const authProviderApi = {
  handleLogin: ({ payload, success, error }) => {
    const {
      authProvider: { login },
    } = apiPath;

    axios.postRequest({ path: login, payload, success, error });
  },
  handleUserName: ({ payload, success, error }) => {
    const {
      authProvider: { CheckUserName },
    } = apiPath;

    axios.postRequest({ path: CheckUserName, payload, success, error });
  },
  handleLogout: ({ success, error }) => {
    const {
      authProvider: { logout },
    } = apiPath;
    axios.postRequest({ path: logout, success, error });
  },
  handleRegister: ({ payload, success, error }) => {
    const {
      authProvider: { register },
    } = apiPath;
    axios.postRequest({ path: register, payload, success, error });
  },
  verifySession: ({ payload, success, error, final }) => {
    const {
      authProvider: { verifySession },
    } = apiPath;
    axios.postRequest({ path: verifySession, payload, success, error, final });
  },
  sendVerificationEmail:({payload,success,error,final})=>{
    const {
      authProvider: { sendVerifyEmail },
    } = apiPath;
    axios.postRequest({ path: sendVerifyEmail, payload, success, error, final });
  },
  handleVerificationEmail: ({ payload, verify_token, success, error }) => {
    const {
      authProvider: { verificationEmail },
    } = apiPath;
    const pathWithParams = `${verificationEmail}/${verify_token}`;

    axios.postRequest({
      path: pathWithParams,
      payload,
      success,
      error,
    });
  },
  resetPassword: ({ payload, password_reset_token,success, error }) => {
    const {
      authProvider: { forgotPassword },
    } = apiPath;
    const pathWithParams= `${forgotPassword}/${password_reset_token}`
    axios.postRequest({ path: pathWithParams, payload, success, error });
  },
  changePassword: ({ payload, password_reset_token, success, error }) => {
    const {
      authProvider: { changePassword },
    } = apiPath;
    const pathWithParams = `${changePassword}/${password_reset_token}`;

    axios.postRequest({
      path: pathWithParams,
      payload,
      success,
      error,
    });
  },
};

export default authProviderApi;
