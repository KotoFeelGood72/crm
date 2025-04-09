<template>
  <div class="">
    <div class="label dark:text-gray-400 text-xs mb-1">{{ label }}</div>
    <div class="row">
      <div class="list-input__w">
        <input
          class="block w-full text-xs dark:text-gray-400 form-textarea focus:outline-none focus:border-purple-400 dark:focus:border-gray-600 dark:bg-gray-700 dark:focus:shadow-outline-gray focus:shadow-outline-purple py-2 px-2 border dark:border-gray-600 rounded-md"
          type="text"
          v-model="localValue"
          :placeholder="place"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  label: string;
  place?: string;
  edit?: boolean;
  modelValue: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const localValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit("update:modelValue", val),
});
</script>
