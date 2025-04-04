<template>
  <span
    class="absolute [writing-mode:vertical-lr] top-1/2 left-0 -translate-y-1/2 h-full w-8 flex items-center justify-center rotate-180 text-[10px] text-white font-medium"
    :class="statusClass"
  >
    {{ status }}
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  status: string;
}>();

const statusColors: Record<string, string> = {
  Новый: "bg-purple-600",
  "Не актуально": "bg-gray-400",
  Перезвонить: "bg-yellow-400",
  "Не дозвонился": "bg-red-500",
  "В обработке": "bg-blue-500",
  "В работе": "bg-indigo-500",
  Клиент: "bg-green-600",
};

const statusClass = computed(() => {
  return statusColors[props.status] || "bg-gray-300";
});
</script>
