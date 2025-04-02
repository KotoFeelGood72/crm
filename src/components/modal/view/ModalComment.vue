<template>
  <div class="comment">
    <h3>Добавить комментарий</h3>
    <div class="form">
      <InputArea
        v-model="newComment"
        placeholder="Введите комментарий..."
        @keydown.enter="handleComment"
      />
      <Button name="Добавить комментарий" @click="handleComment" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import InputArea from "@/components/ui/inputs/InputArea.vue";
import Button from "@/components/ui/buttons/Button.vue";
import { useClientStore, useClientStoreRefs } from "@/store/useClientStore";
import { useRoute } from "vue-router";
import { useModalStore } from "@/store/useModalStore";

const route = useRoute();
const newComment = ref("");

const { closeAllModals } = useModalStore();
const { addComment } = useClientStore();
const { clients } = useClientStoreRefs();

const handleComment = async () => {
  const text = newComment.value.trim();
  if (!text) return;

  const now = new Date();
  const time = now.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const currentClient = computed(() =>
    clients.value.find((c) => c.id === Number(route.query.comment))
  );
  const history = Array.isArray(currentClient.value?.acf?.history)
    ? [...currentClient.value.acf.history]
    : [];

  history.push({ txt: text, time });

  try {
    await addComment({
      id: Number(route.query.comment),
      history,
    });
    newComment.value = "";
    closeAllModals();
  } catch (err) {
    console.error("Ошибка при сохранении комментария:", err);
  }
};
</script>

<style scoped lang="scss">
.comment {
  background-color: $white;
  border-radius: 10px;
  width: 500px;
  padding-bottom: 10px;
}

h3 {
  padding: 20px;
}

.form {
  padding: 30px 20px;
  border-top: 1px solid #e1e0e0;
}
</style>
