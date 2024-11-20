<template>
  <Icon
    :icon="icon"
    :style="iconStyle"
    @mouseover="handleMouseOver"
    @mouseout="handleMouseOut"
  />
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref, computed } from "vue";

const props = defineProps<{
  icon: string;
  size?: any;
  color?: string;
  hoverColor?: string;
}>();

const isHovered = ref(false);

const iconStyle = computed(() => {
  return {
    fontSize: props.size || "24px",
    color: isHovered.value
      ? props.hoverColor || props.color || "black"
      : props.color || "black",
  };
});

const handleMouseOver = () => {
  isHovered.value = true;
};

const handleMouseOut = () => {
  isHovered.value = false;
};
</script>

<style scoped lang="scss"></style>
