<template>
  <div class="">
    <SectionHeader
      title="Лиды"
      subtitle="Раздел для работы с новыми лидами"
      button="фильтры"
      icon="solar:sun-bold"
      class="text-white"
    />
    <div class="flex flex-col gap-6 container px-6 mx-auto text-white mb-4">
      <CardLead v-for="(item, i) in leads" :key="'leads-item-' + i" :lead="item" />
    </div>
    <div class="flex flex-col gap-6 container px-6 mx-auto text-white">
      <Pagination
        :current-page="page"
        :total="totalPages"
        :per-page="perPage"
        @update:page="goToPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SectionHeader from "@/components/ui/header/SectionHeader.vue";
import CardLead from "@/components/ui/card/CardLead.vue";
import { useLeadsStore, useLeadsStoreRefs } from "@/store/useLeadsStore";
import Pagination from "@/components/ui/list/Pagination.vue";
import { onMounted, ref } from "vue";

const { getLeads, updatePage } = useLeadsStore();
const { leads, page, totalPages, perPage } = useLeadsStoreRefs();

const currentPage = ref(1);

const totalItems = 45;
// const perPage = 10;

const onPageChange = (page: number) => {
  currentPage.value = page;
  // можешь вызвать API или что-то ещё тут
};

const goToPage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    updatePage(newPage);
  }
};

onMounted(() => {
  getLeads();
});
</script>

<style scoped lang="scss"></style>
