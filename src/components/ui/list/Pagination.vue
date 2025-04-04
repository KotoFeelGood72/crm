<template>
  <div class="flex items-center justify-between">
    <span
      class="flex items-center font-semibold tracking-wide uppercase dark:text-gray-600 text-xs"
    >
      Показано {{ start }}–{{ end }} из {{ total }}
    </span>

    <div class="flex mt-2 sm:mt-auto sm:justify-end">
      <nav aria-label="Table navigation">
        <ul class="inline-flex items-center">
          <li>
            <IconBtn
              icon="material-symbols-light:chevron-left"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            />
          </li>

          <!-- Page Numbers -->
          <li v-for="page in pagesToShow" :key="page">
            <button
              @click="changePage(page)"
              :class="[
                'px-3 py-2 rounded-md text-xs font-medium transition-colors select-none',
                page === currentPage
                  ? 'text-white bg-purple-600 hover:bg-purple-700'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-500 dark:hover:text-gray-300 dark:hover:bg-opacity-10',
              ]"
              type="button"
            >
              {{ page }}
            </button>
          </li>

          <!-- Next Button -->
          <li>
            <IconBtn
              icon="material-symbols-light:chevron-right"
              :disabled="currentPage === 1"
              @click="changePage(currentPage + 1)"
            />
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import IconBtn from "../buttons/IconBtn.vue";

const props = defineProps<{
  currentPage: number;
  total: number;
  perPage: number;
}>();

const emit = defineEmits<{
  (e: "update:page", value: number): void;
}>();

const totalPages = computed(() => Math.ceil(props.total / props.perPage));

const start = computed(() => (props.currentPage - 1) * props.perPage + 1);
const end = computed(() => Math.min(props.currentPage * props.perPage, props.total));

const pagesToShow = computed(() => {
  const pages = [];
  const max = totalPages.value;

  let start = Math.max(1, props.currentPage - 2);
  let end = Math.min(max, start + 4);

  if (end - start < 4) start = Math.max(1, end - 4);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit("update:page", page);
  }
};
</script>
