<template>
  <label class="block text-sm text-gray-700 dark:text-gray-400 mt-4"
    ><span>{{ label }}</span
    ><textarea
      v-model="localValue"
      class="block w-full text-sm dark:text-gray-400 form-textarea focus:outline-none focus:border-purple-400 dark:focus:border-gray-600 dark:bg-gray-700 dark:focus:shadow-outline-gray focus:shadow-outline-purple mt-1 py-3 px-4 border dark:border-gray-600 rounded-md resize-none"
      rows="3"
      :placeholder="placeholder"
    ></textarea>
  </label>
</template>

<script setup lang="ts">
import { defineEmits, computed, ref, onMounted, nextTick } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder: string;
    label?: string;
  }>(),
  {
    label: "",
    modelValue: "",
    placeholder: "Введите комментарий",
  }
);

const emit = defineEmits(["update:modelValue"]);

const localValue = computed({
  get: () => props.modelValue,
  set: (newValue) => emit("update:modelValue", newValue),
});

const textarea = ref<HTMLTextAreaElement | null>(null);

const adjustHeight = () => {
  if (textarea.value) {
    textarea.value.style.height = "auto";
    textarea.value.style.height = `${textarea.value.scrollHeight}px`;
  }
};

onMounted(() => {
  nextTick(() => {
    if (textarea.value) {
      adjustHeight();
    }
  });
});
</script>

<style scoped></style>
