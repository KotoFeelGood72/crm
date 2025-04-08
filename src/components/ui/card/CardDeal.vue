<template>
  <div class="text-gray-400 bg-gray-700 p-4 rounded-md">
    <div class="flex gap-1 mb-4">
      <div class="h-2 flex-1 rounded-full bg-blue-500"></div>
      <div class="h-2 flex-1 rounded-full bg-green-500"></div>
      <div class="h-2 flex-1 rounded-full bg-yellow-400"></div>
      <div class="h-2 flex-1 rounded-full bg-red-500"></div>
    </div>
    <div class="flex items-center justify-between mb-2">
      <div class="text-xs">27.05.2021</div>

      <IconBtn
        icon="solar:menu-dots-bold"
        class="inline-flex items-center justify-center w-6 h-6 text-gray-400 rounded dark:hover:text-gray-200 hover:text-gray-700"
        :icon-size="18"
      />
    </div>
    <div class="text-sm mb-4">{{ card.acf.name }}</div>
    <div class="flex items-center gap-2 mt-2">
      <Chips name="Контекстная реклама" icon="solar:shop-bold" color="gray" />
      <Chips name="150 000" icon="f7:money-rubl-circle-fill" color="gray" />
    </div>
    <div class="mt-2">
      <Chips name="+7 (961) 531-13-86" color="gray" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Chips from "../buttons/Chips.vue";
import IconBtn from "../buttons/IconBtn.vue";

const props = defineProps<{
  card?: any;
}>();

console.log("card", props.card);
</script>
