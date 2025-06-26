import axios from "axios";
import { baseUrl, endPoints } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "react-native-snackbar";
import { NativeModules } from "react-native";
import messaging from "@react-native-firebase/messaging";
// import { updateAccessToken, clearTokens } from '../redux/slices/tokenSlice';
import store from "../redux/store";
import { useSelector } from "react-redux";
import {
  clearTokens,
  setTokens,
  updateAccessToken,
} from "../redux/slices/tokenSlice";

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new Error("No refresh token found");
  // console.log("i am refresh==============>>>>>>>>", refreshToken);
  try {
    const response = await axios.post(`${baseUrl}${endPoints.refreshToken}`, {
      refresh: refreshToken,
    });
    // console.log("i am refresh==============>>>>>>>>", response.data);
    const newAccessToken = response?.data?.access;
    store.dispatch(
      setTokens({ access: newAccessToken, refresh: refreshToken })
    );
    await AsyncStorage.setItem("token", newAccessToken);

    return newAccessToken;
  } catch (err) {
    console.warn("🔁 Refresh failed, trying re-login...");

    // Try re-login from stored credentials
    const email = await AsyncStorage.getItem("email");
    const password = await AsyncStorage.getItem("password");

    if (email && password) {
      try {
        const res = await axios.post(`${baseUrl}${endPoints.logIn}`, {
          email,
          password,
        });

        const { access, refresh } = res.data;
        if (access && refresh) {
          // Save tokens
          store.dispatch(setTokens({ access, refresh }));
          await AsyncStorage.multiSet([
            ["token", access],
            ["refresh", refresh],
          ]);

          console.log("🔐 Re-login successful");
          return access;
        }
      } catch (loginError) {
        console.error("⛔ Re-login failed:", loginError);
        store.dispatch(clearTokens());
        await AsyncStorage.clear();
        throw new Error("Re-login failed. Please login manually.");
      }
    }
    store.dispatch(clearTokens());
    await AsyncStorage.clear();
    throw new Error("Session expired. Please log in again.");
  }
};

export const sendFcmtoken = async (data) => {
  console.log("data===========>>>>", data);
  try {
    const jwtToken = data.accessToken;
    if (!jwtToken) throw new Error("Access token missing");

    const response = await axios.post(
      `${baseUrl}${endPoints.upDateDevice}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error sending FCM token:", error);
  }
};

export const getFcmToken = async () => {
  try {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      await AsyncStorage.setItem("fcmToken", fcmToken);
    }
    return fcmToken;
  } catch (error) {
    console.error("Error retrieving or storing FCM token:", error);
  }
};

// export const getUserDetails = async () => {
//   try {
//     const jwtToken = accessToken;
//     if (!jwtToken) throw new Error("Access token missing");

//     const response = await axios.get(`${baseUrl}${endPoints.userDetails}`, {
//       headers: {
//         Authorization: `Bearer ${jwtToken}`,
//       },
//     });

//     return response?.data || null;
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//     return handleTokenRefreshAndRetry(getUserDetails);
//   }
// };

// const handleTokenRefreshAndRetry = async (retryFunction) => {
//   const refresh = accessToken;
//   if (!refresh) throw new Error("Refresh token missing");

//   try {
//     const { access } = await tokenRefresh({ refresh });
//     if (access) return await retryFunction();
//   } catch (refreshError) {
//     return attemptReLogin();
//   }
// };

// const attemptReLogin = async () => {
//   try {
//     const email = await AsyncStorage.getItem("email");
//     const password = await AsyncStorage.getItem("password");
//     if (!email || !password) throw new Error("Login credentials missing");

//     const response = await logIn({ data: { email, password } });
//     if (response) {
//       NativeModules.DevSettings.reload();
//     } else {
//       Alert.alert("Login failed", "Invalid credentials");
//     }
//   } catch (error) {
//     console.error("Error during re-login attempt:", error);
//     throw error;
//   }
// };

// export const loOut = async () => {
//   try {
//     const jwtToken = await AsyncStorage.getItem("access");
//     const refresh = await AsyncStorage.getItem("refresh");
//     const data = {
//       refresh: refresh,
//     };
//     const res = await axios.post(`${baseUrl}${endPoints.logOut}`, data, {
//       headers: {
//         Authorization: `Bearer ${jwtToken}`,
//       },
//     });
//     console.log("loOut send success=======>", res);
//     return res;
//   } catch (er) {
//     console.log("error while sending loOut=====>", er);
//   }
// };
