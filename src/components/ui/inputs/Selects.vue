<template>
  <div ref="dropdownRef" class="relative w-full max-w-sm text-sm">
    <!-- Поле ввода -->
    <div
      @click="toggleDropdown"
      class="flex flex-wrap items-center gap-1 min-h-[34px] px-2 py-1 dark:border dark:border-gray-400 rounded cursor-pointer relative bg-gray-700"
    >
      <div
        v-for="item in selectedItems"
        :key="item"
        class="flex items-center bg-gray-800 px-2 py-0.5 rounded text-gray-300 relative z-10 text-xs gap-1"
      >
        <span class="pointer-events-none">{{ item }}</span>
        <button @click.stop="removeItem(item)" class="ml-1 text-white hover:text-red-500">
          <Icons icon="zondicons:close-solid" :size="12" color="inherit" />
        </button>
      </div>
      <input
        v-model="searchQuery"
        @keydown.enter.prevent="addItem"
        class="flex-grow outline-none bg-transparent absolute top-0 left-0 w-full h-full px-2 text-gray-400"
        :placeholder="
          selectedItems.length === 0 ? placeholder || 'Выберите или введите...' : ''
        "
      />
    </div>

    <!-- Выпадающий список -->
    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 w-full bg-gray-700 shadow-md rounded border max-h-60 overflow-auto"
    >
      <div
        v-for="option in filteredOptions"
        :key="option"
        @click="toggleItem(option)"
        class="px-3 py-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-400 dark:text-white"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{
  modelValue: string[];
  options: string[];
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

const dropdownRef = ref<HTMLElement | null>(null);
const searchQuery = ref("");
const isOpen = ref(false);
const selectedItems = ref(Array.isArray(props.modelValue) ? [...props.modelValue] : []);

watch(
  () => props.modelValue,
  (val) => {
    selectedItems.value = [...val];
  }
);

watch(selectedItems, (val) => {
  emit("update:modelValue", val);
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const toggleItem = (item: string) => {
  const index = selectedItems.value.indexOf(item);
  if (index === -1) {
    selectedItems.value.push(item);
  } else {
    selectedItems.value.splice(index, 1);
  }
  searchQuery.value = "";
};

const removeItem = (item: string) => {
  selectedItems.value = selectedItems.value.filter((i) => i !== item);
};

const filteredOptions = computed(() =>
  props.options.filter(
    (o) =>
      o.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
      !selectedItems.value.includes(o)
  )
);

// const showAddOption = computed(
//   () =>
//     searchQuery.value &&
//     !props.options
//       .map((o) => o.toLowerCase())
//       .includes(searchQuery.value.toLowerCase())
// );

const addItem = () => {
  const newItem = searchQuery.value.trim();
  if (!newItem) return;

  if (!props.options.includes(newItem)) {
    props.options.push(newItem); // ⚠️ изменяет проп напрямую – лучше заменить через emit, если надо
  }
  selectedItems.value.push(newItem);
  searchQuery.value = "";
};

const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
