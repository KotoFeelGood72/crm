import { ref } from "vue";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useUsersStore } from "@/store/useUserStore";
import { initializeApp } from "firebase/app";
import { toast } from 'vue3-toastify';

const firebaseConfig = {
  apiKey: "AIzaSyBENIHoTr0j4eIB_dZea1WnR_PSAqVWqTU",
  authDomain: "crm-system-835c7.firebaseapp.com",
  projectId: "crm-system-835c7",
  storageBucket: "crm-system-835c7.firebasestorage.app",
  messagingSenderId: "752010941649",
  appId: "1:752010941649:web:7019085568b3112164a1f0",
  measurementId: "G-VW1B74L5WV",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export function useNotifications() {
  const fcmToken = ref<string | null>(null);
  const permission = ref<NotificationPermission>("default");

  const requestPermission = async () => {
    try {
      const store = useUsersStore(); // 👈 pinia store
  
      const status = await Notification.requestPermission();
      permission.value = status;
  
      if (status === "granted") {
        const token = await getToken(messaging, {
          vapidKey:
            "BNEC3eVuR5qeQzMcysMdQoKq5mOxtJ7rcl3OpnRxKeJCTcpDgmX1KvtjKWBPNbOq2ve0KUM8tmLxBBAQeEL3V-k",
        });
        fcmToken.value = token;
        console.log("✅ FCM Token:", token);
  
        if (store?.saveFcmToken) {
          await store.saveFcmToken(token); // 👈 сохраняем в WordPress
        }
      } else {
        console.warn("❌ Уведомления запрещены");
      }
    } catch (error) {
      console.error("Ошибка получения разрешения или токена:", error);
    }
  };

  onMessage(messaging, async (payload) => {
    console.log("📩 Foreground Push:", payload);
  
    const store = useUsersStore();
  
    if (payload.notification && permission.value === "granted") {
      const { title = "Уведомление", body = "" } = payload.notification;
  
      toast.info(body, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        theme: "light",
      });
  
      new Notification(title, {
        body,
        icon: "/firebase-logo.png",
      });
  
      // ✅ Записываем флаг в localStorage
      localStorage.setItem("hasNewNotification", "true");
  
      // 🔄 Подгружаем свежие уведомления
      await store.fetchUserNotifications?.();
    }
  });

  return {
    requestPermission,
    fcmToken,
    permission,
  };
}