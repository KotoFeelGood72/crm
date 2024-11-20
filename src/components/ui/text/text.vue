<template>
  <component :is="el" :class="[sizes, color]" class="text">
    {{ text }}
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    text: string;
    el: "div" | "span" | "p";
    size: number;
    color: "dark" | "gray";
  }>(),
  {
    text: "",
    el: "div",
    size: 1,
  }
);

const sizes = computed(() => {
  return `text-${props.size}`;
});
</script>

<style lang="scss" scoped>
.text-1 {
  font-size: $body-1;
}
.text-2 {
  font-size: $body-2;
}
.text-3 {
  font-size: $small-1;
}
.text-4 {
  font-size: $small-2;
}
.text-5 {
  font-size: $small-3;
}
.text-6 {
  font-size: $tiny;
}

.text {
  &.gray {
    color: $text-color-quaternary;
    font-weight: 400;
  }
  &.dark {
    color: $text-color-primary;
    font-weight: 400;
  }
}
</style>
