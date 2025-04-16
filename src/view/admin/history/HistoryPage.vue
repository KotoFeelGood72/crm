<template>
  <div class="pb-16">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// import { useHistoryStore, useHistoryStoreRefs } from "@/store/useHistoryStore";
// import { onMounted } from "vue";
import { DataTableColumns } from "naive-ui";

// Стор
// const { fetchMyHistory } = useHistoryStore();
// const { history } = useHistoryStoreRefs();

// onMounted(() => {
//   fetchMyHistory();
// });

// Хелпер для форматирования даты
const formatDate = (dateStr: any) => {
  return new Date(dateStr).toLocaleString("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

// Колонки для n-data-table
const columns: DataTableColumns = [
  {
    title: "Дата",
    key: "date",
    render(row) {
      return formatDate(row.date);
    },
  },
  {
    title: "Действие",
    key: "title",
  },
  {
    title: "Сообщение",
    key: "message",
  },
  {
    title: "Пользователь",
    key: "meta",
    render(row: any) {
      return row.meta?.user_id?.[0] ?? "—";
    },
  },
];
</script>
