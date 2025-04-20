import { defineStore, storeToRefs } from "pinia";
import axios from "axios";
import { api } from "@/api/api";

export const useUsersStore = defineStore("user", {
  state: () => ({
    users: null as any,
    auth: null as string | null,
    notifications: [] as any[],
    usersList: null as any,
  }),

  actions: {
    // Сохранение FCM токена
    async saveFcmToken(token: string) {
      try {
        const response = await api.post(
          "/wp-json/custom/v1/save-fcm-token",
          { token },
          { withCredentials: false }
        );
        console.log("✅ FCM токен сохранён в WordPress", response.data);
      } catch (error) {
        console.error("❌ Ошибка сохранения FCM токена:", error);
      }
    },

    // Получение уведомлений
    async fetchUserNotifications() {
      try {
        const res = await api.get(
          "/wp-json/custom/v1/user-notifications",
          { withCredentials: true }
        );
        this.notifications = res.data?.notifications || [];
      } catch (e) {
        console.warn("⚠️ Не удалось загрузить уведомления", e);
      }
    },

    // Регистрация
    async signIn(user: any) {
      try {
        await axios.post(
          "/wp-json/wp/v2/register/user",
          user,
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("❌ Sign in error:", error);
        throw error;
      }
    },

    // Логин с FCM токеном
    // async login(user: any) {
    //   try {
    //     const response = await api.post(
    //       "/wp-json/jwt-auth/v1/token",
    //       user
    //     );
    //     // Проверяем, что получили токен
    //     if (!response.data || !response.data.token) {
    //       throw new Error("Неверный логин или пароль");
    //     }
    //     this.auth = response.data;

    //     // Запрашиваем разрешение и сохраняем FCM токен
    //     const permission = await Notification.requestPermission();
    //     if (permission === "granted") {
    //       const { getMessaging, getToken } = await import(
    //         "firebase/messaging"
    //       );
    //       const { messaging } = await import("@/plugins/firebase");

    //       const token = await getToken(messaging, {
    //         vapidKey:
    //           "BNEC3eVuR5qeQzMcysMdQoKq5mOxtJ7rcl3OpnRxKeJCTcpDgmX1KvtjKWBPNbOq2ve0KUM8tmLxBBAQeEL3V-k",
    //       });

    //       if (token) {
    //         await this.saveFcmToken(token);
    //       }
    //     }
    //   } catch (error) {
    //     console.error("❌ Login error:", error);
    //     // Пробрасываем дальше, чтобы компонент обработал ошибку
    //     throw error;
    //   }
    // },


    // Login с FCM токеном
async login(user: any) {
  try {
    const response = await api.post('/wp-json/jwt-auth/v1/token', user)
    if (!response.data?.token) {
      throw new Error('Неверный логин или пароль')
    }
    this.auth = response.data

    // Запрашиваем разрешение на уведомления
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      try {
        // инициализируем Firebase
        const { getMessaging, getToken } = await import('firebase/messaging')
        const { messaging } = await import('@/plugins/firebase')
        const fcmToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY!
        })
        if (fcmToken) {
          await this.saveFcmToken(fcmToken)
        }
      } catch (e) {
        console.warn('Не удалось получить FCM‑токен, пуши не будут работать:', e)
      }
    }
  } catch (error) {
    console.error('❌ Login error:', error)
    // прокинем дальше, чтобы компонент отобразил message.error
    throw error
  }
},
    // Проверка токена
    async refreshToken() {
      try {
        await api.post("/wp-json/jwt-auth/v1/token/validate");
      } catch (error) {
        console.log("⚠️ Refresh token error:", error);
      }
    },

    // Установка юзера
    async setUser(data: any) {
      this.users = data;
      localStorage.setItem("user", JSON.stringify(data));
    },

    // Очистка юзера
    async clearUser() {
      this.$reset();
      localStorage.removeItem("user");
    },

    // Получение всех юзеров
    async fetchAllUsers() {
      try {
        const response = await api.get("/wp-json/wp/v2/users", {
          params: { per_page: 100 },
        });
        this.usersList = response.data;
      } catch (error) {
        console.error("❌ Ошибка при получении списка пользователей:", error);
      }
    },

    // Получение текущего юзера
    async fetchUserInfo() {
      if (this.auth) {
        await this.refreshToken();
        try {
          const response = await api.get("/wp-json/wp/v2/users/me");
          this.setUser({ ...this.users, userInfo: response.data });
        } catch (error) {
          console.error("❌ Failed to fetch user info:", error);
        }
      }
    },
  },

  persist: true,
});

// экспортируем с рефами
export const useUsersStoreRefs = () => storeToRefs(useUsersStore());
