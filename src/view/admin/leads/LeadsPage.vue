<template>
  <div class="pb-16">
    <ModalLead />
    <n-page-header subtitle="История действий" class="mb-6">
      <n-grid :cols="5">
        <n-gi>
          <n-statistic label="Кол-во" value="125" />
        </n-gi>
        <n-gi>
          <n-statistic label="Удалений" value="22" />
        </n-gi>
        <n-gi>
          <n-statistic label="Количество" value="36" />
        </n-gi>
        <n-gi>
          <n-statistic label="Topics" value="83" />
        </n-gi>
        <n-gi>
          <n-statistic label="Reference Links" value="2,346" />
        </n-gi>
      </n-grid>
      <template #title>
        <a
          href="https://anyway.fm/"
          style="text-decoration: none; color: inherit"
        >
          Лиды
        </a>
      </template>
      <template #header>
        <n-breadcrumb>
          <n-breadcrumb-item>Рабочий стол</n-breadcrumb-item>
          <n-breadcrumb-item>История</n-breadcrumb-item>
        </n-breadcrumb>
      </template>
      <template #avatar>
        <n-avatar
          src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg"
        />
      </template>
      <template #extra>
        <n-space>
          <n-button>Refresh</n-button>
          <!-- <n-dropdown :options="options" placement="bottom-start">
            <n-button :bordered="false" style="padding: 0 4px"> ··· </n-button>
          </n-dropdown> -->
        </n-space>
      </template>
      <template #footer> As of April 3, 2021 </template>
    </n-page-header>
    <div class="flex flex-col gap-6 container mx-auto text-white mb-4">
      <CardLead
        v-for="(item, i) in leads"
        :key="'leads-item-' + i"
        :lead="item"
      />
    </div>
    <div class="flex flex-col gap-6 container px-6 mx-auto text-white">
      <n-pagination
        v-model:page="page"
        :page-count="totalPages"
        @update:page="goToPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ModalLead from "@/components/nModal/ModalLead.vue";
import CardLead from "@/components/ui/card/CardLead.vue";
import { useLeadsStore, useLeadsStoreRefs } from "@/store/useLeadsStore";
import Pagination from "@/components/ui/list/Pagination.vue";
// import Alert from "@/components/ui/other/Alert.vue";
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

// const showAlertDelete = (id: number) => {
//   leadIdToDelete.value = id;
//   showAlert.value = true;
// };

const confirmDelete = () => {
  // deleteLead(leadIdToDelete.value);
  // if (leadIdToDelete.value !== null) {
  //   showAlert.value = false;
  //   leadIdToDelete.value = null;
  // }
};

onMounted(() => {
  getLeads();
});
</script>

<style scoped lang="scss"></style>
