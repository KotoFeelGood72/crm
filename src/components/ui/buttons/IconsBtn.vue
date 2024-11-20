<template>
  <div
    class="icon-btn"
    @click="emit('onClick')"
    :style="'background-color:' + color"
    :class="[{ disabled: 'disabled' }, size]"
  >
    <Icons
      :icon="icon"
      :size="iconSize"
      :color="iconColor"
      :hoverColor="iconHoverColor"
    />
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";

defineProps<{
  icon?: string;
  iconSize?: string;
  iconColor?: string;
  iconHoverColor?: string;
  disabled?: boolean;
  size?: "small" | "normal" | "medium" | "large" | "big";
  color?: string;
}>();

const emit = defineEmits(["onClick"]);
</script>

<style scoped lang="scss">
.icon-btn {
  @include flex-center;
  border-radius: 4px;
  cursor: pointer;
  &.small {
    width: 20px;
    height: 20px;
  }
  &.normal {
    width: 40px;
    height: 40px;
  }
  &.medium {
    width: 51px;
    height: 51px;
  }
  &.large {
    width: 70px;
    height: 70px;
  }
  &.big {
    width: 90px;
    height: 90px;
  }
  &.small {
  }
}
</style>
