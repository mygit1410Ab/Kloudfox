import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from '../screens/WelcomeScreen';
import AppIntroFirst from '../screens/AppIntroFirst';
import AppIntroSecond from '../screens/AppIntroSecond';
import LogIn from '../screens/LogIn';
import DrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator();



const AuthStack = () => {
    return (
        <Stack.Navigator initialRouteName='WelcomeScreen' screenOptions={{ headerShown: false }}>
            <>
                <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
                <Stack.Screen name="AppIntroFirst" component={AppIntroFirst} />
                <Stack.Screen name="AppIntroSecond" component={AppIntroSecond} />
                <Stack.Screen name="LogIn" component={LogIn} />
                <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
            </>
        </Stack.Navigator>
    );
}

const AuthNavigation = () => {

    return (
        <SafeAreaProvider>
            <AuthStack />
        </SafeAreaProvider>
    );
}

export default AuthNavigation;



// <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
//                     <Stack.Screen name="Auth" component={AuthStack} />
//                     <Stack.Screen name="Main" component={MainStack} />
//                 </Stack.Navigator>