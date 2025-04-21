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
        <n-badge :count="unreadCount" :dot="unreadCount > 0">
          <n-popover trigger="click" placement="bottom-end" show-arrow>
            <template #trigger>
              <n-button :bordered="false" size="tiny" :circle="true"
                ><Icons icon="f7:bell-fill" :size="20" color="inherit"
              /></n-button>
            </template>
            <div>
              <template v-if="notifications.length">
                <div>
                  <div class="flex items-center justify-between pt-4">
                    <n-h3 style="margin-bottom: 0">Уведомления</n-h3>
                    <n-button
                      tertiary
                      type="success"
                      size="small"
                      @click="markAllAsRead"
                      >Прочитать все</n-button
                    >
                  </div>
                  <n-divider style="margin: 20px 0"></n-divider>
                  <n-scrollbar class="max-h-[70dvh] max-w-80">
                    <div class="flex flex-col gap-2">
                      <n-card
                        v-for="note in notifications"
                        :key="note.id"
                        size="small"
                        class="relative"
                        :hoverable="true"
                        header-style="padding-bottom: 5px;"
                      >
                        <template #header>
                          <div class="text-xs">{{ note.title }}</div>
                          <n-badge
                            v-if="!note.meta?.is_read"
                            dot
                            class="absolute top-3 right-3"
                          ></n-badge>
                        </template>
                        <div class="text-[10px]">{{ note.content }}</div>
                        <template #footer>
                          <div class="flex items-center justify-between">
                            <div class="text-xs">
                              <n-tag size="small" class="text-[10px]">{{
                                note.date
                              }}</n-tag>
                            </div>
                            <div>
                              <n-button
                                v-if="!note.meta?.is_read"
                                size="small"
                                class="text-[10px]"
                                style="padding: 4px 6px; height: 20px"
                                @click="readNotification(note)"
                                >Прочитать</n-button
                              >
                            </div>
                          </div>
                        </template>
                      </n-card>
                    </div>
                  </n-scrollbar>
                </div>
              </template>
              <template v-else>
                <n-empty description="Нет уведомлений" />
              </template>
            </div>
          </n-popover>
        </n-badge>
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
          <n-avatar
            src="https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82"
          />
        </n-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useUsersStore } from "@/store/useUserStore";
import { useRouter } from "vue-router";
import { useTheme } from "@/composables/useTheme";
import {
  useNotificationStore,
  useNotificationStoreRefs,
} from "@/store/useNotificationStore";

const { isDark, toggleTheme } = useTheme();
const router = useRouter();
const { users } = useUsersStore();
const { fetchNotifications, markAsRead, markAllAsRead } =
  useNotificationStore();
const { notifications } = useNotificationStoreRefs();

const unreadCount = computed(
  () => notifications.value.filter((n) => !n.meta?.is_read).length
);

async function readNotification(note: any) {
  await markAsRead(note.id);
  note.meta = { ...note.meta, is_read: true };
}

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

onMounted(() => {
  fetchNotifications();
});
</script>
