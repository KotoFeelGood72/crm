import { defineStore, storeToRefs } from "pinia";
import { api } from "@/api/api";

export const useProfileStore = defineStore("profile", {
  state: () => ({
    profile: null as any,
  }),
  actions: {
    // Получение профиля текущего пользователя, включая ACF поля
    async getProfile() {
      try {
        // Стандартные данные пользователя
        const response = await api.get("/wp-json/wp/v2/users/me");
        const profileData = response.data;
        // Получаем ACF поля (при условии, что плагин ACF to REST API активен)
        const acfResponse = await api.get(
          `/wp-json/profile/v1/users/${profileData.id}`
        );
        profileData.acf = acfResponse.data.acf || {};
        this.profile = profileData;
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },

    // Обновление профиля пользователя:
    // data может содержать стандартные поля (e.g. email, display_name) и поле acf с ACF данными.
    async updateProfile() {
      try {
        const response = await api.patch(
          `/wp-json/profile/v1/users/${this.profile.id}`,
          this.profile
        );
        // this.profile = response.data;
        return response.data;
      } catch (error) {
        console.error("Failed to update profile:", error);
        throw error;
      }
    },

    // Обновление пароля пользователя.
    async updatePassword(newPassword: string) {
      try {
        if (!this.profile || !this.profile.id) {
          throw new Error("Профиль не найден");
        }
        const response = await api.post("/wp-json/wp/v2/users/me", {
          password: newPassword,
        });
        this.profile = { ...this.profile, ...response.data };
        return response.data;
      } catch (error) {
        console.error("Failed to update password:", error);
        throw error;
      }
    },

    async fetchProfileById(id: number) {
      try {
        const response = await api.get(`/wp-json/profile/v1/users/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch user profile by ID (${id}):`, error);
        return null;
      }
    },

    async fetchAllProfiles() {
      try {
        const response = await api.get("/wp-json/profile/v1/users");
        return response.data;
      } catch (error) {
        console.error("Failed to fetch user list:", error);
        return [];
      }
    },

    

    // Удаление пользователя
    async deleteProfile(userId: number) {
      try {
        const response = await api.delete(`/wp-json/wp/v2/users/${userId}`);
        if (this.profile && this.profile.id === userId) {
          this.profile = null;
        }
        return response.data;
      } catch (error) {
        console.error("Failed to delete profile:", error);
        throw error;
      }
    },

    // Новый метод для загрузки или смены аватара пользователя.
    // Он принимает объект File, формирует FormData и отправляет запрос на сервер.
    async updateAvatar(file: File) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post(
          `/wp-json/profile/v1/users/${this.profile.id}/avatar`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // Обновляем ACF-поле в профиле, если сервер вернул обновлённые данные
        // Например, предполагается, что сервер возвращает acf с обновлённым полем avatar
        if (response.data && response.data.acf) {
          this.profile.acf = response.data.acf;
        }
        return response.data;
      } catch (error) {
        console.error("Failed to update avatar:", error);
        throw error;
      }
    },
  },
  persist: true,
});

export const useProfileStoreRefs = () => storeToRefs(useProfileStore());