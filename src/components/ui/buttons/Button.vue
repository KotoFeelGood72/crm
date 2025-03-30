<template>
  <div class="button">
    <button type="button">
      <p>{{ name }}</p>
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    name?: string;
    icon?: string;
    color?: "danger" | "warning" | "success" | "default";
    sheme?: "primary" | "secondary";
    size?: "small" | "normal" | "medium" | "large";
    isLoading?: boolean;
  }>(),
  {
    isLoading: false,
    name: "",
    icon: "",
    color: "default",
    size: "normal",
    sheme: "primary",
  }
);
</script>

<style scoped lang="scss">
.button {
  button {
    @include flex-center;
    background-color: #f0a129;
    padding: 5px 30px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 5px;
    transition: all 0.3s ease-in-out;
    width: 100%;
    &:hover {
      background-color: #db8d17;
    }
  }
}
</style>
