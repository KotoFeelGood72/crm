<template>
  <div class="staff">
    <div class="staff_head">
      <ul>
        <li v-for="(item, i) in stat1" :key="'card-view-statistic-' + i">
          <CardViewStatistic :card="item" />
        </li>
      </ul>
    </div>
    <div class="staff__body">
      <DataUserGrid />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CardViewStatistic from "@/components/ui/card/CardViewStatistic.vue";
import DataUserGrid from "@/components/grid/DataUserGrid.vue";

const stat1 = ref<any>([
  {
    name: "Отправлено КП",
    value: "1452",
    icon: "solar:letter-unread-broken",
    total: "2.4",
    description: "За последний месяц",
  },
  {
    name: "Кол-во клиентов",
    value: "21",
    icon: "solar:user-check-broken",
    total: "2.4",
    description: "За последний месяц",
  },
  {
    name: "Кол-во звонков",
    value: "444",
    icon: "solar:phone-calling-rounded-broken",
    total: "2.4",
    description: "За последний месяц",
  },
  {
    name: "Отказы",
    value: "444",
    icon: "solar:user-block-broken",
    total: "2.4",
    description: "За последний месяц",
  },
]);
</script>

<style scoped lang="scss">
.staff_head {
  ul {
    @include flex-space;
    list-style: none;
    gap: 20px;
    li {
      flex-grow: 1;
    }
  }
}
</style>
