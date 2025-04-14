<template>
  <div class="w-full h-full flex items-center justify-center">
    <!-- <div
      class="w-full px-6 py-10 overflow-hidden light:bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:max-w-xl"
      role="dialog"
    >
      <div class="absolute top-2 right-2">
        <IconBtn
          icon="material-symbols:close-rounded"
          @click="closeAllModals(router, route)"
          class="inline-flex items-center justify-center w-6 h-6 text-gray-400 rounded dark:hover:text-gray-200 hover:text-gray-700"
          :icon-size="18"
          :class="{ 'opacity-0': isLoading }"
        />
      </div>

      <div class="relative">
        <Skeletor
          width="100%"
          class="h-full rounded-md w-full flex-grow flex absolute top-0 left-0"
          v-if="isLoading"
        />
        <p
          class="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300"
          :class="{ 'opacity-0': isLoading }"
        >
          Сменить статус
        </p>
      </div>
      <div class="relative">
        <Skeletor
          width="100%"
          class="h-full rounded-md w-full flex-grow flex absolute top-0 left-0"
          v-if="isLoading"
        />
        <span
          class="mt-4 mb-8 text-base text-gray-700 dark:text-gray-300 block"
          :class="{ 'opacity-0': isLoading }"
          >Выбрать подходящий статус из списка</span
        >
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <div v-for="(item, i) in statusList" class="relative">
          <Skeletor
            width="100%"
            class="h-full rounded-md w-full flex-grow flex absolute top-0 left-0"
            v-if="isLoading"
          />
          <btn
            :label="item.name"
            :key="'status-item' + i"
            :variant="selectedStatus === item.name ? 'primary' : 'outline'"
            @click="selectedStatus = item.name"
            :class="{ 'opacity-0': isLoading }"
          />
        </div>
      </div>
      <div class="flex items-center mt-6 gap-4 justify-end">
        <div class="relative">
          <Skeletor
            width="100%"
            class="h-full rounded-md w-full flex-grow flex absolute top-0 left-0"
            v-if="isLoading"
          />
          <btn
            label="Применить"
            @click="applyStatus"
            :class="{ 'opacity-0': isLoading }"
          />
        </div>
        <div class="relative">
          <Skeletor
            width="100%"
            class="h-full rounded-md w-full flex-grow flex absolute top-0 left-0"
            v-if="isLoading"
          />
          <btn
            label="Закрыть"
            variant="outline"
            @click="closeAllModals(router, route)"
            :class="{ 'opacity-0': isLoading }"
          />
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
// import { useModalStore } from "@/store/useModalStore";
// import btn from "@/components/ui/buttons/btn.vue";
// import { statusList } from "@/api/data";
// import { useRouter, useRoute } from "vue-router";
// import { ref, watchEffect } from "vue";
// import { useLeadsStore } from "@/store/useLeadsStore";
// import { Skeletor } from "vue-skeletor";
// import IconBtn from "@/components/ui/buttons/IconBtn.vue";

// const { getLeadById, updateLead } = useLeadsStore();
// const lead = ref<any>(null);
// const selectedStatus = ref<string | null>(null);
// const isLoading = ref<boolean>(true);
// const route = useRoute();
// const router = useRouter();

// const { closeAllModals } = useModalStore();

// const applyStatus = async () => {
//   if (selectedStatus.value && lead.value?.id) {
//     try {
//       await updateLead(lead.value.id, { status: selectedStatus.value });
//       console.log("✅ Статус обновлён:", selectedStatus.value);
//     } catch (error) {
//       console.error("❌ Ошибка при обновлении статуса:", error);
//     }

//     closeAllModals(router, route);
//   }
// };
// watchEffect(async () => {
//   const leadIdRaw = route.query.status;

//   if (!leadIdRaw || Array.isArray(leadIdRaw)) {
//     console.warn("Некорректный leadId:", leadIdRaw);
//     return;
//   }

//   const leadId = parseInt(leadIdRaw, 10);
//   if (isNaN(leadId)) return;

//   try {
//     const leadData = await getLeadById(leadId);
//     lead.value = leadData;

//     if (leadData?.acf?.status) {
//       selectedStatus.value = leadData.acf.status;
//     }
//   } catch (error) {
//     console.error(`❌ Ошибка при получении лида #${leadId}:`, error);
//   } finally {
//     setTimeout(() => {
//       isLoading.value = false;
//     }, 100);
//   }
// });
</script>
