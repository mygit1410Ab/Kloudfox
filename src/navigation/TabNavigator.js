import React, { useMemo } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainStackNavigator, ContactStackNavigator } from "./StackNavigator";
import { Image, Platform, Text, View, StyleSheet } from "react-native";
import { images } from "../utils/imgaes";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const screenOptions = useMemo(() => ({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
            let iconName;

            if (route.name === 'Monitor') {
                iconName = images.monitor;
            } else if (route.name === 'Notification') {
                iconName = images.notification;
            }

            return (
                <View style={styles.iconContainer}>
                    <Image
                        resizeMode="contain"
                        source={iconName}
                        style={[styles.icon, { tintColor: focused ? '#79869F' : '#00000026' }]}
                    />
                </View>
            );
        },
        tabBarLabel: ({ focused }) => {
            let label;

            if (route.name === 'Monitor') {
                label = 'Monitors';
            } else if (route.name === 'Notification') {
                label = 'Notifications';
            }

            return (
                <Text style={[styles.label, { color: focused ? '#79869F' : '#00000026' }]}>
                    {label}
                </Text>
            );
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: [
            styles.tabBar,
            Platform.OS === 'android' ? styles.androidTabBar : styles.iosTabBar
        ],
    }), []);

    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen name="Monitor" component={MainStackNavigator} />
            <Tab.Screen name="Notification" component={ContactStackNavigator} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
    },
    icon: {
        height: 50,
        width: 50,
    },
    label: {
        top: Platform.OS === 'android' ? -10 : 10,
    },
    tabBar: {
        borderWidth: 1,
    },
    androidTabBar: {
        height: 85,
    },
    iosTabBar: {
        height: '12%',
        paddingTop: 20,
    },
});

export default TabNavigator;
