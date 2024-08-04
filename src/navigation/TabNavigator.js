import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainStackNavigator, ContactStackNavigator } from "./StackNavigator";
import { Image, Platform, Text, View } from "react-native";
import { images } from "../utils/imgaes";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused }) => {
                    let iconName;

                    if (route.name === 'Monitor') {
                        iconName = images.monitor;
                    } else if (route.name === 'Notification') {
                        iconName = images.notification;
                    }

                    return <View style={{ height: 70, alignItems: 'center', justifyContent: 'center', width: 200, }}>
                        <Image resizeMode="contain" source={iconName} style={{ height: 50, width: 50, tintColor: focused ? '#79869F' : '#00000026' }} />
                    </View>;
                },
                tabBarLabel: ({ focused }) => {
                    let label;

                    if (route.name === 'Monitor') {
                        label = 'Monitors';
                    } else if (route.name === 'Notification') {
                        label = 'Notifications';
                    }

                    return <Text style={{ color: focused ? '#79869F' : '#00000026', top: Platform.OS == 'android' ? -10 : 10 }}>{label}</Text>;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: { borderWidth: 1, height: Platform.OS == 'android' ? 85 : '12%', paddingTop: Platform.OS == 'android' ? null : 20 }
            })}
        >
            <Tab.Screen name="Monitor" component={MainStackNavigator} />
            <Tab.Screen name="Notification" component={ContactStackNavigator} />
        </Tab.Navigator>
    );
};

export default TabNavigator;
