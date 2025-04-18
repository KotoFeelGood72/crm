<template>
  <div>
    <CardWork
      v-for="(item, i) in workList"
      :key="'work-list-item' + i"
      :work="item"
    />
  </div>
</template>

<script setup lang="ts">
import CardWork from "../card/CardWork.vue";

const props = defineProps<{
  workList: any;
}>();
</script>
