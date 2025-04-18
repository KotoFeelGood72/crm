<template>
  <div class="chat-page">
    <div class="sidebar">
      <ChatRoomList />
    </div>
    <div class="main">
      <ChatMessages />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatRoomList from "@/components/ui/list/ChatRoomList.vue";
import ChatMessages from "@/components/ui/list/ChatMessages.vue";
</script>

<style scoped>
.chat-page {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 300px;
  border-right: 1px solid #ddd;
}

.main {
  flex: 1;
}
</style>
