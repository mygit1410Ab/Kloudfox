import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { StatusBar, View, ActivityIndicator, Image, Text } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import AuthNavigation from './src/navigation/AuthNavigation';
import { getUserDetails } from './src/services/function';
import { images } from './src/utils/imgaes';
import { FontsStyle } from './src/utils/fontStyle/FontsStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ForGroundHandler from './src/PushNotification/ForGroundHandler';
import { requestUserPermission } from './src/PushNotification/PushNotification';

const App = () => {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const fetchUserDetails = useCallback(async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('access');
      if (jwtToken) {
        const res = await getUserDetails();
        setUser(res.user);
        setAuth(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  useEffect(() => {
    SplashScreen.hide();
    requestUserPermission();
  }, []);

  const loadingView = useMemo(() => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', backgroundColor: '#FFF' }}>
      <Image
        resizeMode='contain'
        source={images.loading}
        style={{ height: 150, width: 150 }}
      />
      <View style={{ flexDirection: 'row' }}>
        <Text style={[FontsStyle.heading_3_text, { color: '#000' }]}>
          {"Loading...."}
        </Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    </View>
  ), []);

  if (loading) {
    return loadingView;
  }

  return (
    <>
      <StatusBar backgroundColor={'transparent'} translucent={true} barStyle={'light-content'} />
      <ForGroundHandler />
      <NavigationContainer>
        {auth ? <DrawerNavigator userData={user} /> : <AuthNavigation />}
      </NavigationContainer>
    </>
  );
};

export default App;
