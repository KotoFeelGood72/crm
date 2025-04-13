<template>
  <n-card size="small" class="relative" hoverable>
    <n-row class="flex items-center justify-between">
      <div>{{ name }}</div>
      <n-float-button
        position="relative"
        @click="handleClick"
        height="24"
        width="24"
      >
        <Icons icon="ep:plus" :size="14" />
      </n-float-button>
    </n-row>
  </n-card>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";
defineProps<{
  name?: string;
  count?: string;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();
const handleClick = () => {
  emit("click");
};
</script>
