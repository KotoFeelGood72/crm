<template>
  <div class="chart__w">
    <div class="chart__header">
      <div class="chart__title">Статистика месяца</div>
      <div class="chart__value">$7650</div>
    </div>
    <div class="chart__select">
      <Selects
        :options="monthsData"
        v-model="activeMonth"
        placeholder="Выберите месяц"
      />
    </div>
    <ApexChart type="bar" height="300" :options="chartOptions" :series="series" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import ApexChart from "vue3-apexcharts";
import Selects from "../ui/dropdown/Selects.vue";

// Данные по месяцам
const monthsData = ref<any>([
  { id: "Январь", name: "Январь", data: [1200, 1500, 800, 1100, 1600, 1400, 1050] },
  { id: "Февраль", name: "Февраль", data: [1300, 1400, 900, 1200, 1500, 1300, 950] },
  { id: "Март", name: "Март", data: [1100, 1600, 900, 1300, 1400, 1500, 1200] },
  { id: "Апрель", name: "Апрель", data: [1000, 1700, 800, 1400, 1600, 1100, 1300] },
  { id: "Май", name: "Май", data: [1400, 1300, 1100, 1500, 1800, 1400, 1150] },
  { id: "Июнь", name: "Июнь", data: [1200, 1600, 1000, 1300, 1700, 1200, 1400] },
  { id: "Июль", name: "Июль", data: [1100, 1500, 950, 1200, 1600, 1400, 1350] },
  { id: "Август", name: "Август", data: [1150, 1550, 1050, 1250, 1650, 1350, 1250] },
  { id: "Сентябрь", name: "Сентябрь", data: [1250, 1450, 1150, 1350, 1550, 1250, 1350] },
  { id: "Октябрь", name: "Октябрь", data: [1300, 1400, 1200, 1400, 1500, 1300, 1400] },
  { id: "Ноябрь", name: "Ноябрь", data: [1400, 1300, 1100, 1500, 1600, 1400, 1200] },
  { id: "Декабрь", name: "Декабрь", data: [1500, 1200, 1000, 1600, 1700, 1500, 1100] },
]);

// Опции для Selects
// const monthOptions = monthsData.map((month) => ({
//   label: month.name,
//   value: month.id,
// }));

// Активный месяц
// const activeMonth = ref<any>(monthOptions[0].value);
const activeMonth = ref<any>(monthsData.value[0].name);

// Серии для графика
const series = ref([
  {
    name: "Доход",
    data: monthsData.value[0].data,
  },
]);

// Настройки графика
const chartOptions = ref({
  chart: {
    type: "bar",
    height: 300,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "40%",
      endingShape: "rounded",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  },
  fill: {
    colors: ["#90e0ef"],
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: (val: number) => `$${val}`,
    },
  },
  colors: ["#90e0ef"],
});

const setMonth = (selectedValue: string) => {
  activeMonth.value = selectedValue; // Явное обновление активного месяца
  const monthData = monthsData.value.find((month) => month.id === selectedValue);
  if (monthData) {
    console.log(monthData)
    series.value[0].data = monthData.data;
  }
};


watch(activeMonth, (newMonth) => {
  const monthData = monthsData.value.find((month) => month.id === newMonth);
  if (monthData) {
    series.value[0].data = monthData.data;
  }
});

</script>

<style lang="scss" scoped>
.chart__w {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  max-width: 400px;
  margin: auto;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
}

.chart__header {
  text-align: center;
  margin-bottom: 20px;
}

.chart__title {
  font-size: 16px;
  color: #7f8c8d;
}

.chart__value {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.chart__select {
  margin-bottom: 20px;
}
</style>
