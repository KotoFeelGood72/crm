import { defineStore, storeToRefs } from "pinia";
import axios from "axios";
import { api } from "@/api/api";

export const useUsersStore = defineStore("user", {
  state: () => ({
    users: null as any,
    auth: null as string | null,
    notifications: [] as any[],
  }),
  actions: {
    async fetchUserNotifications() {
      try {
        const userId = this.users?.userInfo?.id;
        if (!userId) {
          console.warn("Нет userId для загрузки уведомлений");
          return;
        }

        const response = await api.get(`/wp-json/custom/v1/notifications/${userId}`);
        this.notifications = response.data;
        console.log("📩 Notifications fetched:", this.notifications);
      } catch (error) {
        console.error("Ошибка при получении уведомлений:", error);
      }
    },

    async saveFcmToken(token: string) {
      try {
        const response = await api.post("/wp-json/custom/v1/save-fcm-token", {
          token,
        });
        console.log("FCM token saved:", response.data);
      } catch (error) {
        console.error("FCM token save error:", error);
      }
    },

    
    async signIn(user: any) {
      try {
        await axios.post("/wp-json/wp/v2/register/user", user, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Sign in error:", error);
      }
    },
    async login(user: any) {
      // const router = useRouter();
      try {
        const response = await api.post("/wp-json/jwt-auth/v1/token", user, {});
        this.auth = response.data;

        // await router.push('/clients?page=1&view=list&count=10');
      } catch (error) {
        console.log("Login error:", error);
      }
    },
    async refreshToken() {
      try {
        await api.post("/wp-json/jwt-auth/v1/token/validate");
      } catch (error) {
        console.log("Refresh token error:", error);
      }
    },
    // async login(user: any) {
    //   // const router = useRouter();
    //   try {
    //     const response = await api.post("/wp-json/api/v1/token", user, {});
    //     this.auth = response.data;

    //     // await router.push('/clients?page=1&view=list&count=10');
    //   } catch (error) {
    //     console.log("Login error:", error);
    //   }
    // },
    // async refreshToken() {
    //   try {
    //     const response = await api.get("/wp-json/api/v1/token-validate");
    //     console.log(response.data);
    //   } catch (error) {
    //     console.log("Refresh token error:", error);
    //   }
    // },
    async setUser(data: any) {
      this.users = data;
      localStorage.setItem("user", JSON.stringify(data));
    },
    async clearUser() {
      this.$reset();
      localStorage.removeItem("user");
    },
    async fetchUserInfo() {
      if (this.auth) {
        await this.refreshToken();
        try {
          const response = await api.get("/wp-json/wp/v2/users/me", {});
          this.setUser({ ...this.users, userInfo: response.data });
        } catch (error) {
          console.error("Failed to fetch user info:", error);
        }
      }
    },
  },
  persist: true,
});

export const useUsersStoreRefs = () => storeToRefs(useUsersStore());
