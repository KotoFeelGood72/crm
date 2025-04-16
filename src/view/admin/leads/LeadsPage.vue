<template>
  <div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import ModalLead from "@/components/nModal/ModalLead.vue";
import CardLead from "@/components/ui/card/CardLead.vue";
import { useLeadsStore, useLeadsStoreRefs } from "@/store/useLeadsStore";
import { useModalStore } from "@/store/useModalStore";
import ModalFilter from "@/components/nModal/ModalFilter.vue";
// import Pagination from "@/components/ui/list/Pagination.vue";
// import Alert from "@/components/ui/other/Alert.vue";
import { onMounted } from "vue";

// const leadIdToDelete = ref<number | null>(null);
// const showAlert = ref<any>(false);

const { openModal } = useModalStore();
const { getLeads, updatePage, getCategories } = useLeadsStore();
const { leads, page, totalPages } = useLeadsStoreRefs();

const goToPage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    updatePage(newPage);
  }
};

// const showAlertDelete = (id: number) => {
//   leadIdToDelete.value = id;
//   showAlert.value = true;
// };

// const confirmDelete = () => {
// deleteLead(leadIdToDelete.value);
// if (leadIdToDelete.value !== null) {
//   showAlert.value = false;
//   leadIdToDelete.value = null;
// }
// };

onMounted(() => {
  getLeads();
  getCategories();
});
</script>

<style scoped lang="scss"></style>
