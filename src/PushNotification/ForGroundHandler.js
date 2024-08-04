import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

const ForGroundHandler = () => {
  useEffect(() => {
    // Create a notification channel for Android
    PushNotification.createChannel(
      {
        channelId: "default-channel-id", // You can customize this ID
        channelName: "Default Channel", // You can customize this name
        channelDescription: "A default channel", // You can customize this description
        importance: 4, // high importance
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );

    // Notification handling for Android
    const androidNotificationHandler = async (remoteMessage) => {
      // console.log('Foreground notification received (Android):', remoteMessage);

      PushNotification.localNotification({
        channelId: "default-channel-id",
        vibrate: true,
        vibration: 1000,
        playSound: true,
        soundName: "default",
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
        bigLargeIcon: "ic_launcher", // Large icon for the notification (ensure you have this icon in your drawable resources)
        largeIconUrl: remoteMessage.notification.android.imageUrl, // Large icon URL
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
    };

    // Notification handling for iOS
    const iosNotificationHandler = async (message) => {
      // console.log('Foreground notification received (iOS):', message);

      PushNotificationIOS.addNotificationRequest({
        id: message.messageId,
        title: message.notification.title,
        body: message.notification.body,
        userInfo: message.data,
      });
    };

    // Subscribe to messages
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (Platform.OS === 'android') {
        androidNotificationHandler(remoteMessage);
      } else if (Platform.OS === 'ios') {
        iosNotificationHandler(remoteMessage);
      }
    });

    return unsubscribe;
  }, []);

  return null;
};

export default ForGroundHandler;
