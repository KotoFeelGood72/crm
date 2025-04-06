import { defineStore, storeToRefs } from "pinia";

interface ModalsState {
  client: boolean;
  qr: boolean;
  user: boolean;
  create: boolean;
  filter: boolean;
  deal: boolean;
  note: boolean;
  comment: boolean;
  standart: boolean;
  status: boolean;
  commentary: boolean;
}

export const useModalStore = defineStore("modal", {
  state: (): {
    modals: ModalsState;
    queryCache: Record<string, Record<string, any>>;
    current: any; // Храним текущий контент
  } => ({
    modals: {
      client: false,
      user: false,
      qr: false,
      create: false,
      filter: false,
      deal: false,
      note: false,
      comment: false,
      standart: false,
      status: false,
      commentary: false,
    },
    queryCache: {},
    current: null,
  }),

  actions: {
    openModal(
      modalName: keyof ModalsState,
      content?: any,
      query?: Record<string, any>,
      router?: any
    ) {
      this.modals[modalName] = true;
      this.current = content || null;

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
      this.current = null;

      if (router && this.queryCache[modalName]) {
        const currentQuery = { ...router.currentRoute?.value?.query };
        const addedQuery = this.queryCache[modalName];

        Object.keys(addedQuery).forEach((key) => {
          delete currentQuery[key];
        });

        router.replace({ query: currentQuery });
        delete this.queryCache[modalName];
      }
    },

    closeAllModals(router?: any, route?: any) {
      Object.keys(this.modals).forEach((modalName) => {
        this.modals[modalName as keyof ModalsState] = false;
      });

      this.current = null;

      if (router && route) {
        const currentQuery = { ...route.query };

        console.log(currentQuery);
        // Сначала удалить из query всё, что было в кэше
        for (const modal in this.queryCache) {
          const cachedQuery = this.queryCache[modal as keyof ModalsState];
          Object.keys(cachedQuery).forEach((key) => {
            delete currentQuery[key];
          });
        }

        // Только теперь очищаем кэш и делаем router.replace
        this.queryCache = {};
        router.replace({ query: currentQuery });
      }
    },
  },
});

export const useModalStoreRefs = () => storeToRefs(useModalStore());
