<template>
  <div class="note">
    <div class="note-header">
      Уведомления
      <button class="clear" @click="markAllAsRead">Очистить</button>
    </div>

    <div v-if="notifications.length" class="note-body">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="{ unread: notification.is_read === 0 }"
        @click="markAsRead(notification.id)"
      >
        <div class="title">{{ notification.title }}</div>
        <div class="content" v-html="notification.content"></div>
        <div class="date">{{ notification.date }}</div>
      </div>
    </div>
    <div v-else class="empty">Нет уведомлений</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { api } from "@/api/api";
import { useUsersStore } from "@/store/useUserStore";

const store = useUsersStore();
// const dropdownOpen = ref(false);
const notifications = ref<any[]>([]);

const fetchNotifications = async () => {
  if (!store?.users?.userInfo?.id) return;
  const userId = store.users.userInfo.id;
  const response = await api.get(`/wp-json/custom/v1/notifications/${userId}`);
  notifications.value = response.data;
};

// const unreadCount = computed(
//   () => notifications.value.filter((n) => n.is_read === 0).length
// );

const markAsRead = async (id: number) => {
  await api.post(`/wp-json/custom/v1/mark-notification-read/${id}`);
  fetchNotifications();
};

const markAllAsRead = async () => {
  const unread = notifications.value.filter((n) => n.is_read === 0);
  await Promise.all(
    unread.map((n) => api.post(`/wp-json/custom/v1/mark-notification-read/${n.id}`))
  );
  fetchNotifications();
};

onMounted(() => {
  fetchNotifications();
});
</script>

<style scoped lang="scss">
.note {
  position: fixed;
  top: 80px;
  border-radius: 10px;
  right: 40px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 0 20px 0 #0000001c;
  max-height: 60dvh;
  overflow-y: auto;
  font-size: 12px;
  font-weight: 500;
  z-index: 99;
}

.note-header {
  @include flex-space;
  margin-bottom: 10px;
}

.content {
  :deep(p) {
    font-size: 12px;
    color: #444;
  }
}

.badge {
  position: absolute;
  top: -4px;
  right: -6px;
  background: red;
  color: white;
  border-radius: 999px;
  padding: 2px 6px;
  font-size: 12px;
}

.dropdown {
  height: 100dvh;
  background-color: $white;
}

// .dropdown {
//   position: absolute;
//   right: 0;
//   top: 120%;
//   width: 320px;
//   background: #fff;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//   border-radius: 10px;
//   overflow: hidden;
//   z-index: 99;
// }

.dropdown-header {
  padding: 10px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .clear {
    font-size: 12px;
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
  }
}

.dropdown-body {
  max-height: 300px;
  overflow-y: auto;
}

.notification {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;

  &:hover {
    background: #f9f9f9;
  }

  &.unread {
    background: #eef5ff;
  }

  .title {
    font-weight: bold;
    margin-bottom: 4px;
  }

  .content {
    font-size: 14px;
    color: #444;
  }

  .date {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
}

.empty {
  padding: 16px;
  text-align: center;
  color: #777;
}
</style>
