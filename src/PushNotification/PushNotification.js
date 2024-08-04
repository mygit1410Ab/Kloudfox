import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native'
import { getFcmToken } from '../services/function';



const checkApplicationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    } catch (error) {
      console.error(error)
    }
  }
};

export const requestUserPermission = async () => {
  try {
    checkApplicationPermission();
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      await getFcmToken();
    }
  } catch (error) {
    console.log('Error requesting permission:', error);
  }
}



// export const NotificationSecvices = async () => {
//   messaging().onNotificationOpenedApp(remoteMessage => {
//     console.log('unsubscribe.....', remoteMessage)
//   });

//   await messaging().getInitialNotification().then(remoteMessage => {
//     if (!remoteMessage) {
//       console.log(remoteMessage)
//     }
//   })
// }

