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

const groupedTasks = ref<Record<string, any[]>>({});
const statuses = ref<any>([
  { id: 1, value: "todo", label: "Новые" },
  { id: 2, value: "in_progress", label: "В работе" },
  { id: 3, value: "paused", label: "Пауза" },
  { id: 4, value: "done", label: "Завершено" },
]);
const isKanban = ref(false);

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
  statuses.value.forEach((status: any) => {
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
