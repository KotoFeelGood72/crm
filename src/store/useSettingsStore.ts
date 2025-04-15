import { defineStore, storeToRefs } from "pinia";
import { api } from "@/api/api";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    settings: null as any
  }),
  actions: {
    async getSettings() {
      try {
        const response = await api.get(`/wp-json/acf/v2/options/`);
        this.settings = response.data.acf
      } catch (error) {
        return null;
      }
    },
  },
});

export const useSettingsStoreRefs = () => storeToRefs(useSettingsStore());
