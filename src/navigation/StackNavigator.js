import React, { useMemo } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "../screens/HomeScreen";
import Notification from "../screens/Notification";
import { StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
    const screenOptionStyle = useMemo(() => ({
        headerStyle: styles.headerStyle,
        headerTintColor: styles.headerTintColor.color,
        headerBackTitle: "Back",
        headerShown: false,
    }), []);

    return (
        <Stack.Navigator screenOptions={screenOptionStyle}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </Stack.Navigator>
    );
}

const ContactStackNavigator = () => {
    const screenOptionStyle = useMemo(() => ({
        headerStyle: styles.headerStyle,
        headerTintColor: styles.headerTintColor.color,
        headerBackTitle: "Back",
        headerShown: false,
    }), []);

    return (
        <Stack.Navigator screenOptions={screenOptionStyle}>
            <Stack.Screen name="NotificationPanel" component={Notification} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: "#9AC4F8",
    },
    headerTintColor: {
        color: "white",
    },
});

export { MainStackNavigator, ContactStackNavigator };
