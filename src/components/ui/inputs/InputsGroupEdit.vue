<template>
  <div class="w-full">
    <div class="label dark:text-gray-400 text-xs mb-1">
      {{ label }}
    </div>

    <div class="flex flex-wrap items-center gap-1 mb-1">
      <div
        v-for="(entry, index) in modelValue"
        :key="index"
        class="relative flex-grow"
      >
        <input
          class="block w-full text-xs dark:text-gray-400 form-textarea focus:outline-none focus:border-purple-400 dark:focus:border-gray-600 dark:bg-gray-700 dark:focus:shadow-outline-gray focus:shadow-outline-purple py-2 px-2 border dark:border-gray-600 rounded-md"
          type="text"
          v-model="entry.item"
          :placeholder="place"
        />
        <div
          v-if="edit"
          class="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center"
        >
          <Icons
            icon="ic:baseline-close"
            class="text-red-500 hover:text-red-600"
            :size="16"
            @click="remove(index)"
          />
        </div>
      </div>
    </div>

    <div
      v-if="edit"
      class="flex items-center gap-1 text-[12px] font-medium text-[#f0a029e9] border border-dashed border-[#f0a0296b] px-2 py-1 cursor-pointer transition hover:bg-[#f0a02935] bg-[#f0a02912] w-fit"
      @click="add"
    >
      <div class="flex items-center justify-center">
        <Icons icon="ic:round-plus" :size="14" color="#f0a029e9" />
      </div>
      <p>Добавить</p>
    </div>
  </div>
</template>

<script setup lang="ts">
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
