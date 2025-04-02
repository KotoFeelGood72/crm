<template>
  <component :is="layoutComponent" :class="{ fixed: isAnyModalActive }">
    <router-view />
    <Modal :positionX="modalPositionX" />
    <Transition name="fade-bg">
      <div v-if="isAnyModalActive" class="bg"></div>
    </Transition>
  </component>
</template>

<script setup lang="ts">
import "vue3-toastify/dist/index.css";
import { computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import EmptyLayout from "@/layouts/EmptyLayout.vue";
import Modal from "./components/modal/Modal.vue";
import { useModalStoreRefs } from "./store/useModalStore";
import { useUsersStore } from "./store/useUserStore";

import { useNotifications } from "@/composables/useNotifications";

const { requestPermission } = useNotifications();

onMounted(() => {
  requestPermission();
});

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
    case "Admin":
      return AdminLayout;
    case "Empty":
      return EmptyLayout;
    default:
      return DefaultLayout;
  }
});

// Watch for changes in isAnyModalActive and toggle the 'fixed' class on body
watch(isAnyModalActive, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add("fixed");
  } else {
    document.documentElement.classList.remove("fixed");
  }
});

onMounted(async () => {
  await fetchUserInfo();
  // if (route.path != "/login") {
  // }
});
</script>

<style lang="scss">
.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000000a6;
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
  &.fixed {
    overflow: hidden;
  }
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
