<template>
  <div class="chat-container">
    <div class="chat-messages">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['chat-msg', { mine: msg.from === currentUser }]"
      >
        <n-card size="small" :title="msg.from" :content="msg.text" />
      </div>
    </div>

    <div class="chat-input">
      <n-input
        v-model:value="newMessage"
        type="textarea"
        placeholder="Введите сообщение..."
        @keyup.enter="send"
      />
      <n-button type="primary" @click="send">Отправить</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useChatsStore, useChatsStoreRefs } from "@/store/useChatsStore";
import { NInput, NButton, NCard } from "naive-ui";

const chatStore = useChatsStore();
const { messages } = useChatsStoreRefs();

const currentUser = "user_1"; // временно
const newMessage = ref("");

const send = async () => {
  if (!newMessage.value.trim()) return;
  await chatStore.createMessage(newMessage.value, currentUser);
  newMessage.value = "";
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.chat-msg {
  margin-bottom: 0.5rem;
  max-width: 60%;
}

.chat-msg.mine {
  margin-left: auto;
}

.chat-input {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #eee;
}
</style>
