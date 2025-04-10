<template>
  <div ref="pickerRef" class="relative w-full max-w-xs text-xs">
    <!-- Инпут -->
    <div
      @click="toggleDropdown"
      class="flex items-center justify-between dark:border dark:border-gray-400 rounded-md px-2 py-1 cursor-pointer hover:border-blue-400 transition"
      :class="{ 'border-blue-500 ring ring-blue-200': showPicker }"
    >
      <div class="flex items-center gap-2 text-gray-400">
        <Icons icon="lets-icons:date-range-duotone" color="inherit" :size="16" />
        <span>{{ formattedDate }}</span>
      </div>
    </div>

    <!-- Календарь -->
    <div
      v-if="showPicker"
      class="absolute z-50 mt-2 w-56 bg-gray-700 shadow-xl rounded-lg p-4"
    >
      <div class="flex justify-between items-center mb-2">
        <select v-model="selectedMonth" class="text-xs text-gray-400 flex-grow">
          <option v-for="(m, i) in months" :key="i" :value="i">{{ m }}</option>
        </select>
        <select v-model="selectedYear" class="text-xs text-gray-400 flex-grow text-end">
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>

      <div class="grid grid-cols-7 text-center text-xs text-gray-500 mb-1 gap-1">
        <div v-for="day in weekdays" :key="day">{{ day }}</div>
      </div>

      <div class="grid grid-cols-7 text-center text-xs gap-1">
        <div
          v-for="(day, i) in calendarDays"
          :key="i"
          class="p-1 rounded cursor-pointer text-gray-300 transition-all"
          :class="{
            'text-gray-500': !day.currentMonth,
            'bg-purple-600 text-white': isSelectedDay(day.date),
            'hover:bg-gray-800': day.currentMonth,
          }"
          @click="selectDay(day.date)"
        >
          {{ day.date.getDate() }}
        </div>
      </div>

      <!-- Время -->
      <div class="flex items-center gap-2 mt-3 text-gray-400">
        <label class="text-xs text-gray-400">Время</label>
        <input
          type="number"
          min="0"
          max="23"
          v-model.number="selectedHour"
          class="w-12 border px-1 py-0.5 text-center rounded text-gray-400"
        />
        :
        <input
          type="number"
          min="0"
          max="59"
          step="5"
          v-model.number="selectedMinute"
          class="w-12 border px-1 py-0.5 text-center rounded text-gray-400"
        />
      </div>

      <!-- Кнопки -->
      <div class="flex justify-between mt-4">
        <button
          class="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
          @click="applySelection"
        >
          Выбрать
        </button>
        <button
          class="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
          @click="showPicker = false"
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const model = defineModel<any>();
const showPicker = ref(false);
const pickerRef = ref<HTMLElement | null>(null);

const today = new Date();
const selectedDate = ref(model.value || new Date());
const selectedYear = ref(selectedDate.value.getFullYear());
const selectedMonth = ref(selectedDate.value.getMonth());
const selectedHour = ref(selectedDate.value.getHours());
const selectedMinute = ref(selectedDate.value.getMinutes());

watch(model, (val) => {
  if (val) {
    selectedDate.value = new Date(val);
    selectedYear.value = val.getFullYear();
    selectedMonth.value = val.getMonth();
    selectedHour.value = val.getHours();
    selectedMinute.value = val.getMinutes();
  }
});

const toggleDropdown = () => {
  showPicker.value = !showPicker.value;
};

const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];
const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i);

const calendarDays = computed(() => {
  const start = new Date(selectedYear.value, selectedMonth.value, 1);
  const end = new Date(selectedYear.value, selectedMonth.value + 1, 0);
  const days = [];

  const firstDay = start.getDay() || 7; // Понедельник — 1, Воскресенье — 7
  const prevDays = firstDay - 1;

  // Предыдущий месяц
  const prevMonthEnd = new Date(selectedYear.value, selectedMonth.value, 0);
  for (let i = prevDays; i > 0; i--) {
    days.push({
      date: new Date(
        prevMonthEnd.getFullYear(),
        prevMonthEnd.getMonth(),
        prevMonthEnd.getDate() - i + 1
      ),
      currentMonth: false,
    });
  }

  // Текущий месяц
  for (let i = 1; i <= end.getDate(); i++) {
    days.push({
      date: new Date(selectedYear.value, selectedMonth.value, i),
      currentMonth: true,
    });
  }

  // Следующий месяц
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({
      date: new Date(selectedYear.value, selectedMonth.value + 1, i),
      currentMonth: false,
    });
  }

  return days;
});

const isSelectedDay = (date: Date) => {
  return (
    date.getFullYear() === selectedDate.value.getFullYear() &&
    date.getMonth() === selectedDate.value.getMonth() &&
    date.getDate() === selectedDate.value.getDate()
  );
};

const selectDay = (date: Date) => {
  selectedDate.value = new Date(date);
};

const applySelection = () => {
  selectedDate.value.setHours(selectedHour.value);
  selectedDate.value.setMinutes(selectedMinute.value);
  model.value = new Date(selectedDate.value);
  showPicker.value = false;
};

const formattedDate = computed(() => {
  const date = selectedDate.value;
  const day = date.toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
  const time = `${String(selectedHour.value).padStart(2, "0")}:${String(
    selectedMinute.value
  ).padStart(2, "0")}`;
  return `${day}, ${time}`;
});

const handleClickOutside = (event: MouseEvent) => {
  if (pickerRef.value && !pickerRef.value.contains(event.target as Node)) {
    showPicker.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* При необходимости добавьте адаптивность или кастомную стилизацию */
</style>
