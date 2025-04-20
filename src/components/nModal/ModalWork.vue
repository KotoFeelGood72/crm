<template>
  <n-drawer
    v-model:show="modals.nWork"
    @update:show="closeModal"
    placement="right"
    default-width="700px"
  >
    <n-drawer-content>
      <template #header>
        <div class="flex items-center justify-between gap-2 w-full">
          <n-h2 class="flex-grow m-0"> {{ work?.title }}</n-h2>
          <div class="flex items-center gap-2">
            <!-- Приступить -->
            <n-button
              type="primary"
              :loading="loadingAction === 'start'"
              v-if="work?.meta?.status === 'todo'"
              @click="changeStatus('in_progress', 'Приступил к задаче')"
            >
              <Icons
                v-if="!loadingAction"
                color="inherit"
                icon="solar:play-outline"
              />
            </n-button>

            <!-- Пауза -->
            <n-button
              type="warning"
              :loading="loadingAction === 'pause'"
              v-if="work?.meta.status === 'in_progress'"
              @click="changeStatus('paused', 'Поставил на паузу')"
            >
              <Icons
                v-if="!loadingAction"
                color="inherit"
                icon="solar:pause-linear"
              />
            </n-button>

            <!-- Возобновить -->
            <n-button
              type="primary"
              :loading="loadingAction === 'start'"
              v-if="work?.meta.status === 'paused'"
              @click="changeStatus('in_progress', 'Возобновил задачу')"
            >
              <Icons
                v-if="!loadingAction"
                color="inherit"
                icon="solar:play-outline"
              />
            </n-button>

            <!-- Завершить -->
            <n-button
              type="success"
              :loading="loadingAction === 'complete'"
              v-if="
                work?.meta.status !== 'done' &&
                work?.meta.status === 'in_progress'
              "
              @click="changeStatus('done', 'Завершил задачу')"
            >
              <Icons
                v-if="!loadingAction"
                color="inherit"
                icon="fluent-mdl2:completed"
              />
            </n-button>
          </div>
        </div>
      </template>
      <n-scrollbar>
        <div v-if="work && work.meta" class="flex flex-col gap-2">
          <n-tabs type="line" animated>
            <n-tab-pane name="Задача" tab="Задача">
              <div class="flex flex-col gap-2">
                <n-card size="small" title="Статус">
                  <n-select
                    v-model:value="work.meta.status"
                    :options="statuses"
                  />
                </n-card>

                <n-card size="small" title="Приоритет">
                  <n-select
                    v-model:value="work.meta.priority"
                    :options="priorities"
                  />
                </n-card>

                <n-card title="Чеклист" size="small">
                  <n-space vertical>
                    <n-checkbox
                      v-for="(item, index) in work.meta.checklist"
                      :key="index"
                      :checked="item.done"
                      @update:checked="
                        (val: any) => handleToggleChecklist(index, val)
                      "
                    >
                      <span
                        :style="{
                          textDecoration: item.done ? 'line-through' : 'none',
                        }"
                      >
                        {{ item || item.text }}
                      </span>
                    </n-checkbox>
                  </n-space>
                </n-card>

                <n-card size="small" title="Описание">
                  <n-input
                    v-model:value="work.meta.description"
                    type="textarea"
                    placeholder="Описание задачи"
                    :autosize="{ minRows: 3, maxRows: 6 }"
                  />
                </n-card>

                <n-row class="flex items-center gap-2">
                  <n-button
                    :loading="isSaving"
                    tertiary
                    type="primary"
                    class="flex-grow"
                    @click="handleSave"
                  >
                    Сохранить
                  </n-button>

                  <n-button
                    tertiary
                    type="error"
                    class="flex-grow"
                    @click="closeModal"
                    :disabled="isSaving"
                  >
                    Закрыть
                  </n-button>
                </n-row>
              </div>
            </n-tab-pane>

            <n-tab-pane name="Комментарии" tab="Комментарии">
              <n-card title="Комментарии" size="small" class="mb-2">
                <n-infinite-scroll style="max-height: 60dvh" :distance="10">
                  <n-steps vertical>
                    <n-step
                      v-for="item in work.meta.history"
                      :title="item.time"
                      :description="item.txt"
                    />
                  </n-steps>
                </n-infinite-scroll>
              </n-card>
              <n-input
                v-model:value="newComment"
                type="textarea"
                class="mb-2"
                @keydown:enter="handleComment"
              />
              <n-button
                class="w-full"
                tertiary
                type="success"
                @click="handleComment"
              >
                Отправить
              </n-button>
            </n-tab-pane>
          </n-tabs>
        </div>
        <n-space
          v-else
          class="absolute top-[50%] left-[50%] -translate-[-50%, -50%]"
        >
          <n-spin size="large" />
        </n-space>
      </n-scrollbar>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { useModalStoreRefs, useModalStore } from "@/store/useModalStore";
import { useWorkStore, useWorkStoreRefs } from "@/store/useWorkStore";
import { ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";

const { modals } = useModalStoreRefs();
const { closeAllModals } = useModalStore();
const { fetchOne, update, pause, complete } = useWorkStore();
const { work } = useWorkStoreRefs();

const { toggleChecklistItem } = useWorkStore();

const handleToggleChecklist = async (index: number, val: boolean) => {
  if (!work.value) return;
  await toggleChecklistItem(work.value.id, index, val);
};

const route = useRoute();
const router = useRouter();
const isSaving = ref(false);
const newComment = ref("");
const loadingAction = ref<"start" | "pause" | "complete" | null>(null);
const priorities = [
  { label: "Низкий", value: "low" },
  { label: "Средний", value: "medium" },
  { label: "Высокий", value: "high" },
];

const statuses = [
  { label: "Ожидает", value: "todo" },
  { label: "В работе", value: "in_progress" },
  { label: "Пауза", value: "paused" },
  { label: "Завершено", value: "done" },
];

const closeModal = () => {
  closeAllModals(router, route);
  work.value = null;
};

const handleSave = async () => {
  isSaving.value = true;
  try {
    await update(work.value.id, work.value.meta);
  } catch (error) {
    console.error("Ошибка при сохранении задачи:", error);
  } finally {
    isSaving.value = false;
  }
};

const addHistory = (text: string) => {
  const now = new Date();
  const time = now.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!Array.isArray(work.value.meta.history)) {
    work.value.meta.history = [];
  }

  work.value.meta.history.push({ txt: text, time });
};

const handleComment = async () => {
  if (!newComment.value.trim()) return;

  addHistory(newComment.value.trim());
  newComment.value = "";

  try {
    await update(work.value.id, work.value.meta);
  } catch (err) {
    console.error("Ошибка при сохранении комментария:", err);
  }
};

async function changeStatus(newStatus: string, historyText: string) {
  if (!work.value) return;
  loadingAction.value =
    newStatus === "in_progress"
      ? "start"
      : newStatus === "paused"
      ? "pause"
      : "complete";
  try {
    // обновляем через универсальный update
    await update(work.value.id, {
      ...work.value.meta,
      status: newStatus,
    });
    // сразу локально пишем в историю
    work.value.meta.history = work.value.meta.history || [];
    work.value.meta.history.push({
      txt: historyText,
      time: new Date().toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  } catch (e) {
    console.error("Ошибка смены статуса:", e);
  } finally {
    loadingAction.value = null;
  }
}

watchEffect(async () => {
  const workId = route.query.work;
  if (workId && modals.value.nWork) {
    console.log("🚀 Fetching work ID:", workId);
    await fetchOne(Number(workId));
    console.log("✅ Загрузка завершена:", work.value);
  }
});
</script>
