<template>
  <div class="pie__w">
    <ApexChart
      type="donut"
      :height="400"
      :width="400"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ApexChart from "vue3-apexcharts";

// Данные для кругового графика
const series = ref([44, 55, 13, 43, 22]);

// Опции графика
const chartOptions = ref({
  chart: {
    type: "donut",
    height: 300, // Задаем высоту графика
    width: 300, // Задаем ширину графика
    events: {}, // Поле events, даже если пустое
  },
  labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200, // Например, ширина при маленьком экране
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
  colors: ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FFC300"],
  legend: {
    position: "right",
    offsetY: 0,
    height: 200, // Настройка высоты для легенды
  },
});
</script>

<style scoped lang="scss">
.pie__w {
  width: 100%;
  max-width: 300px; // Максимальная ширина контейнера
  margin: 0 auto; // Центрируем контейнер
  background-color: #f7f7f7; // Замените переменную $ulight на конкретный цвет, если используется SCSS
  border-radius: 5px;
  overflow: hidden;
  padding: 20px; // Добавляем отступы для улучшения внешнего вида
}
</style>
