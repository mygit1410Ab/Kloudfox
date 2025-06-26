import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  TextInput,
} from "react-native";
import {
  DrawerContentScrollView,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import TabNavigator from "./TabNavigator";
import { images } from "../utils/imgaes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FontsStyle } from "../utils/fontStyle/FontsStyle";
import {
  getFcmToken,
  getUserDetails,
  loOut,
  sendFcmtoken,
} from "../services/function";
import FastImage from "react-native-fast-image";
import { baseUrl } from "../services/api";
import CoustomBtn from "../components/CoustomBtn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNRestart from "react-native-restart";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import { clearTokens } from "../redux/slices/tokenSlice";
import { clearUserData } from "../redux/slices/userDataSlice";

const CustomDrawerContent = () => {
  const user = useSelector((state) => state.userData.userData);
  const accessToken = useSelector((state) => state.token.access);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState("");
  const [count, setCount] = useState(0);
  const navigation = useNavigation();

  const logOutHandler = useCallback(async () => {
    try {
      setLoading(true);

      const token = await getFcmToken();
      if (!token) {
        console.warn("No FCM token found");
        return;
      }

      const fcmPayload = { mobile_token: token, action: "logout", accessToken };
      const tokenDeleted = await sendFcmtoken(fcmPayload);
      if (!tokenDeleted) {
        console.warn("FCM token removal failed");
        return;
      }
      dispatch(logoutUser());
      dispatch(clearTokens());
      dispatch(clearUserData());
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const goSettingHandler = useCallback(() => {
    Linking.openSettings();
  }, []);

  const appRateHandler = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("fcmToken");
      console.log("FCMtoken", token);
      setFcmToken(token || ""); // Ensure fcmToken is set even if the token is null
      setCount((prevCount) => prevCount + 1); // Increment count using previous state value
    } catch (error) {
      console.error("Error fetching FCM token", error);
    }
  }, []);

  return (
    <DrawerContentScrollView style={{ backgroundColor: "#FFF" }}>
      <View
        style={{ alignItems: "center", margin: 20, backgroundColor: "#FFF" }}
      >
        <FastImage
          style={{
            width: 150,
            height: 150,
            borderRadius: 150 / 2,
            flex: 1,
            backgroundColor: "gray",
          }}
          source={{ uri: `${baseUrl}${user?.picture?.profile_picture}` }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
      <Text
        style={[
          FontsStyle.title_text,
          { textAlign: "center", color: "#000000" },
        ]}
      >
        {user?.user_info?.first_name} {user?.user_info?.last_name}
      </Text>
      <Text
        style={[
          FontsStyle.caption_text,
          { textAlign: "center", color: "#000000", marginTop: 5 },
        ]}
      >
        {user?.user_info?.email}
      </Text>
      <Text
        onPress={goSettingHandler}
        style={[
          FontsStyle.heading_3_text,
          {
            textAlign: "center",
            fontWeight: "400",
            color: "#707070",
            marginTop: "20%",
          },
        ]}
      >
        Notification Settings
      </Text>

      <View
        style={{
          width: "100%",
          alignItems: "center",
          gap: 30,
          paddingVertical: 10,
          marginTop: 200,
        }}
      >
        <CoustomBtn
          title={"Logout"}
          backgroundColor={"#DF0000"}
          width={"70%"}
          titleColor={"#fff"}
          paddingVertical={15}
          borderRadius={16}
          onPress={logOutHandler}
          loading={loading}
        />
        <CoustomBtn
          title={"Rate the App"}
          backgroundColor={"#00A638"}
          width={"70%"}
          titleColor={"#fff"}
          paddingVertical={15}
          borderRadius={16}
          // disabled={true}
          onPress={appRateHandler}
        />
        {count === 5 && (
          <TextInput
            value={fcmToken}
            style={{
              borderWidth: 1,
              color: "#000",
              width: "100%",
              paddingHorizontal: 10,
            }}
          />
        )}
      </View>
    </DrawerContentScrollView>
  );
};

const Drawer = createDrawerNavigator();

const CustomHeader = () => {
  const user = useSelector((state) => state.userData.userData);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const openDrawer = useCallback(() => {
    navigation.openDrawer();
  }, [navigation]);

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <View style={styles.drawerAndDetailsCard}>
        <TouchableOpacity onPress={openDrawer}>
          <Image
            resizeMode="contain"
            source={images.bars}
            style={styles.headerImage}
          />
        </TouchableOpacity>
        <View
          style={{
            marginLeft: 15,
            alignItems: "flex-start",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Text
            style={[FontsStyle.caption_text, { color: "#FFF", fontSize: 18 }]}
          >
            Hello 👋 {user?.user_info?.first_name} {user?.user_info?.last_name}
          </Text>
          <Text
            style={[FontsStyle.paragraph_text, { color: "#FFF", fontSize: 15 }]}
          >
            {"Welcome to KloudFox"}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: "30%",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Image
          resizeMode="contain"
          source={images.homeAppLogo}
          style={styles.homeAppLogo}
        />
      </View>
    </View>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        header: () => <CustomHeader />,
      }}
      drawerContent={() => <CustomDrawerContent />}
    >
      <Drawer.Screen name="Home" component={TabNavigator} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: "4%",
    backgroundColor: "#04142E",
    justifyContent: "space-between",
    paddingBottom: 1,
  },
  headerImage: {
    width: 25,
    height: 25,
    tintColor: "#D9D9D9",
  },
  homeAppLogo: {
    height: 60,
    width: "100%",
  },
  drawerAndDetailsCard: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
  },
});

export default DrawerNavigator;
