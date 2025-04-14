<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :collapsed="collapsed"
    show-trigger
    @collapse="collapsed = true"
    @expand="collapsed = false"
  >
    <n-space vertical>
      <n-menu
        @update:value="handleMenuSelect"
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="nav"
        :render-icon="renderMenuIcon"
        :expand-icon="expandIcon"
      />
    </n-space>
  </n-layout-sider>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { MenuOption } from "naive-ui";
import { h, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const handleMenuSelect = (key: string) => {
  router.push(key);
};

const expandIcon = () =>
  h(Icon, {
    icon: "mdi:chevron-down",
    width: 16,
    height: 16,
  });

const collapsed = ref<any>(false);
const nav = ref<MenuOption[]>([
  // {
  //   label: "Dashboard",
  //   key: "/dashboard",
  //   icon: () => h(Icon, { icon: "ion:home" }),
  // },
  {
    label: "Лиды",
    key: "/leads",
    icon: () => h(Icon, { icon: "simple-icons:googleads" }),
  },
  {
    label: "Сделки",
    key: "/deals",
    icon: () => h(Icon, { icon: "mdi:deal" }),
  },
  // {
  //   label: "Статистика",
  //   key: "/analytics",
  //   icon: () => h(Icon, { icon: "mdi:analytics" }),
  // },
  // {
  //   label: "Сотрудники",
  //   key: "/works",
  //   icon: () => h(Icon, { icon: "raphael:people" }),
  // },
  {
    label: "Календарь",
    key: "/managment",
    icon: () => h(Icon, { icon: "clarity:date-line" }),
  },
  // {
  //   label: "Настройки",
  //   key: "/settings",
  //   icon: () => h(Icon, { icon: "material-symbols:settings-rounded" }),
  // },
  {
    label: "История",
    key: "/history",
    icon: () => h(Icon, { icon: "solar:history-bold" }),
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
