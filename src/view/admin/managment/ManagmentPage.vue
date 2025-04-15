<template>
  <!-- Календарь -->
  <n-calendar
    v-model:value="selectedDate"
    :first-day-of-week="1"
    @update:value="onDayClick"
    :is-date-disabled="disabledPastDates"
  >
    <template #="{ year, month, date }">
      <div class="p-1">
        <ul class="text-[10px] mt-1">
          <li
            v-for="(event, index) in eventsGrouped[getDateKey(year, month, date)]?.slice(
              0,
              2
            )"
            :key="index"
            class="flex items-center gap-1 truncate"
            style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis"
          >
            <!-- Цветная точка со статусом с tooltip -->
            <n-tooltip placement="top">
              <template #trigger>
                <span
                  class="inline-block w-2 h-2 rounded-full"
                  :style="{ backgroundColor: getStatusColor(event.status) }"
                ></span>
              </template>
              <span>Срочность: {{ event.status }}</span>
            </n-tooltip>
            <!-- Текст задачи -->
            <span class="truncate flex-1">{{ event.title }}</span>
          </li>
          <li v-if="eventsGrouped[getDateKey(year, month, date)]?.length > 2">+ ещё</li>
        </ul>
      </div>
    </template>
  </n-calendar>

  <!-- Drawer для выбранного дня -->
  <n-drawer v-model:show="showDrawer" :width="600" placement="right">
    <n-drawer-content :title="formattedSelectedDate">
      <!-- Форма добавления новой задачи -->
      <div class="mb-4">
        <n-input
          v-model:value="newEvent"
          placeholder="Введите задачу"
          type="textarea"
          @keyup.enter="addEvent"
        />
        <n-time-picker
          class="mt-2"
          v-model:formatted-value="newTaskTime"
          format="HH:mm"
          value-format="HH:mm"
          placeholder="Выберите время"
        />
        <n-select
          class="mt-2"
          v-model:value="newTaskStatus"
          :options="statusOptions"
          placeholder="Выберите срочность"
        />
        <n-button
          class="mt-2"
          type="primary"
          block
          @click="addEvent"
          :loading="isCreating"
        >
          Добавить
        </n-button>
      </div>

      <!-- Список задач за выбранный день, отображаем в виде карточек -->
      <div class="space-y-2">
        <n-infinite-scroll style="height: 60dvh" :distance="10">
          <div class="flex flex-col gap-2 pr-6">
            <n-card
              v-for="task in tasksForDay"
              :key="task.id"
              bordered
              class="flex flex-col"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span
                    class="inline-block w-2 h-2 rounded-full"
                    :style="{ backgroundColor: getStatusColor(task.status) }"
                  ></span>
                  <span class="font-medium">{{ task.time }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <n-button
                    text
                    type="primary"
                    :loading="isEditing === task.id"
                    @click="startEditEvent(task)"
                  >
                    <Icons icon="mingcute:edit-line" size="18" color="inherit" />
                  </n-button>
                  <n-popconfirm
                    title="Удалить задачу?"
                    positiveText="Да"
                    negativeText="Нет"
                    @positive-click="() => deleteEvent(task)"
                  >
                    <template #trigger>
                      <n-button text type="error" :loading="isDeleting === task.id">
                        <Icons icon="bytesize:trash" size="18" color="inherit" />
                      </n-button>
                    </template>
                  </n-popconfirm>
                </div>
              </div>
              <div class="mt-2">
                <span class="truncate">
                  {{ task.title }}
                </span>
              </div>
              <div class="mt-1 text-xs text-gray-500">Автор: {{ task.authorName }}</div>
            </n-card>
          </div>
        </n-infinite-scroll>
      </div>
    </n-drawer-content>
  </n-drawer>

  <!-- Модальное окно для редактирования задачи -->
  <n-modal v-model:show="editModalVisible" mask-closable class="max-w-96">
    <n-card title="Редактирование задачи" size="small">
      <div class="flex flex-col gap-2">
        <n-input
          v-model:value="editingTask.title"
          placeholder="Название задачи"
          type="textarea"
        />
        <n-time-picker
          class="mt-2"
          v-model:formatted-value="editingTime"
          format="HH:mm"
          value-format="HH:mm"
          placeholder="Выберите время"
        />
        <n-select
          class="mt-2"
          v-model:value="editingStatus"
          :options="statusOptions"
          placeholder="Выберите срочность"
        />
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <n-button @click="editModalVisible = false">Отмена</n-button>
          <n-button
            type="primary"
            @click="saveEditTask"
            :loading="isEditing === editingTask.id"
          >
            Сохранить
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from "vue";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  NCalendar,
  NDrawer,
  NDrawerContent,
  NButton,
  NInput,
  NModal,
  NCard,
  NTimePicker,
  useMessage,
  NSelect,
  NPopconfirm,
} from "naive-ui";
import Icons from "@/components/ui/Icons.vue";
import { useCalendarStore, useCalendarStoreRefs } from "@/store/useCalendarStore";

const calendarStore = useCalendarStore();
const { tasks } = useCalendarStoreRefs();

