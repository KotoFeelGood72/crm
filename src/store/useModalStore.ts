import { defineStore, storeToRefs } from "pinia";

interface ModalsState {
  client: boolean;
  qr: boolean;
  user: boolean;
  create: boolean;
  filter: boolean;
  deal: boolean;
  note: boolean;
}

export const useModalStore = defineStore("modal", {
  state: (): {
    modals: ModalsState;
    queryCache: Record<string, Record<string, any>>;
  } => ({
    modals: {
      client: false,
      user: false,
      qr: false,
      create: false,
      filter: false,
      deal: false,
      note: false,
    },
    queryCache: {}, // Сохраняем добавленные query для каждой модалки
  }),
  actions: {
    openModal(
      modalName: keyof ModalsState,
      query?: Record<string, any>,
      router?: any
    ) {
      this.modals[modalName] = true;

      if (query && router) {
        this.queryCache[modalName] = query;

        router.replace({
          query: {
            ...router.currentRoute.value.query,
            ...query,
          },
        });
      }
    },

    closeModal(modalName: keyof ModalsState, router?: any): void {
      this.modals[modalName] = false;

      if (router && this.queryCache[modalName]) {
        const currentQuery = { ...router.currentRoute?.value?.query };
        const addedQuery = this.queryCache[modalName];

        Object.keys(addedQuery).forEach((key) => {
          delete currentQuery[key];
        });

        router.replace({ query: currentQuery });

        // Очищаем кэш после удаления
        delete this.queryCache[modalName];
      }
    },

    closeAllModals(router?: any, route?: any) {
      Object.keys(this.modals).forEach((modalName) => {
        this.modals[modalName as keyof ModalsState] = false;
      });

      if (router && route) {
        const currentQuery = { ...route.query };

        Object.values(this.queryCache).forEach((cachedQuery) => {
          Object.keys(cachedQuery).forEach((key) => {
            delete currentQuery[key];
          });
        });

        this.queryCache = {};
        router.replace({ query: currentQuery });
      }
    },
  },
});

export const useModalStoreRefs = () => storeToRefs(useModalStore());
