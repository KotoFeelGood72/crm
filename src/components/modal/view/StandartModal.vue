<template>
  <div
    class="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl"
    role="dialog"
  >
    <header class="flex justify-end">
      <button
        @click="closeAllModals()"
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

    <p class="mt-4 mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
      <!-- {{ current.title }} -->
      ss
    </p>

    <div class="mb-6 text-sm text-gray-700 dark:text-gray-400">
      <!-- {{ current.message }} -->
    </div>

    <footer
      class="flex flex-col items-center justify-end px-6 py-3 -mx-6 -mb-4 space-y-4 sm:space-y-0 sm:space-x-6 sm:flex-row bg-gray-50 dark:bg-gray-800"
    >
      <template>
        <div class="hidden sm:block">
          <button
            @click="closeAllModals()"
            class="px-4 py-2 rounded-lg text-sm text-gray-600 border border-gray-300 dark:text-gray-400 hover:border-gray-500 focus:shadow-outline-gray"
            type="button"
          >
            Закрыть
          </button>
        </div>
        <div class="block w-full sm:hidden">
          <button
            @click="closeAllModals()"
            class="w-full px-5 py-3 rounded-lg text-gray-600 border border-gray-300 dark:text-gray-400 hover:border-gray-500 focus:shadow-outline-gray"
            type="button"
          >
            Закрыть
          </button>
        </div>
      </template>

      <template>
        <div class="hidden sm:block">
          <button
            @click="closeAllModals()"
            class="px-4 py-2 rounded-lg text-sm text-white bg-purple-600 border border-transparent hover:bg-purple-700 focus:shadow-outline-purple"
            type="button"
          >
            <!-- {{ current.title }} -->
          </button>
        </div>
        <div class="block w-full sm:hidden">
          <button
            @click="closeAllModals()"
            class="w-full px-5 py-3 rounded-lg text-white bg-purple-600 border border-transparent hover:bg-purple-700 focus:shadow-outline-purple"
            type="button"
          >
            <!-- {{ confirmText }} -->
          </button>
        </div>
      </template>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useModalStore, useModalStoreRefs } from "@/store/useModalStore";

const { closeAllModals } = useModalStore();
</script>
