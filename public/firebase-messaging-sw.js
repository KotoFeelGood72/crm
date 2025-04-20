// // Give the service worker access to Firebase Messaging.
// // Note that you can only use Firebase Messaging here. Other Firebase libraries
// // are not available in the service worker.
// // Replace 10.13.2 with latest version of the Firebase JS SDK.
// importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// // Initialize the Firebase app in the service worker by passing in
// // your app's Firebase config object.
// // https://firebase.google.com/docs/web/setup#config-object


// firebase.initializeApp({
//   apiKey: "AIzaSyDsQhHXm7Shm9n1pBGPeTpfeK8QBOfNmt0",
//   authDomain: "app-crm-web.firebaseapp.com",
//   projectId: "app-crm-web",
//   storageBucket: "app-crm-web.firebasestorage.app",
//   messagingSenderId: "976953129573",
//   appId: "1:976953129573:web:0a5a946e5f6f226585e48c",
//   measurementId: "G-3DJ1YEBGHQ"
// });

// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log(
//     '[firebase-messaging-sw.js] Received background message ',
//     payload
//   );
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: 'https://avatars.mds.yandex.net/i?id=2e330101c56940374ad6e5d972c5ef8b_l-6888117-images-thumbs&ref=rim&n=13&w=900&h=900'
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
firebase.initializeApp({
  apiKey: "AIzaSyDsQhHXm7Shm9n1pBGPeTpfeK8QBOfNmt0",
  authDomain: "app-crm-web.firebaseapp.com",
  projectId: "app-crm-web",
  storageBucket: "app-crm-web.firebasestorage.app",
  messagingSenderId: "976953129573",
  appId: "1:976953129573:web:0a5a946e5f6f226585e48c",
  measurementId: "G-3DJ1YEBGHQ"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // Use values from payload.notification if available
  const notif = payload.notification || {};
  const notificationTitle = notif.title || 'New Notification';
  const notificationOptions = {
    body: notif.body || '',
    // Firebase 'notification' may include 'icon' and/or 'image'
    badge: notif.badge || notif.image || '/logo.jpg',
    icon: notif.icon || notif.image || '/logo.jpg',
    image: notif.image || undefined,
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
