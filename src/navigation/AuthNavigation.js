// import React, { useMemo } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { StatusBar } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import WelcomeScreen from '../screens/WelcomeScreen';
// import LogIn from '../screens/LogIn';
// import DrawerNavigator from './DrawerNavigator';

// const Stack = createNativeStackNavigator();

// const AuthStack = () => {

//     const initialRouteName = useMemo(() => 'WelcomeScreen', []);

//     return (
//         <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false, gestureEnabled: false }}>
//             <>
//                 <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
//                 <Stack.Screen name="LogIn" component={LogIn} />
//                 <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
//             </>
//         </Stack.Navigator>
//     );
// }

// const AuthNavigation = () => {

//     const navigationContainer = useMemo(() => (
//         <AuthStack />
//     ), []);

//     return (
//         <SafeAreaProvider>
//             {navigationContainer}
//         </SafeAreaProvider>
//     );
// }

// export default AuthNavigation;

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import LogIn from "../screens/LogIn";

const Stack = createNativeStackNavigator();
const Auth = () => {
  //
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={"WelcomeScreen"} component={WelcomeScreen} />
      <Stack.Screen name={"LogIn"} component={LogIn} />
    </Stack.Navigator>
  );
};

export default Auth;
