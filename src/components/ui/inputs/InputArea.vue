<template>
  <div class="input-area">
    <textarea
      class="text-gray-400"
      v-model="localValue"
      :placeholder="placeholder"
      ref="textarea"
      :rows="rows"
      @input="adjustHeight"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, computed, ref, onMounted, nextTick } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder: string;
    rows?: number;
  }>(),
  {
    rows: 3,
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

<style scoped lang="scss">
.input-area {
  textarea {
    background-color: #8d8d8d1e;
    width: 100%;
    border-radius: 8px;
    padding: 20px;
    resize: none; // Запрещаем изменение размера вручную
    overflow: hidden; // Скрываем скролл
    &:focus {
      outline: none;
      border: 1px solid $secondary-blue-active;
    }
  }
}
</style>
