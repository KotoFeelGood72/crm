<template>
  <div class="area">
    <div class="area_head">
      <div class="area_name">{{ area.name }}</div>
      <div class="area_tab__links">
        <div
          class="area_tab__link"
          :class="{ active: activeTab === 'week' }"
          @click="setTab('week')"
        >
          Неделя
        </div>
        <div
          class="area_tab__link"
          :class="{ active: activeTab === 'month' }"
          @click="setTab('month')"
        >
          Месяц
        </div>
        <div
          class="area_tab__link"
          :class="{ active: activeTab === 'year' }"
          @click="setTab('year')"
        >
          Год
        </div>
      </div>
    </div>
    <div class="area_chart">
      <VueApexCharts
        type="area"
        height="350"
        :options="chartOptions"
        :series="series"
      ></VueApexCharts>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, computed } from "vue";
import VueApexCharts from "vue3-apexcharts";

// Данные и опции графика
const state = reactive({
  activeTab: "week",
  seriesWeek: [
    {
      name: "Просмотрено клиентов",
      data: [5, 10, 15, 20, 25, 30, 35],
    },
    {
      name: "Отправлено КП",
      data: [3, 7, 10, 13, 17, 20, 25],
    },
  ],
  seriesMonth: [
    {
      name: "Просмотрено клиентов",
      data: [30, 40, 35, 50, 49, 60, 70],
    },
    {
      name: "Отправлено КП",
      data: [20, 30, 40, 45, 55, 70, 80],
    },
  ],
  seriesYear: [
    {
      name: "Просмотрено клиентов",
      data: [300, 400, 350, 500, 490, 600, 700],
    },
    {
      name: "Отправлено КП",
      data: [200, 300, 400, 450, 550, 700, 800],
    },
  ],
  chartOptions: {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    colors: ["#007bff", "#80c5ff"],
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  },
});

// Методы для переключения вкладок
const setTab = (tab: string) => {
  state.activeTab = tab;
};

const series = computed(() => {
  if (state.activeTab === "week") return state.seriesWeek;
  if (state.activeTab === "month") return state.seriesMonth;
  return state.seriesYear;
});

// Используем `toRefs` для передачи реактивных данных в шаблон
const { chartOptions, activeTab } = toRefs(state);

const area = reactive({
  name: "Работа с клиентами",
});
</script>

<style scoped lang="scss">
.area_head {
  @include flex-space;
  gap: 20px;
}

.area_tab__links {
  @include flex-end;
  gap: 10px;
  margin-bottom: 20px;
}

.area_tab__link {
  border: 1px solid $light;
  padding: 5px 20px;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: $light;
  }
  &.active {
    background-color: $light-blue;
    color: $blue;
    border-color: $blue;
  }
}

.area_chart {
  background-color: $white;
  border-radius: 5px;
  border: 1px solid $light;
}
</style>
