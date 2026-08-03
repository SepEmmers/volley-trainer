import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function requestPermissionsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return false;
    }
    return true;
  } else {
    // Cannot request permissions on a simulator reliably
    return false;
  }
}

export async function scheduleDailyWorkoutReminder() {
  const hasPermission = await requestPermissionsAsync();
  if (!hasPermission) return;

  // Cancel existing reminders before scheduling a new one
  await cancelWorkoutReminders();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Tijd om te trainen! 🏐",
      body: "Heb je vandaag al aan je progressie gewerkt?",
    },
    trigger: { 
      hour: 20, 
      minute: 0, 
      repeats: true 
    },
  });
}

export async function cancelWorkoutReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function sendImmediateNotification(title, body) {
  const hasPermission = await requestPermissionsAsync();
  if (!hasPermission) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: null, // Send immediately
  });
}
