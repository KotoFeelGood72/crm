import { defineStore, storeToRefs } from "pinia";
import { api } from "@/api/api";

export const useWorkStore = defineStore("work", {
  state: () => ({
    works: [] as any[],
    work: null as any,
  }),
  actions: {
    async fetchAll() {
      try {
        const { data } = await api.get("/wp-json/work/v1/list");
        this.works = data;
      } catch (error) {
        console.error("Ошибка при получении задач:", error);
      }
    },

    async fetchOne(id: number) {
      try {
        const { data } = await api.get(`/wp-json/work/v1/get/${id}`);
        this.work = data;
      } catch (error) {
        console.error("Ошибка при получении задачи:", error);
      }
    },

    async create(payload: any) {
      try {
        const { data } = await api.post("/wp-json/work/v1/create", payload);
        await this.fetchAll();
        return data;
      } catch (error) {
        console.error("Ошибка при создании задачи:", error);
      }
    },

    async update(id: number, payload: any) {
      try {
        const { data } = await api.put(`/wp-json/work/v1/update/${id}`, payload);
        await this.fetchAll();
        return data;
      } catch (error) {
        console.error("Ошибка при обновлении задачи:", error);
      }
    },

    async delete(id: number) {
      try {
        const { data } = await api.delete(`/wp-json/work/v1/delete/${id}`);
        await this.fetchAll();
        return data;
      } catch (error) {
        console.error("Ошибка при удалении задачи:", error);
      }
    },

    async complete(id: number) {
      try {
        const { data } = await api.post(`/wp-json/work/v1/complete/${id}`);
        await this.fetchAll();
        return data;
      } catch (error) {
        console.error("Ошибка при завершении задачи:", error);
      }
    },

    async pause(id: number) {
      try {
        const { data } = await api.post(`/wp-json/work/v1/pause/${id}`);
        await this.fetchAll();
        return data;
      } catch (error) {
        console.error("Ошибка при постановке задачи на паузу:", error);
      }
    },
  },
});

export const useWorkStoreRefs = () => storeToRefs(useWorkStore());