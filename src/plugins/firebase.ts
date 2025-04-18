import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

// 🔧 Замени на свои данные из Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDsQhHXm7Shm9n1pBGPeTpfeK8QBOfNmt0",
  authDomain: "app-crm-web.firebaseapp.com",
  projectId: "app-crm-web",
  storageBucket: "app-crm-web.firebasestorage.app",
  messagingSenderId: "976953129573",
  appId: "1:976953129573:web:0a5a946e5f6f226585e48c",
  measurementId: "G-3DJ1YEBGHQ"
};

// ✅ Безопасная инициализация
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Экспорт сервисов
export const db = getFirestore(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);