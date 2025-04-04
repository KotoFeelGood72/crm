<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClass"
    class="inline-flex items-center justify-center leading-5 font-medium transition-colors duration-150 focus:outline-none gap-2"
  >
    <Icons
      v-if="icon && iconPosition === 'left'"
      :icon="icon"
      :size="iconSize"
      color="inherit"
    />
    <span v-if="label">{{ label }}</span>
    <Icons
      v-if="icon && iconPosition === 'right'"
      :icon="icon"
      :size="iconSize"
      :color="iconColor"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Icons from "@/components/ui/Icons.vue";

const props = defineProps<{
  label: string;
  icon?: string;
  iconPosition?: "left" | "right";
  variant?: "primary" | "outline" | "link";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  iconColor?: any;
  disabled?: boolean;
}>();

const buttonClass = computed(() => {
  const base = "rounded-lg focus:shadow-outline transition-colors duration-150";

  const sizes: Record<string, string> = {
    sm: "px-3 py-1 text-sm min-h-[28px]",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  };

  const variants: Record<string, string> = {
    primary:
      "text-white bg-purple-600 border-transparent hover:bg-purple-700 active:bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-800",
    outline:
      "text-gray-600 border-gray-300 hover:border-gray-500 active:text-gray-500 dark:text-gray-400 dark:border-gray-500 border",
    link:
      "text-gray-600 bg-transparent border-0 border-transparent hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-500 dark:hover:bg-opacity-10 border",
  };

  const disabledClass = props.disabled ? "opacity-50 cursor-not-allowed" : "";

  return `${base} ${sizes[props.size || "md"]} ${
    variants[props.variant || "primary"]
  } ${disabledClass}`;
});

const iconSize = computed(() => {
  switch (props.size) {
    case "sm":
      return 14;
    case "lg":
      return 20;
    case "md":
    default:
      return 16;
  }
});
</script>
