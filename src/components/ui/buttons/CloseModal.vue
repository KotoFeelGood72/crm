<template>
  <div class="close-modal" @click="closeAllModals(router, route)">
    <Icons icon="ic:round-close" size="18px" color="#424242" />
  </div>
</template>

<script setup lang="ts">
import { useModalStore } from "@/store/useModalStore";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const { closeAllModals } = useModalStore();
</script>

<style scoped lang="scss">
.close-modal {
  width: 40px;
  height: 40px;
  @include flex-center;
  background-color: #fdeded;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: #ffe2e2;
  }
}
</style>
