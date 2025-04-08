import { defineStore, storeToRefs } from "pinia";
import { api } from "@/api/api";

export const useHistoryStore = defineStore("history", {
  state: () => ({
    history: [] as any[],
    loading: false,
    error: null as any,
  }),

  actions: {
    // 1. История текущего пользователя
    async fetchMyHistory() {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.get("/wp-json/history/v1/logs");
        this.history = res.data;
      } catch (err) {
        this.error = err;
        console.error("Ошибка загрузки истории:", err);
      } finally {
        this.loading = false;
      }
    },

    // 2. История по конкретному пользователю
    async fetchHistoryByUser(userId: number) {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.get(`/wp-json/history/v1/logs?user_id=${userId}`);
        this.history = res.data;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },

    // 3. Все истории (только для админов)
    async fetchAllHistory() {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.get("/wp-json/history/v1/all");
        this.history = res.data;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },

    clearHistory() {
      this.history = [];
    },
  },
});

export const useHistoryStoreRefs = () => storeToRefs(useHistoryStore());
