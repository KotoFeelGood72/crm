// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBENIHoTr0j4eIB_dZea1WnR_PSAqVWqTU",
  authDomain: "crm-system-835c7.firebaseapp.com",
  projectId: "crm-system-835c7",
  storageBucket: "crm-system-835c7.firebasestorage.app",
  messagingSenderId: "752010941649",
  appId: "1:752010941649:web:7019085568b3112164a1f0",
  measurementId: "G-VW1B74L5WV"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 🔔 Запрос на разрешение и получение токена
export const requestFirebaseNotificationPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BNEC3eVuR5qeQzMcysMdQoKq5mOxtJ7rcl3OpnRxKeJCTcpDgmX1KvtjKWBPNbOq2ve0KUM8tmLxBBAQeEL3V-k"
    });
    console.log("FCM Token:", token);
    return token;
  } catch (err) {
    console.error("FCM Token Error:", err);
    return null;
  }
};

onMessage(messaging, async (payload) => {
  console.log("Foreground Notification:", payload);

  const title = payload?.notification?.title || "Без заголовка";
  const body = payload?.notification?.body || "Без текста";

  if (Notification.permission !== "granted") {
    await Notification.requestPermission();
  }

  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/firebase-logo.png", // или твоя иконка
    });
  }
});