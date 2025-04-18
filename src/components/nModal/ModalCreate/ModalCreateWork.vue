<template>
  <n-drawer
    v-model:show="modals.WorkCreate"
    @update:show="closeModal"
    placement="right"
    default-width="700px"
  >
    <n-drawer-content title="Создание задачи">
      <n-scrollbar>
        <div class="flex flex-col gap-2">
          <n-card size="small" title="Название задачи">
            <n-input
              v-model:value="newTaskTitle"
              placeholder="Введите заголовок задачи"
            />
          </n-card>
          <n-card size="small" title="Дата и время">
            <n-date-picker
              v-model:formatted-value="newTaskDateTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              clearable
              class="w-full"
            />
          </n-card>
          <n-card size="small" title="Приоритет">
            <n-select
              v-model:value="newTaskPriority"
              :options="priorities"
              placeholder="Выберите приоритет"
            />
          </n-card>
          <n-card size="small" title="Описание">
            <n-input
              v-model:value="newTaskDescription"
              type="textarea"
              placeholder="Краткое описание задачи"
              :autosize="{ minRows: 3, maxRows: 6 }"
            />
          </n-card>
          <n-row class="flex items-center gap-2">
            <n-button
              :loading="isSaving"
              tertiary
              type="primary"
              class="flex-grow"
              @click="handleCreate"
            >
              Создать
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
      </n-scrollbar>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useModalStoreRefs, useModalStore } from "@/store/useModalStore";
import { useWorkStore } from "@/store/useWorkStore";

const { modals } = useModalStoreRefs();
const { closeAllModals } = useModalStore();
const { create, fetchAll } = useWorkStore();

const newTaskTitle = ref("");
const newTaskDateTime = ref<any>(null);
const newTaskDescription = ref("");
const newTaskPriority = ref("medium");
const isSaving = ref(false);

const priorities = [
  { label: "Низкий", value: "low" },
  { label: "Средний", value: "medium" },
  { label: "Высокий", value: "high" },
];

const handleCreate = async () => {
  if (!newTaskTitle.value || !newTaskDateTime.value) return;
  const [date, time] = newTaskDateTime.value.split(" ");

  isSaving.value = true;
  try {
    await create({
      title: newTaskTitle.value,
      start_date: date,
      time_estimate: time,
      description: newTaskDescription.value,
      priority: newTaskPriority.value,
      status: "todo",
      responsible: "",
      progress: 0,
    });
    await fetchAll();
    closeModal();
  } catch (err) {
    console.error("Ошибка при создании задачи:", err);
  } finally {
    isSaving.value = false;
  }
};

const closeModal = () => {
  closeAllModals();
  newTaskTitle.value = "";
  newTaskDateTime.value = null;
  newTaskDescription.value = "";
  newTaskPriority.value = "medium";
};
</script>
