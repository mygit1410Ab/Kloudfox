import {
  Alert,
  BackHandler,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import SafeAreaCoustom from "../components/SafeAreaCoustom";
import CoustomBtn from "../components/CoustomBtn";
import {
  FontsStyle,
  windowHeight,
  windowWidth,
} from "../utils/fontStyle/FontsStyle";
import { images } from "../utils/imgaes";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Redux slices & actions
import { getUserAction, loginAction } from "../redux/action";
import { loginUser } from "../redux/slices/authSlice";
import { setUserData } from "../redux/slices/userDataSlice";
import { setTokens } from "../redux/slices/tokenSlice";
import { getFcmToken, sendFcmtoken } from "../services/function";

const LogIn = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unsubscribe;
    if (Platform.OS === "ios") {
      unsubscribe = navigation.addListener("blur", gestureEndListener);
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [navigation]);

  const gestureEndListener = () => {
    // Called on screen unmount (iOS specific)
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Hold on!",
        "Are you sure you want to exit from the application?",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const onPress = async () => {
    Keyboard.dismiss();
    setEmailError(false);
    setPasswordError(false);

    if (!email.trim()) {
      setEmailError(true);
      Alert.alert("Validation", "Email is required");
      return;
    }
    if (!password.trim()) {
      setPasswordError(true);
      Alert.alert("Validation", "Password is required");
      return;
    }

    setLoading(true);

    try {
      const payload = { email, password };

      dispatch(
        loginAction(payload, async (response) => {
          // ✅ Normalize response
          const tokenData = response?.data?.access
            ? response.data
            : response;

          if (tokenData?.access && tokenData?.refresh) {
            dispatch(setTokens({
              access: tokenData.access,
              refresh: tokenData.refresh,
            }));

            await AsyncStorage.multiSet([
              ["email", email],
              ["password", password],
              ["token", tokenData.access],
              ["refresh", tokenData.refresh],
            ]);

            const fcm = await getFcmToken();
            if (fcm) {
              await sendFcmtoken({
                mobile_token: fcm,
                action: "login",
                accessToken: tokenData.access,
              });
            }

            dispatch(loginUser());

            dispatch(
              getUserAction(tokenData.access, async (userResponse) => {
                const user = userResponse?.data?.user;
                if (user) {
                  dispatch(setUserData(user));
                  await AsyncStorage.setItem("userData", JSON.stringify(user));
                }
              })
            );
          } else {
            Alert.alert("Login Failed", "Invalid credentials or server error.");
          }
        })
      );
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong while logging in.");
    } finally {
      setLoading(false);
    }
  };


  const showHandler = () => {
    setShow(!show);
  };

  return (
    <SafeAreaCoustom>
      <View style={styles.mainCard}>
        <View style={styles.imageCard}>
          <Image
            style={{ width: "50%", height: 80 }}
            resizeMode="contain"
            source={images.appLogo}
          />
        </View>
        <View style={styles.inputCard}>
          <Text style={[FontsStyle.paragraph_text, { color: "#75788D" }]}>
            {"Email"}
          </Text>
          <TextInput
            style={[
              styles.inputStyle,
              FontsStyle.caption_text,
              {
                fontSize: 18,
                borderColor: emailError ? "red" : "#75788D",
              },
            ]}
            placeholder="example@email.com"
            placeholderTextColor={"#75788D"}
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          <View
            style={[
              styles.pwdCard,
              { borderColor: passwordError ? "red" : "#75788D" },
            ]}
          >
            <TextInput
              style={[
                styles.passwordInputStyle,
                FontsStyle.caption_text,
                { fontSize: 18 },
              ]}
              placeholder="Password"
              secureTextEntry={!show}
              placeholderTextColor={"#75788D"}
              onChangeText={(text) => setPassword(text)}
              value={password}
            />
            <TouchableOpacity onPress={showHandler} style={styles.eyeCard}>
              <Image
                style={{ height: 25, width: 25, tintColor: "#75788D" }}
                source={!show ? images.eye : images.hide}
              />
            </TouchableOpacity>
          </View>
        </View>
        <CoustomBtn
          title={"Continue"}
          paddingVertical={15}
          width={windowWidth * 0.9}
          backgroundColor={"#22C55F"}
          borderRadius={15}
          titleColor={"#FFF"}
          onPress={onPress}
          loading={loading}
        />
      </View>
    </SafeAreaCoustom>
  );
};

export default LogIn;

const styles = StyleSheet.create({
  mainCard: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  imageCard: {
    width: "100%",
    alignItems: "center",
  },
  inputCard: {
    width: "90%",
    marginTop: "15%",
    marginBottom: "10%",
  },
  inputStyle: {
    width: "100%",
    paddingVertical: 10,
    color: "#000",
    borderBottomWidth: 2,
    marginBottom: "5%",
  },
  passwordInputStyle: {
    width: "90%",
    paddingVertical: 10,
    color: "#000",
  },
  pwdCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 2,
  },
  eyeCard: {
    flex: 1,
    alignItems: "center",
    padding: "3%",
  },
});
