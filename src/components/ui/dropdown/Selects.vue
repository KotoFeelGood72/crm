<template>
  <div class="custom-select" @click.stop="toggleDropdown">
    <div class="select-trigger">
      <span>{{ selectedOption ? getSelectedOptionName() : placeholder }}</span>
      <span class="arrow" :class="{ open: dropdownOpen }">
        <Icons icon="bi:chevron-up" :size="12" />
      </span>
    </div>
    <div class="select-dropdown" v-if="dropdownOpen">
      <div
        class="select-option"
        v-for="option in options"
        :key="option.id"
        @click.stop="selectOption(option.id)"
        :class="{ active: option.id === selectedOption }"
      >
        {{ option.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, onBeforeUnmount, watch } from "vue";

const props = defineProps<{
  modelValue: any;
  options: any;
  placeholder: any;
}>();

const emit = defineEmits(["update:modelValue"]);

const selectedOption = ref(props.modelValue);
const dropdownOpen = ref(false);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const selectOption = (option: string) => {
  selectedOption.value = option;
  emit("update:modelValue", option);
  dropdownOpen.value = false;
};

const getSelectedOptionName = () => {
  const option = props.options.find((opt: any) => opt.id === selectedOption.value);
  return option ? option.name : "";
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".custom-select")) {
    dropdownOpen.value = false;
  }
};

watch(
  () => props.modelValue,
  (newValue) => {
    selectedOption.value = newValue;
  }
);

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped lang="scss">
.custom-select {
  position: relative;
  width: 100%;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
}

.select-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border: 1px solid $light;
  padding: 4px;
  border-radius: 4px;
  position: relative;
}

.arrow {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  transition: transform 0.3s ease;
  @include flex-center;
}

.arrow.open {
  transform: translateY(-50%) rotate(180deg);
}

.select-dropdown {
  position: absolute;
  width: 100%;
  background-color: #fff;
  border: 1px solid $light;
  border-radius: 4px;
  margin-top: 5px;
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px; /* Width of the scrollbar */
  }

  &::-webkit-scrollbar-track {
    // background-color: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #0000005d;
  }

  // &::-webkit-scrollbar-thumb:hover {
  //   background-color: $blue;
  // }
}

.select-option {
  padding: 8px;
  cursor: pointer;
  border-right: 2px solid transparent;
  transition: all 0.1s ease-in-out;
}

.select-option:hover {
  background-color: $light;
}

.select-option.active {
  background-color: $light-blue;
  color: $blue;
  border-color: $blue;
}
</style>
