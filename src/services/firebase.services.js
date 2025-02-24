import { getMessaging, getToken } from "firebase/messaging";


export const getFirebaseDeviceToken = async () => {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const messaging = getMessaging();
        const token = await getToken(messaging, {
          vapidKey: process.env.REACT_APP_VAPID_KEY 
        });

        if (token) {
          return token;
        } else {
          console.log('No registration token available. Request permission to generate one.');
          return null;
        }
      } else {
        console.log('Notification permission denied');
        return null;
      }
    } catch (error) {
      console.error('Error getting device token:', error);
      return null;
    }
  };