<template>
  <div :class="['icon', sizeClass]" :style="{ color: props.color }">
    <svg aria-hidden="true">
      <use :xlink:href="symbolId" />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  prefix: {
    type: String,
    default: "icon",
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 24,
  },
  color: {
    type: String,
    default: "",
  },
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
const sizeClass = computed(() => `size-${props.size}`);
</script>

<style scoped lang="scss">
svg {
  fill: currentColor;
  width: 100%;
  height: 100%;
}

.icon {
  @include flex-center;
  &.size-14 {
    width: 14px;
    height: 14px;
  }
  &.size-16 {
    width: 16px;
    height: 16px;
  }
  &.size-18 {
    width: 18px;
    height: 18px;
  }
  &.size-20 {
    width: 20px;
    height: 20px;
  }
  &.size-22 {
    width: 22px;
    height: 22px;
  }
  &.size-24 {
    width: 24px;
    height: 24px;
  }
  &.size-26 {
    width: 26px;
    height: 26px;
  }
  &.size-28 {
    width: 28px;
    height: 28px;
  }
  &.size-30 {
    width: 30px;
    height: 30px;
  }
  &.size-32 {
    width: 32px;
    height: 32px;
  }
  &.size-34 {
    width: 34px;
    height: 34px;
  }
}
</style>
