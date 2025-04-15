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
    async updateProfile(data: any) {
      try {
        // Обновляем стандартные поля пользователя через WP REST API
        const response = await api.post("/wp-json/wp/v2/users/me", data);
        let updatedProfile = response.data;

        // Если переданы ACF данные – обновляем их
        if (data.acf) {
          const acfResponse = await api.post(
            `/wp-json/acf/v2/users/${updatedProfile.id}`,
            { acf: data.acf }
          );
          updatedProfile.acf = acfResponse.data.acf || {};
        }

        this.profile = updatedProfile;
        return updatedProfile;
      } catch (error) {
        console.error("Failed to update profile:", error);
        throw error;
      }
    },

    // Отдельное обновление ACF полей пользователя
    async updateACF(acfData: any) {
      try {
        if (!this.profile || !this.profile.id) {
          throw new Error("Профиль не найден");
        }
        const response = await api.post(
          `/wp-json/acf/v2/users/${this.profile.id}`,
          { acf: acfData }
        );
        // Обновляем объект профиля с новыми ACF значениями
        this.profile.acf = response.data.acf || {};
        return this.profile.acf;
      } catch (error) {
        console.error("Failed to update ACF fields:", error);
        throw error;
      }
    },

    // Обновление пароля пользователя.
    // Обратите внимание: обновление пароля через REST API может требовать дополнительных настроек или использования кастомных эндпоинтов.
    async updatePassword(newPassword: string) {
      try {
        if (!this.profile || !this.profile.id) {
          throw new Error("Профиль не найден");
        }
        // Обычно для смены пароля используется запись в поле user_pass.
        // Здесь используется POST-запрос к эндпоинту текущего пользователя.
        const response = await api.post("/wp-json/wp/v2/users/me", {
          password: newPassword,
        });
        // Если запрос успешен, можно вернуть сообщение или обновлённый профиль
        this.profile = { ...this.profile, ...response.data };
        return response.data;
      } catch (error) {
        console.error("Failed to update password:", error);
        throw error;
      }
    },

    // Дополнительный метод для удаления профиля можно добавить, если требуется.
    // Например, если админ может удалить пользователя через REST API.
    async deleteProfile(userId: number) {
      try {
        const response = await api.delete(`/wp-json/wp/v2/users/${userId}`);
        // После успешного удаления можно очистить профиль из стора
        if (this.profile && this.profile.id === userId) {
          this.profile = null;
        }
        return response.data;
      } catch (error) {
        console.error("Failed to delete profile:", error);
        throw error;
      }
    },
  },
  persist: true,
});

export const useProfileStoreRefs = () => storeToRefs(useProfileStore());
