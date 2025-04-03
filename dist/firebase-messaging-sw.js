importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBENIHoTr0j4eIB_dZea1WnR_PSAqVWqTU",
  authDomain: "crm-system-835c7.firebaseapp.com",
  projectId: "crm-system-835c7",
  storageBucket: "crm-system-835c7.firebasestorage.app",
  messagingSenderId: "752010941649",
  appId: "1:752010941649:web:7019085568b3112164a1f0",
  measurementId: "G-VW1B74L5WV"
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