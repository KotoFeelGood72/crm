<template>
  <div :class="['default-btn', sizeClass, colorClass]" @click="onClick">
    <button type="button">
      <SvgIcon :name="icon" v-if="icon" />
      <Icons icon="eos-icons:loading" color="white" size="23px" v-if="isLoading" />
      <p>{{ name }}</p>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, computed } from "vue";

const emit = defineEmits<{
  (e: "click"): void;
}>();

const props = withDefaults(
  defineProps<{
    name?: string;
    icon?: string;
    color?: "danger" | "warning" | "success" | "default";
    sheme?: "primary" | "secondary";
    size?: "small" | "normal" | "medium" | "large";
    isLoading?: boolean;
  }>(),
  {
    isLoading: false,
    name: "",
    icon: "",
    color: "default",
    size: "normal",
    sheme: "primary",
  }
);

const onClick = () => emit("click");

const sizeClass = computed(() => {
  return {
    small: "btn-small",
    normal: "btn-normal",
    medium: "btn-medium",
    large: "btn-large",
  }[props.size];
});

const colorClass = computed(() => {
  return {
    danger: {
      primary: "btn-danger-primary",
      secondary: "btn-danger-secondary",
    },
    warning: {
      primary: "btn-warning-primary",
      secondary: "btn-warning-secondary",
    },
    success: {
      primary: "btn-success-primary",
      secondary: "btn-success-secondary",
    },
    default: {
      primary: "btn-default-primary",
      secondary: "btn-default-secondary",
    },
  }[props.color][props.sheme];
});
</script>

<style scoped lang="scss">
.default-btn {
  width: 100%;
  position: relative;
  button {
    width: 100%;
    border: none;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    p {
      font-size: $body-2;
    }
  }
}

.btn-small button {
  padding: 8px 16px;
  font-size: 12px;
}

.btn-normal button {
  padding: 12px 24px;
  font-size: 14px;
}

.btn-medium button {
  padding: 16px 32px;
  font-size: 16px;
}

.btn-large button {
  padding: 20px 40px;
  font-size: 18px;
}

.btn-danger-primary button {
  background-color: $primary-red;
  color: $bg-color-quaternary;
  &:hover {
    background-color: $primary-red-hover;
  }
  &:focus {
    background-color: $primary-red-focus;
  }
}

.btn-danger-secondary button {
  background-color: $secondary-red;
  color: $primary-red;
  &:hover {
    background-color: $secondary-red-hover;
  }
  &:focus {
    background-color: $secondary-red-focus;
  }
}

.btn-warning-primary button {
  background-color: $primary-orange;
  color: $bg-color-quaternary;
  &:hover {
    background-color: $primary-orange-hover;
  }
  &:focus {
    background-color: $primary-orange-focus;
  }
}

.btn-warning-secondary button {
  background-color: $secondary-orange;
  color: $primary-orange;
  &:hover {
    background-color: $secondary-orange-hover;
  }
  &:focus {
    background-color: $secondary-orange-focus;
  }
}

.btn-success-primary button {
  background-color: $primary-green;
  color: $bg-color-quaternary;
  &:hover {
    background-color: $primary-green-hover;
  }
  &:focus {
    background-color: $primary-green-focus;
  }
}

.btn-success-secondary button {
  background-color: $secondary-green;
  color: $primary-green;
  &:hover {
    background-color: $secondary-green-hover;
  }
  &:focus {
    background-color: $secondary-green-focus;
  }
}

.btn-default-primary button {
  background-color: $primary-blue;
  color: $bg-color-quaternary;
  &:hover {
    background-color: $primary-blue-hover;
  }
  &:focus {
    background-color: $primary-blue-focus;
  }
}

.btn-default-secondary button {
  background-color: $secondary-blue;
  color: $primary-blue;
  &:hover {
    background-color: $secondary-blue-hover;
  }
  &:focus {
    background-color: $secondary-blue-focus;
  }
}
</style>
