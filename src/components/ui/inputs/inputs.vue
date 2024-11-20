<template>
  <div class="input">
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
  }>(),
  {
    type: "text",
    placeholder: "placeholder",
    message: "",
    error: false,
    icon: "",
    modelValue: "",
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
  width: 100%;
}
.input__w {
  border: 1px solid $bg-color-secondary;
  border-radius: 15px;
  @include flex-start;
  position: relative;
  overflow: hidden;
  .input-icon {
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
  }

  input {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    width: 100%;
    padding: 16px 15px 16px 50px;
    font-size: $body-2;
    &:focus {
      outline: none;
    }
  }
}
</style>
