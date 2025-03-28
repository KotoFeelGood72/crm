<template>
  <div class="input">
    <div class="label" v-if="label">{{ label }}</div>
    <div class="input__w">
      <div class="input-icon" v-if="icon">
        <SvgIcon :name="icon" />
      </div>
      <input :type="type" :placeholder="placeholder" v-model="localValue" />
    </div>
    <span v-if="error" class="input-message">{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    type?: string;
    placeholder?: string;
    message?: string;
    error?: boolean;
    icon: string;
    modelValue: string;
    label?: string;
  }>(),
  {
    type: "text",
    placeholder: "placeholder",
    message: "",
    error: false,
    icon: "",
    modelValue: "",
    label: "",
  }
);

const emit = defineEmits(["update:modelValue"]);

const localValue = computed({
  get: () => props.modelValue,
  set: (newValue) => emit("update:modelValue", newValue),
});
</script>

<style scoped lang="scss">
.input {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  .label {
    font-size: 12px;
    font-weight: 600;
  }
  input {
    -webkit-appearance: none;
    appearance: none;
    -moz-appearance: none;
    border: 1px solid #cccccc;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 14px;
    width: 100%;
    background-color: $white;
  }
}
</style>
