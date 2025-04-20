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
        const { data } = await api.get("/wp-json/work/v1/all");
        this.works = data;
      } catch (error) {
        console.error("Ошибка при получении задач:", error);
      }
    },
    async fetchMyTasks() {
      try {
        const { data } = await api.get("/wp-json/work/v1/my");
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

    async toggleChecklistItem(workId: number, index: number, value: boolean) {
      try {
        await api.post("/wp-json/work/v1/toggle-checklist", {
          id: workId,
          index,
          val: value,
        });
    
        await this.fetchOne(workId);
      } catch (error) {
        console.error("Ошибка при обновлении чеклиста:", error);
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
        if (this.work?.id === id) {
          await this.fetchOne(id);
        }
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
        if (this.work?.id === id) {
          await this.fetchOne(id);
        }
        await this.fetchAll();
        return data;
      } catch (error) {
        console.error("Ошибка при завершении задачи:", error);
      }
    },

    async pause(id: number) {
      try {
        const { data } = await api.post(`/wp-json/work/v1/pause/${id}`);
        if (this.work?.id === id) {
          await this.fetchOne(id);
        }
        await this.fetchAll();
        return data;
      } catch (error) {
        console.error("Ошибка при постановке задачи на паузу:", error);
      }
    },

    async start(id: number) {
            try {
              // можно либо вызвать отдельный API, либо:
              await api.put(`/wp-json/work/v1/update/${id}`, {
                ...this.work.meta,
                status: 'in_progress'
              });
              await this.fetchAll();
              if (this.work?.id === id) {
                await this.fetchOne(id);
              }
            } catch (error) {
              console.error("Ошибка при старте задачи:", error);
            }
        },
  },
});

export const useWorkStoreRefs = () => storeToRefs(useWorkStore());