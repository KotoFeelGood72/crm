import { defineStore, storeToRefs } from "pinia";
import { api } from "@/api/api";
import { statusList } from "@/api/data";

export const useLeadsStore = defineStore("leads", {
  state: () => ({
    clients: [] as any[],
    leads: [] as any[],
    lead: null as any,
    categories: [] as any[],
    statuses: statusList as any[],
    cities: [
      { name: "Тверь", id: "Тверь" },
      { name: "Краснодар", id: "Краснодар" },
      { name: "Москва", id: "Москва" },
      { name: "Ростов на Дону", id: "Ростов на Дону" },
      { name: "Пермь", id: "Пермь" },
      { name: "Казань", id: "Казань" },
    ],
    perPageOptions: [
      { name: "10", id: "10" },
      { name: "20", id: "20" },
      { name: "30", id: "30" },
      { name: "40", id: "40" },
      { name: "50", id: "50" },
      { name: "100", id: "100" },
    ],
    hasWebsiteOptions: [
      { name: "Есть сайт", id: "1" },
      { name: "Нет сайта", id: "0" },
    ],
    page: 1,
    perPage: "10" as any,
    totalPages: 1 as any,
    selectedCategory: "",
    selectedStatus: "Новый",
    selectedCity: "",
    hasWebsite: "",
    searchQuery: "",
    searchPhone: "",
    selectedDate: null, // Добавляем переменную для выбранной даты
    isLoading: false,
  }),
  actions: {
    async getLeads() {
      try {
        const params: Record<string, any> = {
          page: this.page,
          per_page: this.perPage,
          ...(this.selectedCategory && {
            theme_bussines: this.selectedCategory,
          }),
          ...(this.selectedStatus && { statuses: this.selectedStatus }),
          ...(this.selectedCity && { city: this.selectedCity }),
          ...(this.hasWebsite && { has_website: this.hasWebsite }),
          ...(this.searchQuery && { search: this.searchQuery }),
          ...(this.searchPhone && { phone: this.searchPhone }),
          ...(this.selectedDate
            ? { callback_date: this.formatDate(this.selectedDate) }
            : {}),
        };

        const response = await api.get("/wp-json/wp/v2/client_new", { params });

        this.leads = response.data;
        this.totalPages = Math.ceil(
          response.headers["x-wp-total"] / this.perPage
        );
      } catch (error) {
        console.error("Ошибка при получении лидов:", error);
      }
    },
    async getClients() {
      this.isLoading = true;
      try {
        const params: any = {
          page: this.page,
          per_page: this.perPage,
        };

        if (this.selectedCategory) {
          params.theme_bussines = this.selectedCategory;
        }

        if (this.selectedStatus) {
          params.statuses = this.selectedStatus;
        }

        if (this.selectedCity) {
          params.city = this.selectedCity;
        }

        if (this.hasWebsite) {
          params.has_website = this.hasWebsite;
        }

        if (this.searchQuery) {
          params.search = this.searchQuery;
        }

        if (this.searchPhone) {
          params.phone = this.searchPhone;
        }

        if (this.selectedDate) {
          params.callback_date = this.formatDate(this.selectedDate);
        }

        const response = await api.get("/wp-json/wp/v2/client_new", { params });
        this.clients = response.data;
        this.totalPages = Math.ceil(
          response.headers["x-wp-total"] / this.perPage
        );
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    async getLeadById(id: any): Promise<any> {
      try {
        const response = await api.get(`/wp-json/wp/v2/client_new/${id}`);
        return response.data;
      } catch (error) {
        console.error(`❌ Ошибка при получении лида #${id}:`, error);
        throw error;
      }
    },

    async createClient(newClient: any) {
      try {
        const response = await api.post("/wp-json/custom/v1/create-client", {
          name: newClient.name,
          description: newClient.description,
          schedule: newClient.schedule,
          address: newClient.address,
          category: newClient.category,
          city: newClient.city,
          phone_list: newClient.phone_list,
          whatsapps_list: newClient.whatsapps_list,
          telegrams_list: newClient.telegrams_list,
          emails_list: newClient.emails_list,
          websites_list: newClient.websites_list,
          vk: newClient.vk,
          youtube: newClient.youtube,
          spring: newClient.spring,
          times: newClient.times,
          reviews_count: newClient.reviews_count,
          stars: newClient.stars,
          is_ads: newClient.is_ads,
          status: "Новый",
        });

        // Обновляем список клиентов
        await this.getClients();

        return response.data;
      } catch (error) {
        // console.error("Ошибка при создании клиента:", error);
        throw error;
      }
    },
    formatDate(date: any) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${year}-${month}-${day}`;
    },

    getStatusClass(status: string) {
      switch (status) {
        case "Новый":
          return "status-new";
        case "В обработке":
          return "status-processing";
        case "В работе":
          return "status-working";
        case "Клиент":
          return "status-client";
        case "Не актуально":
          return "status-not-relevant";
        default:
          return "";
      }
    },

    async getCategories() {
      try {
        const response = await api.get(
          "/wp-json/wp/v2/theme_bussines/?per_page=100"
        );
        this.categories = response.data;
      } catch (error) {
        console.error("Failed to get categories:", error);
      }
    },

    async updateLead(id: number, fields: Record<string, any>) {
      try {
        const index = this.leads.findIndex((item) => item.id === id);
        if (index === -1) throw new Error(`Lead #${id} not found`);

        const current = this.leads[index];
        const changes: Record<string, any> = {};

        // Обычные поля, если они есть (например, email)
        if (fields.email && fields.email !== current.email) {
          changes.email = fields.email;
        }

        // ACF-поля
        Object.entries(fields).forEach(([key, value]) => {
          if (key === "email") return; // уже обработали
          const currentValue = current.acf?.[key];

          if (JSON.stringify(value) !== JSON.stringify(currentValue)) {
            changes[key] = value;
          }
        });

        if (!Object.keys(changes).length) {
          console.log("🟡 Нет изменений для обновления");
          return;
        }

        await api.post(`/wp-json/custom/v1/update-client/${id}`, changes);

        // Обновляем локально
        this.leads[index] = {
          ...current,
          email: changes.email ?? current.email,
          acf: {
            ...current.acf,
            ...changes,
          },
        };

        if (this.lead?.id === id) {
          this.lead = this.leads[index];
        }

        console.log("✅ Лид обновлён:", changes);
      } catch (error) {
        console.error(`❌ Ошибка при обновлении лида #${id}:`, error);
        throw error;
      }
    },
    async deleteLead(leadId: number) {
      try {
        await api.delete(`/wp-json/custom/v1/delete-client/${leadId}`);
        this.leads = this.leads.filter((lead) => lead.id !== leadId);
      } catch (error) {
        console.error(`Failed to delete client ${leadId}:`, error);
      }
    },

    updateCategory(category: string) {
      this.selectedCategory = category;
      this.page = 1;
      this.getClients();
    },

    updateStatus(status: string) {
      this.selectedStatus = status;
      this.page = 1;
      this.getClients();
    },

    updateCity(city: string) {
      this.selectedCity = city;
      this.page = 1;
      this.getClients();
    },

    updateHasWebsite(hasWebsite: string) {
      this.hasWebsite = hasWebsite;
      this.page = 1;
      this.getClients();
    },

    updateSearchQuery(query: string) {
      this.searchQuery = query;
      this.page = 1;
      this.getClients();
    },

    updateSearchPhone(phone: string) {
      this.searchPhone = phone;
      this.page = 1;
      this.getClients();
    },

    updatePerPage(perPage: any) {
      this.perPage = perPage;
      this.page = 1;
      this.getLeads();
    },

    updatePage(newPage: number) {
      this.page = newPage;
      this.getLeads();
    },

    updateSelectedDate(date: any) {
      this.selectedDate = date;
      this.page = 1;
      this.getClients();
    },

    clearFilters() {
      this.selectedCategory = "";
      this.selectedStatus = "";
      this.selectedCity = "";
      this.hasWebsite = "";
      this.page = 1;
      this.perPage = "10";
      this.searchQuery = "";
      this.searchPhone = "";
      this.getClients();
    },
    updateClientInStore(updatedClient: any) {
      const index = this.clients.findIndex(
        (client) => client.id === updatedClient.id
      );
      if (index !== -1) {
        this.clients[index] = { ...this.clients[index], ...updatedClient };
      }
    },
    async updateClientStatus(clientId: number, newStatus: string) {
      try {
        const clientIndex = this.clients.findIndex(
          (client) => client.id === clientId
        );
        if (clientIndex === -1) return;

        // Отправка обновлённого статуса на сервер
        await api.post(`/wp-json/custom/v1/update-client/${clientId}`, {
          status: newStatus,
        });

        // const currentClient = this.clients[clientIndex];

        // Если клиент стал "Клиент" — удаляем из списка
        if (newStatus === "Клиент") {
          this.clients.splice(clientIndex, 1);
          console.log(
            `Клиент #${clientId} перемещён в сделки и удалён из стора`
          );
          return;
        }

        // Обновляем статус клиента
        this.clients[clientIndex].acf.status = newStatus;

        // Если активный фильтр по статусу больше не совпадает — удаляем карточку из текущего списка
        if (this.selectedStatus && newStatus !== this.selectedStatus) {
          this.clients.splice(clientIndex, 1);
          console.log(
            `Клиент #${clientId} обновлён до статуса ${newStatus} и скрыт из текущего фильтра`
          );
        }
      } catch (error) {
        console.error(
          `Ошибка при обновлении статуса клиента ${clientId}:`,
          error
        );
      }
    },
  },
});

export const useLeadsStoreRefs = () => storeToRefs(useLeadsStore());
