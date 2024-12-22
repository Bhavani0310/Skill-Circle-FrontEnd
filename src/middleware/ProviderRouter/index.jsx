import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate, Outlet, Navigate } from "react-router-dom";
import currentUserState from "../../store/user.store";
import Loader from "../../components/Loader/Loader";
import authProviderApi from "../../apis/auth-provider.api";

export default function ProviderRouter() {
  const navigate = useNavigate();

  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLoggedInUser, setCurrentLoggedInUser] =
    useRecoilState(currentUserState);

  const checkUserSession = () => {
    authProviderApi.verifySession({
      success: ({ data }) => {
        const userData = {
          isLoggedIn: true,
          Id: data.data.userId,
          name: data.data.username,
          address:data.data.address,
          email: data.data.email,
          mobile: data.data.mobile,
          isEmailVerified:data.data.isEmailVerified,
          isOnBoardingCompleted:data.data.isOnBoardingCompleted,
          userType: data.data.userType,
          profilePicture:data.data.profilePhoto
        };

        if(data.data.userType==="Customer"){
            navigate("/");
        }
        setCurrentLoggedInUser(userData);
      },
      error: () => {
        navigate("/");
      },
      final: () => {
        setIsLoaded(true);
      },
    });
  };

  useEffect(() => {
    checkUserSession();
  }, [navigate]);

  return (
    <>
      {isLoaded ? (
        currentLoggedInUser.isLoggedIn ? (
          <Outlet />
        ) : (
          <Navigate to="/" />
        )
      ) : (
        <Loader />
      )}
    </>
  );
}
