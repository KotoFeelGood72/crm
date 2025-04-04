<template>
  <div
    class="w-full px-6 py-10 overflow-hidden light:bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:max-w-xl"
    role="dialog"
  >
    <header class="flex justify-end absolute top-6 right-6">
      <button
        @click="closeAllModals(router, route)"
        class="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover:text-gray-700"
        aria-label="close"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          />
        </svg>
      </button>
    </header>

    <p class="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
      Сменить статус
    </p>
    <span class="mt-4 mb-8 text-base text-gray-700 dark:text-gray-300 block"
      >Выбрать подходящий статус из списка</span
    >
    <div class="flex items-center gap-2 flex-wrap">
      <btn
        :label="item.name"
        v-for="(item, i) in statusList"
        :key="'status-item' + i"
        :variant="selectedStatus === item.name ? 'primary' : 'outline'"
        @click="selectedStatus = item.name"
      />
    </div>
    <div class="flex items-center mt-6 gap-4 justify-end">
      <btn label="Применить" @click="applyStatus" />
      <btn label="Закрыть" variant="outline" @click="closeAllModals(router, route)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModalStore, useModalStoreRefs } from "@/store/useModalStore";
import btn from "@/components/ui/buttons/btn.vue";
import { statusList } from "@/api/data";
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
const selectedStatus = ref<string | null>(null);

const route = useRoute();
const router = useRouter();

const { closeAllModals } = useModalStore();

const applyStatus = () => {
  if (selectedStatus.value) {
    console.log("Выбран статус:", selectedStatus.value);
    // тут можешь отправить его в API, обновить store, и т.д.
    closeAllModals(router, route);
  }
};
</script>
