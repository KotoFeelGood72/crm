<template>
  <n-calendar
    v-model:value="selectedDate"
    :first-day-of-week="1"
    @update:value="onDayClick"
  >
    <template #="{ year, month, date }">
      <div class="p-1">
        <!-- <div class="text-xs font-bold">{{ date }}</div> -->

        <ul class="text-[10px] leading-tight mt-1">
          <li
            v-for="(event, index) in events[
              getDateKey(year, month, date)
            ]?.slice(0, 2)"
            :key="index"
          >
            {{ event }}
          </li>
          <li v-if="events[getDateKey(year, month, date)]?.length > 2">
            + ещё
          </li>
        </ul>
      </div>
    </template>
  </n-calendar>

  <n-drawer v-model:show="showDrawer" :width="400" placement="right">
    <n-drawer-content :title="formattedSelectedDate">
      <n-input
        v-model:value="newEvent"
        placeholder="Введите событие"
        @keyup.enter="addEvent"
      />
      <n-button class="mt-4" type="primary" block @click="addEvent"
        >Добавить</n-button
      >

      <div class="mt-4">
        <h4 class="font-semibold">События на день:</h4>
        <ul class="mt-2 pl-4 list-disc">
          <li
            v-for="(event, index) in events[normalizeDate(selectedDate)]"
            :key="index"
          >
            {{ event }}
          </li>
        </ul>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  NCalendar,
  NDrawer,
  NDrawerContent,
  NButton,
  NInput,
  useMessage,
} from "naive-ui";

const selectedDate = ref<number>(Date.now());
const showDrawer = ref(false);
const newEvent = ref("");
const events = ref<Record<string, string[]>>({});

const message = useMessage();

const normalizeDate = (timestamp: number) => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
};

const onDayClick = (timestamp: number) => {
  selectedDate.value = timestamp;
  showDrawer.value = true;
};

const addEvent = () => {
  const key = normalizeDate(selectedDate.value);
  if (!newEvent.value.trim()) return;

  if (!events.value[key]) events.value[key] = [];
  events.value[key].push(newEvent.value.trim());
  newEvent.value = "";
  message.success("Событие добавлено");
};

const formattedSelectedDate = computed(() =>
  format(selectedDate.value, "d MMMM yyyy", { locale: ru })
);

const getDateKey = (year: number, month: number, date: number) => {
  const d = new Date(year, month - 1, date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
};
</script>
