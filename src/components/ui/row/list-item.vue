<template>
  <div class="list-item">
    <div class="label">{{ label }}</div>
    <div class="row">
      <div
        v-for="(entry, index) in modelValue"
        :key="index"
        class="list-input__w"
      >
        <inputs v-model="entry.item" :placeholder="place" :disabled="!edit" />
        <div class="remove_ic">
          <Icons
            v-if="edit"
            icon="ic:baseline-close"
            class="remove"
            @click="remove(index)"
            color="red"
            :size="16"
          />
        </div>
      </div>
    </div>
    <div class="add" @click="add" v-if="edit">
      <div class="add-icon">
        <Icons icon="ic:round-plus" :size="14" color=" #f0a029e9" />
      </div>
      <p>Добавить</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import inputs from "../inputs/inputs.vue";

const props = defineProps<{
  label: string;
  place: any;
  edit?: boolean;
  modelValue: { item: string }[];
}>();

const emit = defineEmits(["update:modelValue"]);

const add = () => {
  emit("update:modelValue", [...props.modelValue, { item: "" }]);
};

const remove = (index: number) => {
  const updated = [...props.modelValue];
  updated.splice(index, 1);
  emit("update:modelValue", updated);
};
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
