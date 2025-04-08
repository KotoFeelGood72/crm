<template>
  <div class="pb-16">
    <SectionHeader
      title="История"
      subtitle="Последние действия пользователей"
      icon="solar:history-bold"
      class="text-white"
      button="фильтры"
    />

    <div class="container px-6 mx-auto text-white">
      <div class="overflow-x-auto rounded-lg shadow border border-gray-700">
        <table class="min-w-full divide-y divide-gray-700 bg-gray-800 text-sm text-left">
          <thead class="bg-gray-700 text-xs uppercase text-gray-300">
            <tr>
              <th class="px-4 py-3">Дата</th>
              <th class="px-4 py-3">Действие</th>
              <th class="px-4 py-3">Сообщение</th>
              <th class="px-4 py-3">Пользователь</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr
              v-for="(log, index) in history"
              :key="'log-' + index"
              class="hover:bg-gray-700"
            >
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                {{ formatDate(log.date) }}
              </td>
              <td class="px-4 py-3 font-semibold text-white">{{ log.title }}</td>
              <td class="px-4 py-3 text-gray-300">{{ log.message }}</td>
              <td class="px-4 py-3 text-gray-400">
                {{ log.meta.user_id?.[0] || "—" }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SectionHeader from "@/components/ui/header/SectionHeader.vue";
import { useHistoryStore, useHistoryStoreRefs } from "@/store/useHistoryStore";
import { onMounted } from "vue";

// Стор
const { fetchMyHistory } = useHistoryStore();
const { history } = useHistoryStoreRefs();

onMounted(() => {
  fetchMyHistory();
});

// Хелпер для даты
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  });
};
</script>
