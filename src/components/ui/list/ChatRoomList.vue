<template>
  <n-list bordered hoverable>
    <n-list-item
      v-for="room in chatRooms"
      :key="room.id"
      @click="selectRoom(room.id)"
      :class="{ 'is-active': room.id === activeChatId }"
    >
      <n-thing :title="room.users.filter((u) => u !== currentUser).join(', ')">
        <template #description>Чат</template>
      </n-thing>
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import { useChatsStore, useChatsStoreRefs } from "@/store/useChatsStore";
import { onMounted } from "vue";
import { NList, NListItem, NThing } from "naive-ui";

const currentUser = "user_1"; // временно

const chatStore = useChatsStore();
const { chatRooms, activeChatId } = useChatsStoreRefs();

onMounted(() => {
  chatStore.fetchUserChats(currentUser);
});

const selectRoom = (roomId: string) => {
  chatStore.fetchMessages(roomId);
};
</script>

<style scoped>
.is-active {
  background-color: #f0f0f0;
}
</style>
