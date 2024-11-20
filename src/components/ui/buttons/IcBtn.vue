<template>
  <div class="icon-btn" @click="emit('onClick')">
    <Icons :icon="icon" size="22" />
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";

defineProps<{
  icon?: string;
}>();

const emit = defineEmits(["onClick"]);
</script>

<style scoped lang="scss">
.icon-btn {
  @include flex-center;
  cursor: pointer;
  padding: 6px;
  transition: all 0.3s ease-in-out;
  border-radius: 4px;
  &:hover {
    background-color: $ulight;
  }
}
</style>
