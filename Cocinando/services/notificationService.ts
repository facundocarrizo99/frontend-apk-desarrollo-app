import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { apiService } from './api';
import { handleApiError } from '../utils/errorHandler';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async (notification: Notifications.Notification) => {
    console.log('Received notification:', notification);
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

class NotificationService {
  private static instance: NotificationService;
  private expoPushToken: string | null = null;
  private notificationListener: Notifications.Subscription | null = null;
  private responseListener: Notifications.Subscription | null = null;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Request permissions to send notifications
  public async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        showBadge: true,
        enableLights: true,
        enableVibrate: true,
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  }

  // Register the device for push notifications
  public async registerForPushNotifications(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      
      if (!hasPermission) {
        console.warn('Failed to get push token for push notification! No permission granted.');
        return null;
      }

      // Get the token that uniquely identifies this device
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      this.expoPushToken = token;
      
      console.log('Expo push token:', token);
      
      // Send the token to your server if needed
      await this.sendPushTokenToServer(token);
      
      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  // Send the push token to your server
  private async sendPushTokenToServer(token: string): Promise<void> {
    try {
      // Replace this with your actual API endpoint
      await apiService.registerPushToken(token);
    } catch (error) {
      console.error('Error sending push token to server:', error);
    }
  }

  // Schedule a local notification
  public async scheduleLocalNotification(
    title: string,
    body: string,
    data: Record<string, any> = {},
    seconds: number = 1
  ): Promise<string> {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
        vibrate: [0, 250, 250, 250],
      },
      trigger: { seconds },
    });

    return id;
  }

  // Cancel a scheduled notification
  public async cancelScheduledNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // Cancel all scheduled notifications
  public async cancelAllScheduledNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Handle notification received when the app is in the foreground
  public setNotificationHandler(
    handler: (notification: Notifications.Notification) => void
  ): void {
    // Remove any existing listener
    this.notificationListener?.remove();
    
    // Add the new listener
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        handler(notification);
      }
    );
  }

  // Handle notification response (user taps on notification)
  public setNotificationResponseHandler(
    handler: (response: Notifications.NotificationResponse) => void
  ): void {
    // Remove any existing listener
    this.responseListener?.remove();
    
    // Add the new listener
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        handler(response);
      }
    );
  }

  // Get the stored push token
  public getPushToken(): string | null {
    return this.expoPushToken;
  }

  // Clean up listeners
  public cleanup(): void {
    this.notificationListener?.remove();
    this.responseListener?.remove();
    this.notificationListener = null;
    this.responseListener = null;
  }
}

export const notificationService = NotificationService.getInstance();