const selectedDate = ref<number>(Date.now());
const showDrawer = ref(false);
const newEvent = ref("");
// Новое время для добавления задачи (формат "HH:mm")
const newTaskTime = ref<string>("00:00");
// Новая срочность для добавления задачи
const newTaskStatus = ref<string>("low");

const message = useMessage();

// Флаги загрузки
const isCreating = ref(false);
const isEditing = ref<number | null>(null);
const isDeleting = ref<any>(null);

// Поля для редактирования задачи
const editModalVisible = ref(false);
const editingTask = ref<any>({});
const editingTime = ref<string>("");
const editingStatus = ref<string>("");

// Возможные варианты срочности
const statusOptions = [
  { label: "Низкая", value: "low" },
  { label: "Средняя", value: "medium" },
  { label: "Высокая", value: "high" },
];

// Функция для выбора цвета по срочности
function getStatusColor(status: string): string {
  switch (status) {
    case "low":
      return "green";
    case "medium":
      return "orange";
    case "high":
      return "red";
    default:
      return "gray";
  }
}

// Функция блокировки прошлых дат (если понадобится)
const disabledPastDates = (timestamp: number): boolean => {
  const date = new Date(timestamp);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
};

// Группировка задач по дате ("YYYY-MM-DD")
const eventsGrouped = computed(() => {
  const grouped: Record<string, any[]> = {};
  tasks.value.forEach((task) => {
    if (task.start_date) {
      const [datePart, timePart] = task.start_date.split(" ");
      if (!grouped[datePart]) grouped[datePart] = [];
      const shortTime = timePart ? timePart.slice(0, 5) : "";
      const authorName = task.author?.display_name || "admin";
      grouped[datePart].push({
        id: task.id,
        title: task.title,
        authorName,
        time: shortTime,
        status: task.status || "low",
        start_date: task.start_date,
        end_date: task.end_date,
      });
    }
  });
  return grouped;
});

// Задачи выбранного дня (отбираем по дате) для отображения в карточках
const tasksForDay = computed(() => {
  const dayKey = normalizeDate(selectedDate.value);
  return tasks.value
    .filter((task) => task.start_date && task.start_date.split(" ")[0] === dayKey)
    .map((task) => {
      const [_, timePart] = task.start_date.split(" ");
      return {
        id: task.id,
        title: task.title,
        time: timePart ? timePart.slice(0, 5) : "",
        authorName: task.author?.display_name || "admin",
        status: task.status || "low",
        start_date: task.start_date,
      };
    });
});

// Обработчик клика по дню календаря
const onDayClick = (timestamp: number) => {
  selectedDate.value = timestamp;
  showDrawer.value = true;
};

// Функция добавления новой задачи
const addEvent = async () => {
  if (!newEvent.value.trim()) return;
  const dateKey = normalizeDate(selectedDate.value);
  isCreating.value = true;
  try {
    await calendarStore.createTask({
      title: newEvent.value.trim(),
      start_date: dateKey + " " + newTaskTime.value + ":00",
      end_date: dateKey + " " + newTaskTime.value + ":00",
      status: newTaskStatus.value,
    });
    newEvent.value = "";
    message.success("Событие добавлено");
  } catch (error) {
    console.error("Error creating event:", error);
    message.error("Ошибка при добавлении события");
  } finally {
    isCreating.value = false;
  }
};

// Начало редактирования задачи
const startEditEvent = (eventObj: any) => {
  editingTask.value = { ...eventObj };
  const parts = eventObj.start_date.split(" ");
  editingTime.value = parts[1] ? parts[1].slice(0, 5) : "";
  editingStatus.value = eventObj.status || "low";
  editModalVisible.value = true;
};

// Функция удаления задачи (вызывается через n-popconfirm)
const deleteEvent = async (rowData: any) => {
  try {
    await calendarStore.deleteTask(rowData.id);
    message.success("Задача удалена");
  } catch (error) {
    console.error("Error deleting task:", error);
    message.error("Ошибка при удалении задачи");
  }
};

// Сохранение изменений в задаче (объединяем исходную дату с выбранным временем)
const saveEditTask = async () => {
  try {
    const originalDate = editingTask.value.start_date.split(" ")[0];
    const newStartDate = originalDate + " " + editingTime.value + ":00";
    const updatedFields = {
      title: editingTask.value.title,
      start_date: newStartDate,
      status: editingStatus.value,
    };
    isEditing.value = editingTask.value.id;
    await calendarStore.updateTask(editingTask.value.id, updatedFields);
    message.success("Задача обновлена");
    editModalVisible.value = false;
  } catch (error) {
    console.error("Error updating task:", error);
    message.error("Ошибка при сохранении изменений");
  } finally {
    isEditing.value = null;
  }
};

// Преобразование timestamp в формат "YYYY-MM-DD"
function normalizeDate(timestamp: number): string {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().split("T")[0];
}

// Заголовок выбранной даты для Drawer
const formattedSelectedDate = computed(() =>
  format(selectedDate.value, "d MMMM yyyy", { locale: ru })
);

// Функция для получения ключа даты (YYYY-MM-DD) из year, month, date
const getDateKey = (year: number, month: number, date: number) => {
  const d = new Date(year, month - 1, date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
};

onMounted(() => {
  calendarStore.getTasks();
});
</script>
