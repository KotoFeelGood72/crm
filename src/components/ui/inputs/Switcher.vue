<template>
  <div class="toggle-switch">
    <input type="checkbox" id="toggle-switch" v-model="isChecked" />
    <label for="toggle-switch" class="switch-label">
      <span class="switch">
        <span class="slider">
          <Icons v-if="isChecked" icon="material-symbols:check" class="icon" :size="12" />
          <Icons
            v-if="!isChecked"
            icon="material-symbols:close"
            class="icon"
            :size="12"
          />
        </span>
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);
const isChecked = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    isChecked.value = newValue;
  }
);

watch(isChecked, (newValue) => {
  emit("update:modelValue", newValue);
});
</script>

<style scoped lang="scss">
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 25px;
}

input {
  opacity: 0;
  width: 0;
  height: 0;
  display: none;
}

.switch {
  position: relative;
  display: block;
  cursor: pointer;
  width: 100%;
  height: 100%;
  background-color: $light;
  transition: 0.4s;
  border-radius: 15px;
}

.slider {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: $white;
  transition: 0.4s;
  border-radius: 50%;
}

label {
  display: flex;
  height: 25px;
}
input:checked + .switch-label .switch {
  background-color: $blue;
}

input:checked + .switch-label .slider {
  transform: translateX(22px);
}

.icon {
  font-size: 14px;
}
</style>
