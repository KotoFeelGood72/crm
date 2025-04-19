<template>
  <n-layout-sider
    :native-scrollbar="false"
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :collapsed="collapsed"
    show-trigger
    @collapse="collapsed = true"
    @expand="collapsed = false"
  >
    <n-space vertical style="height: 100%">
      <!-- Заменили стандартный скролл на авто-скролл контейнера -->
      <n-scrollbar style="height: 100%">
        <n-menu
          v-model:value="activeKey"
          @update:value="handleMenuSelect"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="nav"
          :render-icon="renderMenuIcon"
          :expand-icon="expandIcon"
        />
      </n-scrollbar>
    </n-space>
  </n-layout-sider>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { MenuOption } from "naive-ui";
import { h, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// Текущее активное значение меню (путь)
const activeKey = computed({
  get: () => route.path,
  set: (val: string) => router.push(val),
});

const handleMenuSelect = (key: string) => {
  // router.push уже вызывается в setter activeKey
};

const expandIcon = () =>
  h(Icon, {
    icon: "mdi:chevron-down",
    width: 16,
    height: 16,
  });

const collapsed = ref(false);
const nav = ref<MenuOption[]>([
  {
    label: "Лиды",
    key: "/leads",
    icon: () => h(Icon, { icon: "simple-icons:googleads" }),
    children: [
      { label: "Мои лиды", key: "/leads/my" },
      { label: "Все лиды", key: "/leads/all" },
    ],
  },
  {
    label: "Сделки",
    key: "/deals",
    icon: () => h(Icon, { icon: "mdi:deal" }),
  },
  {
    label: "Статистика",
    key: "/analytics",
    icon: () => h(Icon, { icon: "mdi:analytics" }),
  },
  {
    label: "Чат",
    key: "/chats",
    icon: () => h(Icon, { icon: "mdi:chat" }),
    children: [
      { label: "Мои лиды", key: "/chats/my" },
      { label: "Чаты", key: "/chats/all" },
    ],
  },
  {
    label: "Календарь",
    key: "/managment",
    icon: () => h(Icon, { icon: "clarity:date-line" }),
  },
  {
    label: "Задачи",
    key: "/works",
    icon: () => h(Icon, { icon: "material-symbols-light:task-outline" }),
    children: [
      { label: "Мои задачи", key: "/works/my" },
      { label: "Все задачи", key: "/works/all" },
    ],
  },
  {
    label: "Настройки",
    key: "/settings",
    icon: () => h(Icon, { icon: "material-symbols:settings-rounded" }),
    children: [
      { label: "Профиль", key: "/settings/profile" },
      { label: "Внешний вид", key: "/settings/theme" },
      { label: "Лиды", key: "/settings/leads" },
      { label: "Сделки", key: "/settings/deals" },
      { label: "Роли и права", key: "/settings/roles" },
    ],
  },
  {
    label: "История",
    key: "/history",
    icon: () => h(Icon, { icon: "solar:history-bold" }),
    children: [
      { label: "Моя история", key: "/history/my" },
      { label: "Все истории", key: "/history/all" },
    ],
  },
]);

const renderMenuIcon = (option: MenuOption) => {
  if (typeof option.icon === "function") {
    return option.icon();
  }
  if (typeof option.icon === "string") {
    return h(Icon, { icon: option.icon, width: 20, height: 20 });
  }
  return null;
};
</script>
