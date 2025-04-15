<template>
  <div
    id="owner-header"
    class="flex items-center justify-between w-full z-40 py-4 sticky top-0"
  >
    <div class="flex items-center justify-between h-full px-6 mx-auto w-full">
      <div
        id="logo"
        class="text-lg font-bold dark:text-white max-h-[64px] px-2"
      >
        Gleede CRM
      </div>
      <div id="search"></div>
      <div id="owner-action" class="flex items-center gap-5">
        <IconBtn icon="f7:bell-fill" :iconSize="20" />
        <IconBtn
          @click="toggleTheme"
          :icon="isDark ? 'solar:sun-bold' : 'solar:moon-bold'"
          id="change-theme"
          :class="isDark ? 'text-white' : 'text-purple-600'"
        />
        <n-dropdown
          :options="userMenu"
          trigger="click"
          @select="handleUserMenu"
        >
          <avatar
            img="https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82"
          />
        </n-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import IconBtn from "../buttons/IconBtn.vue";
import avatar from "../user/avatar.vue";
import { useUsersStore } from "@/store/useUserStore";
import { useRouter } from "vue-router";
import { useTheme } from "@/composables/useTheme";

const { isDark, toggleTheme } = useTheme();
const router = useRouter();
const { users } = useUsersStore();

const userMenu = ref<any>([
  {
    label: "Профиль",
    key: "profile",
  },
  {
    label: "История",
    key: "history",
  },
  {
    label: "Задачи",
    key: "works",
  },
  {
    label: "Мои достижения",
    key: "rates",
  },
  {
    label: "Настройки",
    key: "settings",
  },
]);

function handleUserMenu(key: string) {
  switch (key) {
    case "profile":
      // Переходим на /profile/123 (или любой другой роут)
      router.push(`/profile/${users.userInfo.id}`);
      break;
    case "history":
      router.push(`/history`);
      break;
    // и т.д.
  }
}
</script>
