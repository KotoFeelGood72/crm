<template>
  <div class="pb-16">
    <n-page-header subtitle="История действий" class="mb-6">
      <n-grid :cols="5">
        <n-gi>
          <n-statistic label="Обновлений" value="125" />
        </n-gi>
        <n-gi>
          <n-statistic label="Удалений" value="22" />
        </n-gi>
        <n-gi>
          <n-statistic label="Количество" value="36" />
        </n-gi>
        <n-gi>
          <n-statistic label="Topics" value="83" />
        </n-gi>
        <n-gi>
          <n-statistic label="Reference Links" value="2,346" />
        </n-gi>
      </n-grid>
      <template #title>
        <a
          href="https://anyway.fm/"
          style="text-decoration: none; color: inherit"
        >
          История
        </a>
      </template>
      <template #header>
        <n-breadcrumb>
          <n-breadcrumb-item>Рабочий стол</n-breadcrumb-item>
          <n-breadcrumb-item>История</n-breadcrumb-item>
        </n-breadcrumb>
      </template>
      <template #avatar>
        <n-avatar
          src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg"
        />
      </template>
      <template #extra>
        <n-space>
          <n-button>Refresh</n-button>
          <!-- <n-dropdown :options="options" placement="bottom-start">
            <n-button :bordered="false" style="padding: 0 4px"> ··· </n-button>
          </n-dropdown> -->
        </n-space>
      </template>
      <template #footer> As of April 3, 2021 </template>
    </n-page-header>

    <n-data-table
      :columns="columns"
      :data="history"
      :pagination="{ pageSize: 10 }"
      :bordered="false"
      :scroll-x="1000"
    />
  </div>
</template>

<script setup lang="ts">
import { useHistoryStore, useHistoryStoreRefs } from "@/store/useHistoryStore";
import { onMounted } from "vue";
import { DataTableColumns } from "naive-ui";

// Стор
const { fetchMyHistory } = useHistoryStore();
const { history } = useHistoryStoreRefs();

onMounted(() => {
  fetchMyHistory();
});

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
