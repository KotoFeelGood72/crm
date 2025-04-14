<template>
  <n-drawer
    v-model:show="modals.filter"
    @update:show="closeModal"
    placement="right"
    default-width="600px"
  >
    <n-drawer-content title="Фильтры">
      <n-scrollbar>
        <div class="flex flex-col gap-4 mb-6 flex-grow h-full">
          <n-card title="Категория и статус" size="small">
            <n-row class="grid grid-cols-2 gap-2">
              <n-select v-model:value="selectedCategory" :options="isCategories" />
              <n-select v-model:value="selectedStatus" :options="isStatus" />
            </n-row>
          </n-card>
          <n-card title="Город" size="small">
            <n-select v-model:value="selectedCity" :options="isCity" />
          </n-card>
        </div>
        <n-row class="flex items-center gap-2">
          <n-button tertiary type="success" class="flex-grow">Фильтр</n-button>
          <n-button tertiary type="error" class="flex-grow" @click="closeModal"
            >Закрыть</n-button
          >
        </n-row>
        <!-- <div v-if="lead && lead.acf" class="flex flex-col gap-2">
          <n-card title="Компания" size="small">
            <n-row class="flex flex-col gap-2">
              <n-row class="flex flex-col gap-2">
                <n-rate readonly :default-value="3" />
                <p>{{ lead.acf.reviews_count }}</p>
              </n-row>
              <n-input v-model:value="lead.acf.city" placeholder="Город" />
              <n-input v-model:value="lead.acf.spring" placeholder="Источник" />
              <n-input v-model:value="lead.acf.vk" placeholder="ВКонтакте" />
              <n-input v-model:value="lead.acf.youtube" placeholder="Youtube" />
            </n-row>
          </n-card>
          <n-card title="Номера телефонов" size="small">
            <n-dynamic-input
              v-model:value="lead.acf.phone_list"
              :max="10"
              item-style="margin-bottom: 6px"
              :on-create="() => ({ item: '' })"
            >
              <template #default="{ value }">
                <n-input v-model:value="value.item" placeholder="Телефон" />
              </template>
            </n-dynamic-input>
          </n-card>
          <n-card title="What`s App" size="small">
            <n-row>
              <n-dynamic-input
                v-model:value="lead.acf.whatsapps_list"
                :max="10"
                item-style="margin-bottom: 6px"
                :on-create="() => ({ item: '' })"
              >
                <template #default="{ value }">
                  <n-input v-model:value="value.item" placeholder="Телефон" />
                </template>
              </n-dynamic-input>
            </n-row>
          </n-card>
          <n-card title="Telegram" size="small">
            <n-row>
              <n-dynamic-input
                v-model:value="lead.acf.telegrams_list"
                :max="10"
                item-style="margin-bottom: 6px"
                :on-create="() => ({ item: '' })"
              >
                <template #default="{ value }">
                  <n-input v-model:value="value.item" placeholder="Телефон" />
                </template>
              </n-dynamic-input>
            </n-row>
          </n-card>
          <n-card title="E-Mail" size="small">
            <n-row>
              <n-dynamic-input
                v-model:value="lead.acf.emails_list"
                :max="10"
                item-style="margin-bottom: 6px"
                :on-create="() => ({ item: '' })"
              >
                <template #default="{ value }">
                  <n-input v-model:value="value.item" placeholder="Телефон" />
                </template>
              </n-dynamic-input>
            </n-row>
          </n-card>
          <n-card title="Website" size="small">
            <n-row>
              <n-dynamic-input
                v-model:value="lead.acf.websites_list"
                :max="10"
                item-style="margin-bottom: 6px"
                :on-create="() => ({ item: '' })"
              >
                <template #default="{ value }">
                  <n-input v-model:value="value.item" placeholder="Телефон" />
                </template>
              </n-dynamic-input>
            </n-row>
          </n-card>
          <n-row class="flex items-center gap-2">
            <n-button tertiary type="primary" class="flex-grow"> Сохранить </n-button>
            <n-button tertiary type="error" class="flex-grow" @click="closeModal">
              Закрыть
            </n-button>
          </n-row>
        </div>
        <n-space v-else class="absolute top-[50%] left-[50%] -translate-[-50%, -50%]">
          <n-spin size="large" />
        </n-space> -->
      </n-scrollbar>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { useModalStoreRefs, useModalStore } from "@/store/useModalStore";
import { useLeadsStoreRefs } from "@/store/useLeadsStore";
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { mapToSelectOptions } from "@/utils/mapToSelectOptions";
const { modals } = useModalStoreRefs();
const { closeAllModals } = useModalStore();

// const { getLeadById } = useLeadsStore();
const {
  categories,
  selectedCategory,
  statuses,
  cities,
  selectedStatus,
  selectedCity,
} = useLeadsStoreRefs();
const route = useRoute();
const router = useRouter();
const lead = ref<any>(null);

const closeModal = () => {
  closeAllModals(router, route);
  lead.value = null;
};

const isCategories = computed(() => {
  return mapToSelectOptions(categories.value, "name", "id", true);
});

const isStatus = computed(() => {
  return mapToSelectOptions(statuses.value, "label", "key", true);
});

const isCity = computed(() => {
  return mapToSelectOptions(cities.value, "name", "id", true);
});

// const ensureArray = (value: any) =>
//   Array.isArray(value)
//     ? value.filter(
//         (e) =>
//           e && typeof e === "object" && typeof e.item === "string" && e.item.trim() !== ""
//       )
//     : [];

// watchEffect(async () => {
//   const leadId = route.query.lead;
//   if (leadId && modals.value.nLead) {
//     const result = await getLeadById(leadId);

//     // Гарантируем, что все списки массивы
//     result.acf.phone_list = ensureArray(result.acf.phone_list).filter(
//       (e) => e?.item?.trim?.() !== ""
//     );
//     result.acf.whatsapps_list = ensureArray(result.acf.whatsapps_list).filter(
//       (e) => e?.item?.trim?.() !== ""
//     );
//     result.acf.telegrams_list = ensureArray(result.acf.telegrams_list).filter(
//       (e) => e?.item?.trim?.() !== ""
//     );
//     result.acf.emails_list = ensureArray(result.acf.emails_list).filter(
//       (e) => e?.item?.trim?.() !== ""
//     );
//     result.acf.websites_list = ensureArray(result.acf.websites_list).filter(
//       (e) => e?.item?.trim?.() !== ""
//     );

//     lead.value = result;
//     console.log("lead получен:", lead.value);
//   }
// });
</script>

<style scoped></style>
