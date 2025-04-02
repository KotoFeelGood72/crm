import { defineStore, storeToRefs } from "pinia";
import { api } from "@/api/api";

export const useDealStore = defineStore("deals", {
  state: () => ({
    deals: [] as any[],
    categories: [] as any[],
    currentDeal: null as any,
    statuses: [
      { name: "КП", id: "КП" },
      { name: "Отработка возражений", id: "Отработка возражений" },
      { name: "Подготовка документов", id: "Подготовка документов" },
      { name: "Ожидание оплаты", id: "Ожидание оплаты" },
      { name: "Успех", id: "Успех" },
      { name: "Провал", id: "Провал" },
    ],
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
    page: 1,
    perPage: "10" as any,
    totalPages: 1 as any,
    selectedCategory: "",
    selectedStatus: "",
    selectedCity: "",
    searchQuery: "",
    selectedDate: null,
    isLoading: false,
    currentView: "list",
  }),
  actions: {
    async getDeals() {
      this.isLoading = true;
      try {
        const params: any = {
          page: this.page,
          per_page: this.perPage,
        };

        if (this.selectedCategory) params.category = this.selectedCategory;
        if (this.selectedStatus) params.status = this.selectedStatus;
        if (this.selectedCity) params.city = this.selectedCity;
        if (this.searchQuery) params.search = this.searchQuery;
        if (this.selectedDate) params.date = this.formatDate(this.selectedDate);

        const response = await api.get("/wp-json/custom/v1/deals-full", {
          params,
        });
        this.deals = response.data;
        this.totalPages = Math.ceil(
          response.headers["x-wp-total"] / this.perPage
        );
      } catch (error) {
        console.error("Failed to get deals:", error);
      } finally {
        this.isLoading = false;
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
        case "КП":
          return "status-new";
        case "Отработка возражений":
          return "status-working";
        case "Подготовка документов":
          return "status-not-relevant";
        case "Ожидание оплаты":
          return "status-pay";
        case "Успех":
          return "status-closed";
        case "Провал":
          return "status-cancelled";
        default:
          return "";
      }
    },

    async getCategories() {
      try {
        const response = await api.get(
          "/wp-json/wp/v2/deal_category/?per_page=100"
        );
        this.categories = response.data;
      } catch (error) {
        console.error("Failed to get categories:", error);
      }
    },

    async updateDeal(id: number, fields: Record<string, any>) {
      try {
        const response = await api.post(
          `/wp-json/custom/v1/update-deal/${id}`,
          fields
        );
    
        // Обновляем локально в сторе
        const index = this.deals.findIndex((deal) => deal.id === id);
        if (index !== -1) {
          this.deals[index] = {
            ...this.deals[index],
            acf: {
              ...this.deals[index].acf,
              ...fields,
            },
          };
        }
    
        return response.data;
      } catch (error) {
        console.error(`Failed to update deal ${id}:`, error);
        throw error;
      }
    },

    async deleteDeal(dealId: number) {
      try {
        await api.delete(`/wp-json/wp/v2/delete-deal/${dealId}`);
        this.deals = this.deals.filter((deal) => deal.id !== dealId);
      } catch (error) {
        console.error(`Failed to delete deal ${dealId}:`, error);
      }
    },

    setCurrentView(view: string) {
      this.currentView = view;
    },

    updateCategory(category: string) {
      this.selectedCategory = category;
      this.page = 1;
      this.getDeals();
    },

    updateStatus(status: string) {
      this.selectedStatus = status;
      this.page = 1;
      this.getDeals();
    },

    updateCity(city: string) {
      this.selectedCity = city;
      this.page = 1;
      this.getDeals();
    },

    updateSearchQuery(query: string) {
      this.searchQuery = query;
      this.page = 1;
      this.getDeals();
    },

    updatePerPage(perPage: any) {
      this.perPage = perPage;
      this.page = 1;
      this.getDeals();
    },

    updatePage(newPage: number) {
      this.page = newPage;
      this.getDeals();
    },

    updateSelectedDate(date: any) {
      this.selectedDate = date;
      this.page = 1;
      this.getDeals();
    },

    clearFilters() {
      this.selectedCategory = "";
      this.selectedStatus = "";
      this.selectedCity = "";
      this.page = 1;
      this.perPage = "10";
      this.searchQuery = "";
      this.getDeals();
    },

    updateDealInStore(updatedDeal: any) {
      const index = this.deals.findIndex((deal) => deal.id === updatedDeal.id);
      if (index !== -1) {
        this.deals[index] = { ...this.deals[index], ...updatedDeal };
      }
    },

    async getDealById(id: any) {
      try {
        const response = await api.get(`/wp-json/custom/v1/deal/${id}`);
        this.currentDeal = response.data;
      } catch (error) {
        console.error(`Failed to fetch deal with id ${id}:`, error);
        return null;
      }
    },

    async updateDealStatus(dealId: number, newStatus: string) {
      try {
        const index = this.deals.findIndex((deal) => deal.id === dealId);
        if (index === -1) return;

        const updatedDeal = {
          ...this.deals[index],
          acf: { ...this.deals[index].acf, status: newStatus },
        };

        await api.post(`/wp-json/custom/v1/update-deal/${dealId}`, {
          status: newStatus,
        });

        this.deals[index] = updatedDeal;
      } catch (error) {
        console.error(`Failed to update deal status ${dealId}:`, error);
      }
    },
  },
});

export const useDealStoreRefs = () => storeToRefs(useDealStore());
