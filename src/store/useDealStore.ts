import { defineStore, storeToRefs } from "pinia";
import { api } from "@/api/api";

export const useDealStore = defineStore("deals", {
  state: () => ({
    deals: [] as any[],
    deal: null as any,
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
    page: 1,
    perPage: "10" as any,
    totalPages: 1 as any,
    selectedCategory: "",
    selectedStatus: "",
    selectedCity: "",
    searchQuery: "",
    selectedDate: null,
    isLoading: false,
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
    
        // 1. Обновляем список сделок (this.deals)
        const index = this.deals.findIndex((item) => item.id === id);
        if (index !== -1) {
          this.deals[index] = {
            ...this.deals[index],
            acf: {
              ...this.deals[index].acf,
              ...fields,
            },
          };
        }
    
        // 2. Если текущая сделка (this.deal) совпадает по ID — обновляем и её
        if (this.deal?.id === id) {
          this.deal = {
            ...this.deal,
            acf: {
              ...this.deal.acf,
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

    async getDealById(id: any) {
      try {
        const response = await api.get(`/wp-json/custom/v1/deal/${id}`);
        this.deal = response.data
      } catch (error) {
        console.error(`Failed to fetch deal with id ${id}:`, error);
        return null;
      }
    },

  },
});

export const useDealStoreRefs = () => storeToRefs(useDealStore());
