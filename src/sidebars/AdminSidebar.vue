<template>
  <div
    id="sidebar"
    class="w-64 h-full bg-gray-50 min-h-[100dvh] py-4 dark:bg-gray-800 sticky top-0 left-00"
  >
    <div id="logo" class="ml-6 text-lg font-bold dark:text-white">Gleede CRM</div>
    <Navigation :nav="nav" class="mt-6" />
  </div>
</template>

<script setup lang="ts">
import Navigation from "@/components/ui/list/Navigation.vue";
import { ref } from "vue";

const nav = ref<any>([
  {
    name: "Dashboard",
    to: "/Dashboard",
    icon: "ion:home",
  },
  {
    name: "Лиды",
    to: "/leads",
    icon: "simple-icons:googleads",
  },
  {
    name: "Сделки",
    to: "/deals",
    icon: "mdi:deal",
  },
  {
    name: "Статистика",
    to: "/analytics",
    icon: "mdi:analytics",
  },
  {
    name: "Сотрудники",
    to: "/works",
    icon: "raphael:people",
  },
  {
    name: "Настройки",
    to: "/settings",
    icon: "material-symbols:settings-rounded",
  },
]);
</script>
