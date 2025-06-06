<template>
  <n-config-provider :theme="theme" :locale="ruRU" :date-locale="dateRu">
    <n-global-style />
    <n-notification-provider>
      <n-message-provider>
        <component :is="layoutComponent">
          <router-view />
          <!-- <Modal :positionX="modalPositionX" /> -->
          <Transition name="fade-bg">
            <div v-if="isAnyModalActive" class="bg"></div>
          </Transition>
        </component>
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
// @ts-ignore
import { ruRU } from "naive-ui";
import { ru as dateRu } from "date-fns/locale";
import "vue3-toastify/dist/index.css";
import { computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
// import AdminLayout from "@/layouts/AdminLayout.vue";
// import DefaultLayout from "@/layouts/DefaultLayout.vue";
import EmptyLayout from "@/layouts/EmptyLayout.vue";
import OwnerLayouts from "./layouts/OwnerLayouts.vue";
// import Modal from "./components/modal/Modal.vue";
import { useModalStoreRefs } from "./store/useModalStore";
import { useUsersStore } from "./store/useUserStore";
// import "vue-skeletor/dist/vue-skeletor.css";
// import { useFirebaseNotifications } from "@/composables/useNotifications";
import { useNotifications } from "@/composables/useNotifications";
import { useScrollLock } from "@/composables/useLockScreen";
import { useSettingsStore } from "./store/useSettingsStore";
import { useTheme } from "@/composables/useTheme";

const { theme } = useTheme();
const { lockScroll, unlockScroll } = useScrollLock();

const { currentToken, incomingPayload } = useNotifications();

// const { requestPermission } = useFirebaseNotifications();
const { getSettings } = useSettingsStore();

const { modals } = useModalStoreRefs();
const { fetchUserInfo } = useUsersStore();
const isAnyModalActive = computed(() => {
  return Object.values(modals.value).some((value) => value);
});
const isCart = computed(() => modals.value.client);
const isQr = computed(() => modals.value.qr);
const isFilter = computed(() => modals.value.filter);

const modalPositionX = computed(() => {
  switch (true) {
    case isCart.value:
      return "right";
    case isQr.value:
      return "right";
    case isFilter.value:
      return "right";
    default:
      return "center";
  }
});

const route = useRoute();

const layoutComponent = computed(() => {
  switch (route.meta.layout) {
    case "owner":
      return OwnerLayouts;
    case "empty":
      return EmptyLayout;
    default:
      return OwnerLayouts;
  }
});

watch(
  () => isAnyModalActive.value,
  (visible) => {
    visible ? lockScroll() : unlockScroll();
  }
);

onMounted(async () => {
  await fetchUserInfo();
  await getSettings();
});

watch(incomingPayload, (payload) => {
  if (payload) {
    // toast.info(payload.notification?.title || "Уведомление", {
    //   description: payload.notification?.body,
    // });
  }
});
</script>

<style lang="scss">
html,
body,
#app {
  overflow: hidden !important;
}
.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000000a6;
  z-index: 99;
}

.tooltip-holder {
  display: flex;
  justify-content: center;
  width: 100%;
}
.tooltip-holder div {
  width: 100%;
}

html {
  font-family: "Montserrat", sans-serif;
  width: 100%;
}

body {
  font-family: "Montserrat", sans-serif;
}

.fade-bg-enter-active,
.fade-bg-leave-active {
  transition: opacity 0.3s ease;
}

.fade-bg-enter-from,
.fade-bg-leave-to {
  opacity: 0;
}

.fade-bg-enter-to,
.fade-bg-leave-from {
  opacity: 1;
}
</style>
