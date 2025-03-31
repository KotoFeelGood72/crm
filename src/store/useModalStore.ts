import { defineStore, storeToRefs } from "pinia";

interface ModalsState {
  client: boolean;
  qr: boolean;
  user: boolean;
  create: boolean;
  filter: boolean;
  deal: boolean;
}

export const useModalStore = defineStore("modal", {
  state: (): { modals: any } => ({
    modals: {
      client: false,
      user: false,
      qr: false,
      create: false,
      filter: false,
      deal: false,
    },
  }),
  actions: {
    openModal(modalName: keyof ModalsState) {
      this.modals[modalName] = true;
    },
    closeModal(modalName: keyof ModalsState, router?: any): void {
      this.modals[modalName] = false;
      this.clearQueryParams(router);
    },
    closeAllModals() {
      Object.keys(this.modals).forEach((modalName) => {
        // if (modalName !== "AlertPromo" && modalName !== "AlertSquare") {
        this.modals[modalName as keyof any] = false;
        // }
      });
    },
    clearQueryParams(router: any) {
      const query = { ...router.currentRoute.value.query };
      delete query.client;
      delete query.phone;
      router.replace({ query });
    },
  },
});

export const useModalStoreRefs = () => storeToRefs(useModalStore());
