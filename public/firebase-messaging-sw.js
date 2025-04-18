importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");


firebase.initializeApp({
  apiKey: "AIzaSyDsQhHXm7Shm9n1pBGPeTpfeK8QBOfNmt0",
  authDomain: "app-crm-web.firebaseapp.com",
  projectId: "app-crm-web",
  storageBucket: "app-crm-web.firebasestorage.app",
  messagingSenderId: "976953129573",
  appId: "1:976953129573:web:0a5a946e5f6f226585e48c",
  measurementId: "G-3DJ1YEBGHQ"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message:", payload);

  const title = payload.notification?.title || "Новое уведомление";
  const body = payload.notification?.body || "";
  const icon = "/firebase-logo.png";

  const notificationOptions = {
    body,
    icon,
  };

  // Показываем уведомление
  self.registration.showNotification(title, notificationOptions);

  // ⬇️ Вот это добавь:
  self.clients.matchAll({ includeUncontrolled: true, type: "window" }).then((clients) => {
    clients.forEach((client) => {
      console.log("[SW] Sending PLAY_SOUND to client");
      client.postMessage({ type: "PLAY_SOUND" });
    });
  });
});