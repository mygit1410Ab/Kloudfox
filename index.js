import 'react-native-gesture-handler';
import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';


// Configure Push Notification for Android only
if (Platform.OS === 'android') {
    // Android Push Notification configuration
    PushNotification.configure({
        // Configuration for Android
        onRegister: function (token) {
            // console.log('TOKEN (Android):', token);
        },
        onNotification: function (notification) {
            // console.log('NOTIFICATION (Android):', notification);
            // notification.finish && notification.finish();
        },
        senderID: 'YOUR GCM SENDER ID',
        permissions: {
            alert: true,
            badge: true,
            sound: true,
        },
        popInitialNotification: true,
        requestPermissions: true,
    });

    // Handle background messages for Android
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        // console.log('Message handled in the background (Android)!', remoteMessage);
        PushNotification.localNotification({
            channelId: "default-channel-id",
            vibrate: true,
            vibration: 1000,
            playSound: true,
            soundName: "default",
            title: remoteMessage.notification.title,
            message: remoteMessage.notification.body,
            bigLargeIcon: "ic_launcher",
            largeIconUrl: remoteMessage.notification.android.imageUrl,
            importance: 'high',
            priority: "high",
            visibility: "public",
            style: {
                bigPicture: {
                    imageUrl: remoteMessage.notification.android.imageUrl,
                    title: remoteMessage.notification.title,
                    summaryText: remoteMessage.notification.body,
                }
            }
        });
    });
} else if (Platform.OS === 'ios') {
    // iOS Push Notification configuration
    PushNotification.configure({
        // Configuration for iOS
        onRegister: function (token) {
            console.log('TOKEN (iOS):', token);
        },
        onNotification: function (notification) {
            console.log('NOTIFICATION (iOS):', notification);
            notification.finish(PushNotificationIOS.FetchResult.NoData);
        },
        permissions: {
            alert: true,
            badge: true,
            sound: true,
        },
        popInitialNotification: true,
        requestPermissions: true,
    });

    // Handle foreground notifications for iOS
    PushNotificationIOS.addEventListener('notification', function (notification) {
        // console.log('Foreground NOTIFICATION (iOS):', notification);
    });

    // Handle background notifications for iOS
    PushNotificationIOS.addEventListener('localNotification', function (notification) {
        // console.log('Background NOTIFICATION (iOS):', notification);
    });
}

AppRegistry.registerComponent(appName, () => App);
