<template>
  <component :is="layoutComponent" :class="{ fixed: isAnyModalActive }">
    <router-view />
    <Modal :positionX="modalPositionX" />
  </component>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import EmptyLayout from "@/layouts/EmptyLayout.vue";
import Modal from "./components/modal/Modal.vue";
import { useModalStoreRefs } from "./store/useModalStore";
import { useUsersStore } from "./store/useUserStore";

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
</style>
