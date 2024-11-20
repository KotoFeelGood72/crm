<template>
  <component :is="`h${level}`" :class="sizes">
    {{ title }} <span><slot></slot></span>
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    title?: string;
    level?: number;
    size?: number;
  }>(),
  {
    title: "",
    level: 1,
    size: 1,
  }
);

const sizes = computed(() => {
  return `heading-${props.size}`;
});
</script>

<style lang="scss" scoped>
.heading-1 {
  font-size: $heading-1;
}
.heading-2 {
  font-size: $heading-2;
}
.heading-3 {
  font-size: $heading-3;
}
.heading-4 {
  font-size: $heading-4;
}
.heading-5 {
  font-size: $heading-5;
}
.heading-6 {
  font-size: $heading-6;
}
.heading-7 {
  font-size: $heading-7;
}
.heading-8 {
  font-size: $heading-8;
}
.heading-9 {
  font-size: $heading-9;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: $text-color-primary;
}
</style>
