<template>
  <div class="chip">
    <div class="chip_icon">
      <Icons :icon="icon" :size="14" />
    </div>
    <div class="chip_title">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string;
    title: string;
  }>(),
  {
    icon: "",
    title: "",
  }
);
</script>

<style scoped lang="scss">
.chip {
  @include flex-center;
  font-size: 10px;
  gap: 5px;
  padding: 4px 8px;
  background-color: #eeeeee6b;
  border-radius: 100px;
}

.chip_icon {
  @include flex-center;
}
</style>
