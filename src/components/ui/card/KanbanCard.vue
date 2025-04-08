<template>
  <div class="p-4">
    <CardHead :name="name" :count="count" @click="$emit('click')" class="mb-4" />
    <draggable
      :list="localValue"
      :animation="200"
      group="deals"
      item-key="id"
      :emptyInsert="true"
      class="kanban__cards flex flex-col gap-4"
      :data-status="name"
      @start="
        (e) => {
          e.item._oldStatus = e.from.dataset.status;
        }
      "
      @end="
        (e) => {
          const newStatus = e.to.dataset.status;
          const oldStatus = e.item._oldStatus;
          $emit('end', e, newStatus, oldStatus);
        }
      "
    >
      <template #item="{ element }">
        <div>
          <slot name="card" :card="element" />
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CardHead from "./CardHead.vue";
// @ts-ignore
import draggable from "vuedraggable";

const emit = defineEmits(["click", "end", "update:modelValue"]);

const props = defineProps<{
  name?: string;
  count?: any;
  modelValue: any[];
}>();

const localValue = computed({
  get: () => props.modelValue,
  set: (value: any[]) => {
    emit("update:modelValue", value);
  },
});
</script>
