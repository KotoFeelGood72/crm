import { defineStore, storeToRefs } from "pinia";
import { api } from "@/api/api";

export const useCalendarStore = defineStore("calendar", {
  state: () => ({
    // Массив задач календаря
    tasks: [] as any[],
    // Текущая выбранная задача
    task: null as any,
    // Статусы (например, приоритет или срочность задачи)
    statuses: [
      { name: "Низкая", id: "low" },
      { name: "Средняя", id: "medium" },
      { name: "Высокая", id: "high" },
    ],
    page: 1,
    perPage: "10" as any,
    totalPages: 1 as any,
    // Можно фильтровать задачи по дате (например, показывать задачи на выбранный день)
    selectedDate: null as Date | null,
    isLoading: false,
  }),
  actions: {
    // Получение списка задач календаря
    async getTasks() {
      this.isLoading = true;
      try {
        const params: any = {
          page: this.page,
          per_page: this.perPage,
        };
        if (this.selectedDate) {
          params.date = this.formatDate(this.selectedDate);
        }
        // GET запрос по эндпоинту календаря
        const response = await api.get("/wp-json/calendar/v1/tasks", {
          params,
        });
        this.tasks = response.data;
        // Если в заголовке ответа есть общее количество (x-wp-total)
        if (response.headers && response.headers["x-wp-total"]) {
          this.totalPages = Math.ceil(
            response.headers["x-wp-total"] / this.perPage
          );
        }
      } catch (error) {
        console.error("Failed to get tasks:", error);
      } finally {
        this.isLoading = false;
      }
    },

    // Форматирование даты в формат YYYY-MM-DD
    formatDate(date: Date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },

    // Создание новой задачи
    async createTask(taskData: Record<string, any>) {
      try {
        // taskData должен содержать: title, content (опционально), start_date, end_date, status
        const response = await api.post("/wp-json/calendar/v1/tasks", taskData);
        // Добавляем новую задачу в состояние
        this.tasks.push(response.data);
        return response.data;
      } catch (error) {
        console.error("Failed to create task:", error);
        throw error;
      }
    },

    // Обновление задачи по ID
    async updateTask(id: number, fields: Record<string, any>) {
      try {
        const response = await api.put(
          `/wp-json/calendar/v1/tasks/${id}`,
          fields
        );
        // Обновление задачи в списке
        const index = this.tasks.findIndex((item) => item.id === id);
        if (index !== -1) {
          this.tasks[index] = {
            ...this.tasks[index],
            ...response.data,
          };
        }
        // Если редактируемая задача уже выбрана
        if (this.task?.id === id) {
          this.task = response.data;
        }
        return response.data;
      } catch (error) {
        console.error(`Failed to update task ${id}:`, error);
        throw error;
      }
    },

    // Удаление задачи по ID
    async deleteTask(taskId: number) {
      try {
        await api.delete(`/wp-json/calendar/v1/tasks/${taskId}`);
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
      } catch (error) {
        console.error(`Failed to delete task ${taskId}:`, error);
      }
    },

    // Получение задачи по ID
    async getTaskById(id: number) {
      try {
        // Здесь используется стандартный эндпоинт REST API для вашего CPT
        const response = await api.get(`/wp-json/wp/v2/calendar_task/${id}`);
        this.task = response.data;
      } catch (error) {
        console.error(`Failed to fetch task with id ${id}:`, error);
        return null;
      }
    },
  },
});

export const useCalendarStoreRefs = () => storeToRefs(useCalendarStore());
