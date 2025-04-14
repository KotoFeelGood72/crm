<template>
  <n-drawer
    v-model:show="modals.nDeal"
    @update:show="closeModal"
    placement="right"
    default-width="600px"
  >
    <n-drawer-content :title="deal?.acf?.name">
      <n-scrollbar>
        <div v-if="deal && deal.acf" class="flex flex-col gap-2">
          <n-card title="Компания" size="small">
            <n-row class="flex flex-col gap-2">
              <n-row class="flex flex-col gap-2">
                <n-rate readonly :default-value="3" />
                <p>{{ deal.acf.reviews_count }}</p>
              </n-row>
              <n-input v-model:value="deal.acf.city" placeholder="Город" />
              <n-input v-model:value="deal.acf.spring" placeholder="Источник" />
              <n-input v-model:value="deal.acf.vk" placeholder="ВКонтакте" />
              <n-input v-model:value="deal.acf.youtube" placeholder="Youtube" />
            </n-row>
          </n-card>
          <n-card title="Номера телефонов" size="small">
            <n-dynamic-input
              v-model:value="deal.acf.phone_list"
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
                v-model:value="deal.acf.whatsapps_list"
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
                v-model:value="deal.acf.telegrams_list"
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
                v-model:value="deal.acf.emails_list"
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
                v-model:value="deal.acf.websites_list"
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
        </n-space>
      </n-scrollbar>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { useModalStoreRefs, useModalStore } from "@/store/useModalStore";
import { useDealStore } from "@/store/useDealStore";
import { useRoute, useRouter } from "vue-router";
import { ref, watchEffect } from "vue";
const { modals } = useModalStoreRefs();
const { closeAllModals } = useModalStore();

const { getDealById } = useDealStore();
const route = useRoute();
const router = useRouter();
const deal = ref<any>(null);

const closeModal = () => {
  closeAllModals(router, route);
  deal.value = null;
};

const ensureArray = (value: any) =>
  Array.isArray(value)
    ? value.filter(
        (e) =>
          e && typeof e === "object" && typeof e.item === "string" && e.item.trim() !== ""
      )
    : [];

watchEffect(async () => {
  const dealId = route.query.deal;
  if (dealId && modals.value.nDeal) {
    const result: any = await getDealById(dealId);

    // Гарантируем, что все списки массивы
    result.acf.phone_list = ensureArray(result.acf.phone_list).filter(
      (e) => e?.item?.trim?.() !== ""
    );
    result.acf.whatsapps_list = ensureArray(result.acf.whatsapps_list).filter(
      (e) => e?.item?.trim?.() !== ""
    );
    result.acf.telegrams_list = ensureArray(result.acf.telegrams_list).filter(
      (e) => e?.item?.trim?.() !== ""
    );
    result.acf.emails_list = ensureArray(result.acf.emails_list).filter(
      (e) => e?.item?.trim?.() !== ""
    );
    result.acf.websites_list = ensureArray(result.acf.websites_list).filter(
      (e) => e?.item?.trim?.() !== ""
    );

    deal.value = result;
    console.log("deal получен:", deal.value);
  }
});
</script>

<style scoped></style>
