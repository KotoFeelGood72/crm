<template>
  <button class="rounded-full focus:shadow-outline-purple focus:outline-none">
    <div class="relative rounded-full inline-block w-8 h-8 align-middle" id="avatar">
      <img :src="img" class="object-cover w-full h-full rounded-full" />
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  img: any;
}>();
</script>

<style scoped lang="scss"></style>
