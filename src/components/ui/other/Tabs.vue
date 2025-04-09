<template>
  <div>
    <div class="tabs flex gap-4 border-b border-gray-300 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        :class="[
          'pb-2 px-4 text-sm font-medium',
          activeTab === tab
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-500 hover:text-gray-700',
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <div class="tab-content">
      <slot :name="activeTab" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";

const props = defineProps<{
  tabs: string[];
}>();

const activeTab = ref(props.tabs[0]);

// optionally reset activeTab when props.tabs change
watchEffect(() => {
  if (!props.tabs.includes(activeTab.value)) {
    activeTab.value = props.tabs[0];
  }
});
</script>

<style scoped>
.tabs button {
  transition: all 0.2s ease;
}
</style>
