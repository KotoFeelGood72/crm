import { defineStore, storeToRefs } from "pinia";
import { api } from "@/api/api";

export interface NotificationMeta {
  [key: string]: string | number | boolean;
}

export interface Notification {
  id: number;
  title: string;
  content: string;
  date?: string;
  author_id?: number;
  meta?: NotificationMeta;
}

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [] as Notification[],
    current: null as Notification | null,
  }),
  actions: {
    /**
     * Загрузить список уведомлений
     */
    async fetchNotifications() {
      const resp = await api.get<Notification[]>("/wp-json/notification/v1/list");
      this.notifications = resp.data;
    },

    /**
     * Загрузить одно уведомление по ID
     */
    async fetchNotification(id: number) {
      const resp = await api.get<Notification>(`/wp-json/notification/v1/get/${id}`);
      this.current = resp.data;
    },

    /**
     * Создать новое уведомление
     */
    async createNotification(payload: { title: string; content: string; meta?: NotificationMeta }) {
      const resp = await api.post<{ id: number; message: string }>(
        "/wp-json/notification/v1/create",
        { title: payload.title, content: payload.content, meta: payload.meta }
      );
      await this.fetchNotifications();
      return resp.data;
    },

    /**
     * Обновить уведомление
     */
    async updateNotification(id: number, payload: { title?: string; content?: string; meta?: NotificationMeta }) {
      const resp = await api.put<{ id: number; message: string }>(
        `/wp-json/notification/v1/update/${id}`,
        payload
      );
      await this.fetchNotifications();
      return resp.data;
    },

    /**
     * Удалить уведомление
     */
    async deleteNotification(id: number) {
      const resp = await api.delete<{ id: number; message: string }>(
        `/wp-json/notification/v1/delete/${id}`
      );
      this.notifications = this.notifications.filter(n => n.id !== id);
      return resp.data;
    },

    /**
     * Отметить уведомление как прочитанное
     */
    async markAsRead(id: number) {
      const resp = await api.put(`/wp-json/notification/v1/update/${id}`, {
        meta: { is_read: true }
      });
      const idx = this.notifications.findIndex(n => n.id === id);
      if (idx !== -1) {
        (this.notifications[idx].meta ||= {})['is_read'] = true;
      }
      return resp.data;
    },

    /**
     * Отметить все уведомления текущего пользователя как прочитанные
     */
    async markAllAsRead() {
      const resp = await api.post<{ updated: number[] }>(
        "/wp-json/notification/v1/read-all"
      );
      this.notifications.forEach(n => {
        (n.meta ||= {})['is_read'] = true;
      });
      return resp.data;
    }
  },
});

// экспортируем с рефами
export const useNotificationStoreRefs = () => storeToRefs(useNotificationStore());