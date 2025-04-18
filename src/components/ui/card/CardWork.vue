<template>
  <n-card :title="work.title"> </n-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  work: any;
}>();
</script>
