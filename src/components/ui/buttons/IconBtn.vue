<template>
  <div class="cursor-pointer">
    <Icons :icon="icon" color="inherit" :size="iconSize" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: any;
  iconSize?: any;
}>();
</script>
