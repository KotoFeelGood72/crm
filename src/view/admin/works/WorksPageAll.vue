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
          <n-button @click="fetchAll">Обновить</n-button>
          <n-button @click="openModal('WorkCreate')">Создать задачу</n-button>
          <n-button @click="toggleViewMode">{{
            isKanban ? "Список" : "Kanban"
          }}</n-button>
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
            :name="status.name"
            :count="groupedTasks[status.name]?.length || 0"
            @end="
              (e, newStatus, oldStatus) => onCardDrop(e, newStatus, oldStatus)
            "
            v-model="groupedTasks[status.name]"
          >
            <template #card="{ card }">
              <CardDeal
                :card="card"
                class="cursor-pointer"
                @click="openModal('nDeal', '', { deal: card.id }, router)"
              />
            </template>
          </KanbanCard>
        </div>
      </div>

      <div v-else class="p-4 space-y-4">
        <n-card v-for="task in works" :key="task.id" :title="task.title">
          <p><b>Статус:</b> {{ task.meta.status }}</p>
          <p><b>Дата:</b> {{ task.meta.start_date }}</p>
          <p><b>Описание:</b> {{ task.meta.description }}</p>
        </n-card>
      </div>
    </div>

    <ModalCreateWork />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { useWorkStore, useWorkStoreRefs } from "@/store/useWorkStore";
import CardDeal from "@/components/ui/card/CardDeal.vue";
import KanbanCard from "@/components/ui/card/KanbanCard.vue";
import { useModalStore } from "@/store/useModalStore";
import ModalCreateWork from "@/components/nModal/ModalCreate/ModalCreateWork.vue";
import { useRouter } from "vue-router";

const groupedTasks = ref<Record<string, any[]>>({});
const statuses = ref([
  { id: 1, name: "todo" },
  { id: 2, name: "in_progress" },
  { id: 3, name: "paused" },
  { id: 4, name: "done" },
]);
const isKanban = ref(true);
const toggleViewMode = () => (isKanban.value = !isKanban.value);

const { openModal } = useModalStore();
const router = useRouter();
const { update, fetchAll } = useWorkStore();
const { works } = useWorkStoreRefs();

const onCardDrop = async (event: any, newStatus: string, oldStatus: string) => {
  const movedCard = event.item.__draggable_context.element;
  if (!newStatus || !movedCard || oldStatus === newStatus) return;

  await update(movedCard.id, { status: newStatus });
  movedCard.meta.status = newStatus;
};

watch(
  works,
  () => {
    initGroupedTasks();
  },
  { deep: true }
);

const initGroupedTasks = () => {
  const result: Record<string, any[]> = {};
  statuses.value.forEach((status) => {
    result[status.name] = [];
  });

  works.value.forEach((task) => {
    const status = task.meta.status || "Без статуса";
    if (!result[status]) result[status] = [];
    result[status].push(task);
  });

  groupedTasks.value = result;
};

const doneCount = computed(
  () => works.value.filter((w) => w.meta.status === "done").length
);
const overdueCount = computed(
  () => works.value.filter((w) => w.meta.status === "overdue").length
);
const inProgressCount = computed(
  () => works.value.filter((w) => w.meta.status === "in_progress").length
);
const pausedCount = computed(
  () => works.value.filter((w) => w.meta.status === "paused").length
);

onMounted(async () => {
  await fetchAll();
  initGroupedTasks();
});
</script>
