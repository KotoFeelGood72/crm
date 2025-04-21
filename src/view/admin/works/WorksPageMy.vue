<template>
  <div class="tasks min-h-screen">
    <n-page-header subtitle="Текущие задачи" class="mb-6">
      <n-grid :cols="5">
        <n-gi><n-statistic label="Всего" :value="works.length" /></n-gi>
        <n-gi><n-statistic label="Выполнено" :value="doneCount" /></n-gi>
        <n-gi><n-statistic label="Просрочено" :value="overdueCount" /></n-gi>
        <n-gi><n-statistic label="В работе" :value="inProgressCount" /></n-gi>
        <n-gi><n-statistic label="Пауза" :value="pausedCount" /></n-gi>
      </n-grid>

      <template #title>
        <span>Задачи</span>
      </template>
      <template #header>
        <n-breadcrumb>
          <n-breadcrumb-item>Рабочий стол</n-breadcrumb-item>
          <n-breadcrumb-item>Задачи</n-breadcrumb-item>
        </n-breadcrumb>
      </template>
      <template #avatar>
        <n-avatar
          src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg"
        />
      </template>
      <template #extra>
        <n-space>
          <n-button @click="fetchMyTasks">Обновить</n-button>
          <n-button @click="openModal('WorkCreate')">Создать задачу </n-button>
          <n-button
            @click="isKanban = true"
            :type="isKanban ? 'primary' : 'default'"
            ><Icons icon="tabler:layout-filled" color="inherit"
          /></n-button>
          <n-button
            @click="isKanban = false"
            :type="!isKanban ? 'primary' : 'default'"
            ><Icons icon="material-symbols:event-list" color="inherit"
          /></n-button>
        </n-space>
      </template>
      <template #footer>
        Актуально на {{ new Date().toLocaleDateString() }}
      </template>
    </n-page-header>

    <div class="overflow-hidden">
      <div
        v-if="isKanban"
        class="flex overflow-x-auto touch-pan-x scroll-smooth gap-2"
      >
        <div v-for="status in statuses" :key="status.id">
          <KanbanCard
            class="min-w-64 max-w-64"
            :name="status.label"
            :count="groupedTasks[status.value]?.length || 0"
            @end="
              (e, newStatus, oldStatus) =>
                onCardDrop(e, status.value, oldStatus)
            "
            v-model="groupedTasks[status.value]"
          >
            <template #card="{ card }">
              <CardWork
                :work="card"
                @click="openModal('nWork', '', { work: card.id }, router)"
              />
            </template>
          </KanbanCard>
        </div>
      </div>

      <div v-else>
        <n-scrollbar style="max-height: 80dvh">
          <div class="flex flex-col gap-4">
            <CardWorkList
              v-for="(card, i) in works"
              :work="card"
              :key="'card-item-work-' + i"
              @click.stop="openModal('nWork', '', { work: card.id }, router)"
            />
          </div>
        </n-scrollbar>
      </div>
    </div>

    <ModalCreateWork />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { useWorkStore, useWorkStoreRefs } from "@/store/useWorkStore";
import KanbanCard from "@/components/ui/card/KanbanCard.vue";
import { useModalStore } from "@/store/useModalStore";
import ModalCreateWork from "@/components/nModal/ModalCreate/ModalCreateWork.vue";
import CardWork from "@/components/ui/card/CardWork.vue";
import CardWorkList from "@/components/ui/card/CardWorkList.vue";
import { useRouter } from "vue-router";

// Reactive maps for grouped tasks
const groupedTasks = ref<Record<string, any[]>>({});

// Status definitions
const statuses = ref([
  { id: 1, value: "todo", label: "Новые" },
  { id: 2, value: "in_progress", label: "В работе" },
  { id: 3, value: "paused", label: "Пауза" },
  { id: 4, value: "done", label: "Завершено" },
]);

const isKanban = ref(false);
const { openModal } = useModalStore();
const router = useRouter();
const { fetchMyTasks, update } = useWorkStore();
const { works } = useWorkStoreRefs();

// Convert works ref to array safely
const worksArray = computed(() => {
  if (Array.isArray(works.value)) {
    return works.value;
  }
  // if works.value is object, take its values
  return Object.values(works.value || {});
});

// Group tasks by status
const initGroupedTasks = () => {
  const result: Record<string, any[]> = {};
  // Initialize empty arrays for each defined status
  statuses.value.forEach((status) => {
    result[status.value] = [];
  });
  // Iterate through worksArray
  worksArray.value.forEach((task) => {
    const st = task.meta.status || "todo";
    if (!result[st]) {
      result[st] = [];
    }
    result[st].push(task);
  });
  groupedTasks.value = result;
};

watch(
  worksArray,
  () => {
    initGroupedTasks();
  },
  { deep: true }
);

// Counts
const doneCount = computed(
  () => worksArray.value.filter((w) => w.meta.status === "done").length
);
const overdueCount = computed(
  () => worksArray.value.filter((w) => w.meta.status === "overdue").length
);
const inProgressCount = computed(
  () => worksArray.value.filter((w) => w.meta.status === "in_progress").length
);
const pausedCount = computed(
  () => worksArray.value.filter((w) => w.meta.status === "paused").length
);

const onCardDrop = async (event: any, newStatus: string, oldStatus: string) => {
  const movedCard = event.item.__draggable_context.element;
  if (!movedCard || oldStatus === newStatus) return;
  await update(movedCard.id, { status: newStatus });
  movedCard.meta.status = newStatus;
};

onMounted(async () => {
  await fetchMyTasks();
  initGroupedTasks();
});
</script>
