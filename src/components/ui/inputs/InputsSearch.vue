<template>
  <div class="input-search">
    <input type="search" :placeholder="placeholder" v-model="localValue" />
  </div>
</template>

<script setup lang="ts">
import { defineEmits, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder: string;
  }>(),
  {
    modelValue: "",
    placeholder: "Поиск клиентов ...",
  }
);

const emit = defineEmits(["update:modelValue"]);

const localValue = computed({
  get: () => props.modelValue,
  set: (newValue) => emit("update:modelValue", newValue),
});

const route = useRoute();
const router = useRouter();

watch(localValue, (newValue) => {
  const query = { ...route.query, search: newValue };
  router.push({ query });
});
</script>

<style scoped lang="scss">
.input-search {
  width: 100%;
  // margin-bottom: 20px;

  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
}
</style>
