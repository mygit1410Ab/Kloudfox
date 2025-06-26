import React, { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { MainStackNavigator } from "./StackNavigator";
import Auth from "./AuthNavigation";
import {
  ActivityIndicator,
  Image,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { darkTheme, lightTheme } from "../utils/color";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { loginUser } from "../redux/slices/authSlice";
import { windowHeight, windowWidth } from "../utils/fontStyle/FontsStyle";
import { images } from "../utils/imgaes";
import { navigationRef } from "./NavigationService";
import { getUserAction } from "../redux/action";
import { setUserData } from "../redux/slices/userDataSlice";
import { refreshAccessToken } from "../services/function";
// import { useDispatch, useSelector } from 'react-redux';

const Loading = ({ loadingText = "Loading..." }) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FFF",
    }}
  >
    <Image
      source={images.loading}
      style={{ height: windowHeight * 0.3, width: windowHeight * 0.3 }}
      resizeMode="contain"
    />
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        // borderWidth: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" color="#04142E" />
      <Text
        style={{
          //   marginTop: 10,
          color: "#04142E",
          fontSize: windowWidth * 0.07,
        }}
      >
        {loadingText}
      </Text>
    </View>
  </View>
);

export default function Navigator() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;

  const dispatch = useDispatch();
  const storedAccessToken = useSelector((state) => state.token.access);
  const storedRefreshToken = useSelector((state) => state.token.refresh);

  const [isLoading, setIsLoading] = useState(true);
  const [userFetched, setUserFetched] = useState(null); // ✅ null means "not decided yet"

  useEffect(() => {
    const checkLoginAndFetchUser = async () => {
      try {
        if (!storedAccessToken) {
          setUserFetched(false);
          setIsLoading(false);
          return;
        }

        const fetchUser = (tokenToUse) => {
          dispatch(
            getUserAction(tokenToUse, async (res) => {
              const user = res?.data?.user;
              const statusCode = res?.status;
              const isUnauthorized =
                statusCode === 401 || res?.response?.status === 401;

              if (user) {
                dispatch(setUserData(user));
                dispatch(loginUser());
                await AsyncStorage.setItem("userData", JSON.stringify(user));
                setUserFetched(true);
              } else if (isUnauthorized && storedRefreshToken) {
                try {
                  const newToken = await refreshAccessToken(storedRefreshToken);
                  if (newToken) {
                    fetchUser(newToken);
                  } else {
                    setUserFetched(false);
                  }
                } catch (refreshErr) {
                  console.error("🔁 Token refresh failed:", refreshErr);
                  setUserFetched(false);
                }
              } else {
                console.warn("⚠️ User fetch failed");
                setUserFetched(false);
              }

              setIsLoading(false);
            })
          );
        };

        fetchUser(storedAccessToken);
      } catch (err) {
        console.error("App init error:", err);
        setUserFetched(false);
        setIsLoading(false);
      }
    };

    checkLoginAndFetchUser();
  }, [dispatch, storedAccessToken, storedRefreshToken]);

  if (isLoading || userFetched === null) {
    return <Loading loadingText="Loading..." />;
  }

  return (
    <NavigationContainer theme={theme} ref={navigationRef}>
      {userFetched ? <MainStackNavigator /> : <Auth />}
    </NavigationContainer>
  );
}
