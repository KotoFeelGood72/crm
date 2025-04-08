<template>
  <div
    class="flex items-center justify-between text-gray-400 bg-gray-700 px-4 py-2 rounded-md relative"
  >
    <div class="text-sm font-semibold">{{ name }}</div>
    <div class="flex items-center gap-2">
      <div
        class="w-6 h-6 justify-center flex items-center bg-gray-500 text-white rounded-full text-[10px] font-semibold absolute -top-2 -left-2 shadow-lg"
      >
        {{ count }}
      </div>
      <IconBtn
        icon="ep:plus"
        class="inline-flex items-center justify-center w-6 h-6 text-gray-400 rounded dark:hover:text-gray-200 hover:text-gray-700"
        :icon-size="18"
        @click="handleClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import IconBtn from "../buttons/IconBtn.vue";
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
