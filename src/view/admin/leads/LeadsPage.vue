<template>
  <div class="pb-16">
    <SectionHeader
      title="Лиды"
      subtitle="Раздел для работы с новыми лидами"
      button="фильтры"
      icon="solar:sun-bold"
      class="text-white"
    />
    <div class="flex flex-col gap-6 container px-6 mx-auto text-white mb-4">
      <CardLead
        v-for="(item, i) in leads"
        :key="'leads-item-' + i"
        :lead="item"
        @deleteLead="showAlertDelete"
      />
    </div>
    <div class="flex flex-col gap-6 container px-6 mx-auto text-white">
      <Pagination
        :current-page="page"
        :total="totalPages"
        :per-page="perPage"
        @update:page="goToPage"
      />
    </div>
    <Alert
      title="Уверены что хотите удалить лид?"
      description="После удаление лида, вернуть его будет невозможно, так как он удаляется
      из базы данных"
      accept-name="Удалить"
      cancel-name="Отмена"
      :show="showAlert"
      @action="confirmDelete"
      @cancel="showAlert = !showAlert"
    />
  </div>
</template>

<script setup lang="ts">
import SectionHeader from "@/components/ui/header/SectionHeader.vue";
import CardLead from "@/components/ui/card/CardLead.vue";
import { useLeadsStore, useLeadsStoreRefs } from "@/store/useLeadsStore";
import Pagination from "@/components/ui/list/Pagination.vue";
import Alert from "@/components/ui/other/Alert.vue";
import { onMounted, ref } from "vue";

const leadIdToDelete = ref<number | null>(null);
const showAlert = ref<any>(false);

const { getLeads, updatePage, deleteLead } = useLeadsStore();
const { leads, page, totalPages, perPage } = useLeadsStoreRefs();

const goToPage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    updatePage(newPage);
  }
};

const showAlertDelete = (id: number) => {
  leadIdToDelete.value = id;
  showAlert.value = true;
};

const confirmDelete = () => {
  if (leadIdToDelete.value !== null) {
    deleteLead(leadIdToDelete.value);
    showAlert.value = false;
    leadIdToDelete.value = null;
  }
};

onMounted(() => {
  getLeads();
});
</script>

<style scoped lang="scss"></style>
