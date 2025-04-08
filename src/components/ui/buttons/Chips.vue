<template>
  <div
    :class="chipClasses"
    class="flex items-center gap-1 px-[8px] py-[1px] rounded-full text-sm font-medium w-fit"
  >
    <Icons v-if="icon" :icon="icon" :size="14" color="inherit" />
    <span class="inline-flex text-[10px]">{{ name }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
const props = withDefaults(
  defineProps<{
    icon?: string;
    name: string;
    color?: "primary" | "success" | "danger" | "warning" | "gray";
  }>(),
  {
    icon: "",
    name: "",
    color: "primary", // default
  }
);

const chipClasses = computed(() => {
  const base = {
    primary: "bg-purple-500 text-white",
    success: "bg-green-500 text-white",
    danger: "bg-red-500 text-white",
    warning: "bg-yellow-400 text-black",
    gray: "bg-gray-300 text-black",
  };

  return base[props.color] || base.gray;
});
</script>
