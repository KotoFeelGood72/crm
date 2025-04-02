import { defineStore, storeToRefs } from "pinia";
import { api } from "@/api/api";
interface Task {
  id?: number;
  deal_id: number;
  title: string;
  date: string;
  time: string;
  done: boolean;
}
export const useTaskStore = defineStore("tasks", {
  state: () => ({
    tasks: [] as Task[],
  }),
  actions: {
    async getTasks(dealId: number) {
      try {
        const res = await api.get(`/wp-json/custom/v1/tasks?deal_id=${dealId}`);
        this.tasks = res.data;
      } catch (err) {
        console.error("Не удалось загрузить дела", err);
      }
    },
    async createTask(task: Task) {
      try {
        const res = await api.post(`/wp-json/custom/v1/tasks`, task);
        const newTask = res.data.task;
    
        if (newTask && newTask.id) {
          this.tasks.push(newTask);
        }
      } catch (err) {
        console.error("Не удалось создать задачу", err);
      }
    },
    async updateTask(id: number, updates: Partial<Task>) {
      await api.post(`/wp-json/custom/v1/tasks/${id}`, updates);
      this.tasks = this.tasks.map(t => t.id === id ? { ...t, ...updates } : t);
    },
    async deleteTask(id: number) {
      await api.delete(`/wp-json/custom/v1/delete-task/${id}`);
      this.tasks = this.tasks.filter(t => t.id !== id);
    },
  },
});

export const useTaskStoreRefs = () => storeToRefs(useTaskStore());