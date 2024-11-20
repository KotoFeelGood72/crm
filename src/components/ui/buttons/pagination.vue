<!-- @format -->

<template>
  <div class="pagination">
    <div class="pagination__btn">
      <IconsBtn
        icon="solar:double-alt-arrow-left-bold-duotone"
        iconColor="white"
        iconHoverColor="white"
        iconSize="30px"
        @click="prevPage"
        :disabled="currentPage === 1"
        size="normal"
        color="#377dff"
      />
      <div class="pagination__numbers">
        <span
          v-for="page in pages"
          :key="page"
          :class="[
            'pagination__number',
            { 'pagination__number--active': page === currentPage },
          ]"
          @click="goToPage(page)"
        >
          {{ page }}
        </span>
        <input
          type="text"
          v-model="inputPage"
          @keyup.enter="onPageInput"
          class="pagination__input"
          placeholder="№"
        />
      </div>
      <IconsBtn
        icon="solar:double-alt-arrow-right-bold-duotone"
        iconColor="white"
        iconHoverColor="white"
        iconSize="30px"
        @click="nextPage"
        :disabled="currentPage === totalPages"
        size="normal"
        color="#377dff"
      />
    </div>
    <div class="total-page">
      Страница: {{ currentPage }} из {{ totalPages }}
    </div>
  </div>
</template>

<script setup lang="ts">
import IconsBtn from "./IconsBtn.vue";
import { defineEmits, defineProps, computed, ref } from "vue";

const emit = defineEmits(["prevPage", "nextPage", "goToPage"]);

const props = defineProps<{
  totalPages: number;
  currentPage: number;
}>();

const inputPage = ref("");

const prevPage = () => {
  if (props.currentPage > 1) {
    emit("prevPage");
  }
};

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit("nextPage");
  }
};

const goToPage = (page: number | string) => {
  if (typeof page === "string" && page === "...") return;
  emit("goToPage", Number(page));
  console.log("Good");
};

const onPageInput = () => {
  const page = parseInt(inputPage.value, 10);
  if (page >= 1 && page <= props.totalPages) {
    goToPage(page);
    inputPage.value = "";
  }
};

const pages = computed(() => {
  const total = props.totalPages;
  const current = props.currentPage;
  const pages = [];

  if (total <= 10) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 5) {
      for (let i = 1; i <= 6; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    } else if (current >= total - 4) {
      pages.push(1);
      pages.push("...");
      for (let i = total - 5; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = current - 2; i <= current + 2; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    }
  }

  return pages;
});
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  @include bp($point_4) {
    flex-direction: column;
  }
}

.pagination__btn {
  display: flex;
  gap: 10px;
}

.pagination__numbers {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  @include bp($point_4) {
    justify-content: center;
  }
}

.pagination__number {
  cursor: pointer;
  @include flex-center;
  min-width: 40px;
  padding: 5px 10px;
  height: 40px;
  border-radius: 5px;
  background-color: $ulight;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: $light;
  }
}

.pagination__number--active {
  background-color: $blue;
  color: $white;
}

.pagination__number--ellipsis {
  cursor: default;
}

.pagination__input {
  width: 40px;
  padding: 5px;
  border: 1px solid $light;
  border-radius: 5px;
  text-align: center;
}

.total-page {
  font-size: 14px;
}
</style>
