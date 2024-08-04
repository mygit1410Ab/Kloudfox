import axios from "axios";
import { baseUrl, endPoints } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from 'react-native-snackbar';
import { NativeModules } from "react-native";
import messaging from '@react-native-firebase/messaging';



export const logIn = async ({ data }) => {
    // console.log(data)
    try {
        const response = await axios.post(`${baseUrl}${endPoints.logIn}`, data);
        // console.log('response', response)
        if (response.data) {
            await AsyncStorage.setItem('access', response.data.access);
            await AsyncStorage.setItem('refresh', response.data.refresh);
            await AsyncStorage.setItem('email', data.email);
            await AsyncStorage.setItem('password', data.password);
            const fcmToken = await getFcmToken()
            if (fcmToken) {
                const data = {
                    mobile_token: fcmToken,
                    action: 'login'
                }
                await sendFcmtoken(data)
            } else {
                return
            }
            // console.log('logIn success=====>')
            return response.data;
        }
    } catch (error) {
        console.error("Error sending data: ", error);
        Snackbar.show({
            text: 'Invalid email or password',
            duration: Snackbar.LENGTH_LONG,
        });

        throw error;
    }
};

export const tokenRefresh = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}${endPoints.refreshToken}`, data);
        if (response.data) {
            await AsyncStorage.setItem('access', response.data.access);
            return response.data;
        }
    } catch (error) {
        console.error("Error refreshing token: ", error);
        throw error;
    }
};


export const sendFcmtoken = async (data) => {
    try {
        const jwtToken = await AsyncStorage.getItem('access');
        // console.log('data============>', data)
        const res = await axios.post(`${baseUrl}${endPoints.upDateDevice}`, data, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        })
        // console.log('sendFcmtoken send success=======>', res)
        return res
    } catch (er) {
        console.log('error while sending sendFcmtoken=====>', er)
    }
}

export const getFcmToken = async () => {
    try {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        console.log('Old FCM Token:', fcmToken);

        if (!fcmToken) {
            fcmToken = await messaging().getToken();
            console.log('New FCM Token:', fcmToken);
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
        return fcmToken
    } catch (error) {
        console.log('Error retrieving or storing FCM Token:', error);
    }
}

export const getUserDetails = async () => {
    try {
        const jwtToken = await AsyncStorage.getItem('access');
        // console.log(jwtToken)
        const response = await axios.get(
            `${baseUrl}${endPoints.userDetails}`,
            {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            }
        );
        if (response.data) {
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching user details: ', error);

        const refresh = await AsyncStorage.getItem('refresh');
        if (!refresh) {
            throw error;
        }

        const data = { refresh };

        try {
            const res = await tokenRefresh(data);
            if (res.access) {
                return await getUserDetails(); // Use return to prevent unhandled promises
            }
        } catch (refreshError) {
            try {
                const email = await AsyncStorage.getItem('email');
                const password = await AsyncStorage.getItem('password');
                const data = {
                    email,
                    password
                };
                const response = await logIn({ data });
                if (response) {
                    NativeModules.DevSettings.reload();
                } else {
                    Alert.alert('Login failed', 'Invalid credentials');
                }
            } catch (er) {
                console.log("error==========>", er)
            }
            throw error; // rethrow the original error if token refresh fails
        }
    }
};




export const loOut = async () => {
    try {
        const jwtToken = await AsyncStorage.getItem('access');
        const refresh = await AsyncStorage.getItem('refresh');
        const data = {
            refresh: refresh
        }
        const res = await axios.post(`${baseUrl}${endPoints.logOut}`, data, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        })
        console.log('loOut send success=======>', res)
        return res
    } catch (er) {
        console.log('error while sending loOut=====>', er)
    }
}

