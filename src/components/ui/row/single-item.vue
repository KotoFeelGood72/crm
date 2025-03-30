<template>
  <div class="list-item">
    <div class="label">{{ label }}</div>
    <div class="row">
      <div class="list-input__w">
        <inputs v-model="localValue" :placeholder="place" :disabled="!edit" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import inputs from "../inputs/inputs.vue";

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

<style scoped lang="scss">
.list-item {
  width: 100%;
}

.label {
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 5px;
}
.list-input__w {
  position: relative;
  flex-grow: 1;
}

.remove_ic {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
  @include flex-center;
  cursor: pointer;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.add {
  @include flex-center;
  gap: 5px;
  background-color: #f0a02912;
  padding: 5px;
  font-size: 12px;
  font-weight: 500;
  border: 1px dashed #f0a0296b;
  color: #f0a029e9;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: #f0a02935;
  }
}

.add-icon {
  @include flex-center;
}
</style>
