<template>
  <div>
    <div class="flex gap-4 mb-4">
      <btn
        :label="tab"
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        :variant="activeTab === tab ? 'primary' : 'outline'"
      />
    </div>

    <div class="tab-content">
      <slot :name="activeTab" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import btn from "../buttons/btn.vue";

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
