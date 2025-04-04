<template>
  <div class="container grid px-6 mx-auto">
    <h1 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
      {{ title }}
    </h1>
    <div
      class="flex items-center justify-between p-4 mb-8 text-sm font-semibold text-purple-100 bg-purple-600 rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple"
    >
      <div class="flex items-center gap-2">
        <Icons :icon="icon" color="inherit" />
        <span>{{ subtitle }}</span>
      </div>
      <span>{{ button }} <span>→</span></span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: any;
  subtitle: any;
  icon: any;
  button: any;
}>();
</script>

<style scoped lang="scss"></style>
