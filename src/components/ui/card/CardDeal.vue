<template>
  <n-card size="small" hoverable>
    <div class="flex gap-1 mb-4">
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="h-2 flex-1 rounded-full bg-blue-500"></div>
        </template>
        Новый
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="h-2 flex-1 rounded-full bg-green-500"></div>
        </template>
        В работе
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="h-2 flex-1 rounded-full bg-yellow-500"></div>
        </template>
        Оплата
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="h-2 flex-1 rounded-full bg-red-500"></div>
        </template>
        Завершение
      </n-tooltip>
    </div>
    <div class="flex items-center justify-between mb-1">
      <div class="text-xs">27.05.2021</div>
      <n-dropdown trigger="hover" :options="options">
        <Icons icon="solar:menu-dots-bold" :size="14" color="inherit" />
      </n-dropdown>
    </div>
    <div class="text-xs mb-4">{{ card.acf.name }}</div>
    <div class="flex items-center gap-1 mt-1 flex-wrap">
      <n-tag
        :bordered="false"
        type="success"
        size="small"
        style="font-size: 10px"
      >
        Контекстная реклама
      </n-tag>
      <n-tag
        :bordered="false"
        type="success"
        size="small"
        style="font-size: 10px"
      >
        150 000
      </n-tag>
      <n-tag
        :bordered="false"
        type="success"
        size="small"
        style="font-size: 10px"
      >
        +7 (961) 531-13-86 - Виктор
      </n-tag>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useModalStore } from "@/store/useModalStore";

defineProps<{
  card?: any;
}>();

const options = ref<any>([
  {
    label: "Редактировать",
    key: "edit",
  },
  {
    label: "Удалить",
    key: "delete",
  },
]);

const { openModal } = useModalStore();
</script>
