<template>
  <Transition name="slide-fade">
    <div
      v-if="show"
      class="w-full px-4 py-6 overflow-hidden light:bg-white rounded-t-lg dark:bg-gray-700 sm:rounded-lg sm:max-w-sm fixed bottom-6 right-6"
    >
      <div class="absolute top-2 right-2">
        <IconBtn
          icon="material-symbols:close-rounded"
          class="inline-flex items-center justify-center w-6 h-6 text-gray-400 rounded dark:hover:text-gray-200 hover:text-gray-700"
          :icon-size="18"
          @click="emit('cancel')"
        />
      </div>

      <p class="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        {{ title }}
      </p>
      <span class="mt-2 mb-2 text-xs text-gray-700 dark:text-gray-300 block"
        >{{ description }}
      </span>
      <div class="flex items-center mt-4 gap-4 justify-end">
        <btn :label="acceptName ?? ''" @click="emit('action')" />
        <btn
          :label="cancelName ?? ''"
          variant="outline"
          @click="emit('cancel')"
        />
      </div>
    </div>
  </Transition>
</template>
<script setup lang="ts">
import btn from "@/components/ui/buttons/btn.vue";
import IconBtn from "@/components/ui/buttons/IconBtn.vue";

defineProps<{
  title?: string;
  show?: boolean;
  description?: string;
  onClose?: any;
  onAction?: any;
  acceptName?: string;
  cancelName?: string;
}>();

const emit = defineEmits<{
  (e: "action"): void;
  (e: "cancel"): void;
}>();
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.slide-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
