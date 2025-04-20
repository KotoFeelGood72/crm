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
          <n-card size="small" title="Срок задачи (дата)">
            <n-date-picker
              v-model:formatted-value="newTaskDueDate"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              type="datetime"
              clearable
              :time-picker-props="{
                precision: 'minute',
                format: 'HH:mm',
                valueFormat: 'HH:mm',
              }"
              class="w-full"
            />
          </n-card>

          <n-card size="small" title="Исполнители">
            <n-select
              v-model:value="newTaskUsers"
              multiple
              placeholder="Выберите исполнителей"
              :options="userOptions"
            />
          </n-card>
          <n-card size="small" title="Чеклист">
            <n-dynamic-input
              v-model:value="checklist"
              placeholder="Добавьте пункт"
              :max="10"
              item-style="margin-bottom: 6px"
            >
              <template #default="{ index }">
                <n-input v-model:value="checklist[index]" />
              </template>
            </n-dynamic-input>
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
import { computed, onMounted, ref } from "vue";
import { useModalStoreRefs, useModalStore } from "@/store/useModalStore";
import { useProfileStore, useProfileStoreRefs } from "@/store/useProfileStore";
import { useUsersStore, useUsersStoreRefs } from "@/store/useUserStore";
import { useWorkStore } from "@/store/useWorkStore";

const { modals } = useModalStoreRefs();
const { closeAllModals } = useModalStore();
const { create, fetchAll } = useWorkStore();
const { fetchAllUsers } = useUsersStore();
const { fetchAllProfiles, fetchProfileById } = useProfileStore();
const checklist = ref<string[]>([""]);
const newTaskTitle = ref("");
const newTaskDateTime = ref<any>(null);
const allUsers = ref<any>(null);
const newTaskDescription = ref("");
const newTaskPriority = ref("medium");
const isSaving = ref(false);

const priorities = [
  { label: "Низкий", value: "low" },
  { label: "Средний", value: "medium" },
  { label: "Высокий", value: "high" },
];

const newTaskDueDate = ref<any>(null);
const newTaskUsers = ref<number[]>([]);

const userOptions = computed(() => {
  if (!allUsers.value || !Array.isArray(allUsers.value)) return [];
  return allUsers.value.map((user: any) => ({
    label: `${user.acf.name} ${user.acf.lastname}`,
    value: user.ID,
  }));
});

const handleCreate = async () => {
  if (!newTaskTitle.value || !newTaskDateTime.value) return;

  isSaving.value = true;
  try {
    await create({
      title: newTaskTitle.value,
      start_date: newTaskDateTime.value, // <-- полная дата + время
      time_estimate: newTaskDateTime.value.split(" ")[1], // <-- только время
      due_date: newTaskDueDate.value,
      description: newTaskDescription.value,
      priority: newTaskPriority.value,
      status: "todo",
      responsible: "", // можно будет выбрать позже
      users: newTaskUsers.value,
      checklist: checklist.value,
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
  newTaskDateTime.value = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  newTaskDescription.value = "";
  newTaskPriority.value = "medium";
  checklist.value = [""];
};

onMounted(async () => {
  allUsers.value = await fetchAllProfiles();
  console.log("👥 Все пользователи:", allUsers);
});
</script>
