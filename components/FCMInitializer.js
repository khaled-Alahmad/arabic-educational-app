"use client";

import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging, initializeFirebaseMessaging } from "../app/firebaseConfig";
import { NotificationContainer } from "../components/ui/notification-container";
import { toast } from "react-hot-toast";
const FCMInitializer = () => {
  useEffect(() => {
    const initializeFCM = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('Notification permission not granted');
          return;
        }

        await initializeFirebaseMessaging();

        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
        if (!vapidKey) {
          throw new Error("VAPID key is not set");
        }

        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
          throw new Error("Service Worker not registered");
        }

        const currentToken = await getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration: registration,
        });

        if (currentToken) {
          console.log("FCM Token:", currentToken);
          // You can send this token to your server here
        } else {
          console.warn("No FCM token available");
        }

        // Handle foreground messages
        onMessage(messaging, (payload) => {
          console.log("Foreground message received:", payload);
          // Show notification using react-hot-toast with enhanced options
          // toast(payload.notification.title, {
          //   description: payload.notification.body,
          //   duration: 8000,
          //   position: 'top-right',
          //   style: {
          //     background: '#4CAF50',
          //     color: '#fff',
          //     padding: '16px',
          //     borderRadius: '8px',
          //   },
          // });
          // Create and show native notification
          // if (Notification.permission === 'granted') {
          //   const notification = new Notification(payload.notification.title, {
          //     body: payload.notification.body,
          //     icon: '/logo.png',
          //     tag: new Date().getTime().toString(),
          //     requireInteraction: true,
          //     vibrate: [200, 100, 200]
          //   });
          // }
          // Dispatch custom event for NotificationContainer
          window.postMessage({ type: 'FCM_MESSAGE', payload }, '*');
        });
      } catch (error) {
        console.error("FCM initialization error:", error);
      }
    };

    if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
      initializeFCM();
    }
  }, []);

  return <NotificationContainer />;
};

export default FCMInitializer;
