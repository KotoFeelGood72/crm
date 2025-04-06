<template>
  <div class="deals bg-gray-900 min-h-screen p-6">
    <SectionHeader
      title="Сделки"
      subtitle="Раздел для работы с сделками"
      button="фильтры"
      icon="solar:sun-bold"
      class="text-white"
    />

    <div class="flex gap-6 overflow-x-auto" v-if="!dealStore.isLoading">
      <div
        class="kanban__column bg-gray-800 rounded-2xl p-4 w-80 flex-shrink-0"
        v-for="status in statuses"
        :key="status.id"
      >
        <div class="kanban__header mb-4 flex justify-between items-center">
          <h4 class="text-white text-lg font-semibold">{{ status.name }}</h4>
          <span class="count text-gray-400 text-sm">{{
            groupedDeals[status.name]?.length || 0
          }}</span>
        </div>

        <draggable
          v-model="groupedDeals[status.name]"
          group="deals"
          item-key="id"
          :emptyInsert="true"
          @end="(e: any) => onCardDrop(e)"
          class="kanban__cards flex flex-col gap-4"
        >
          <template #item="{ element }">
            <deal
              :card="element"
              @click="openModal('deal', { deal: element.id }, router)"
              class="cursor-pointer transition hover:scale-[1.02]"
            />
          </template>
        </draggable>
      </div>
    </div>

    <Loader v-else class="bg-transparent" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import SectionHeader from "@/components/ui/header/SectionHeader.vue";
import { useDealStore, useDealStoreRefs } from "@/store/useDealStore";
import Loader from "@/components/ui/loading/Loader.vue";
import deal from "@/components/ui/card/deal.vue";
import { useModalStore } from "@/store/useModalStore";
import { useRouter } from "vue-router";
// @ts-ignore
import draggable from "vuedraggable";
import "@vuepic/vue-datepicker/dist/main.css";

const { openModal } = useModalStore();
const router = useRouter();

const groupedDeals = ref<Record<string, any[]>>({});

const dealStore = useDealStore();
const { deals, statuses } = useDealStoreRefs();

const onCardDrop = async (event: any) => {
  const movedCard = event.item.__draggable_context.element;
  const columnEl = event.to.closest(".kanban__column");
  const headerEl = columnEl?.querySelector("h4");
  const newStatus = headerEl?.textContent?.trim();

  if (!newStatus || !movedCard) return;

  if (movedCard.acf.status === newStatus) return;

  await dealStore.updateDealStatus(movedCard.id, newStatus);
  movedCard.acf.status = newStatus;
};

const initGroupedDeals = () => {
  const result: Record<string, any[]> = {};
  statuses.value.forEach((status) => {
    result[status.name] = [];
  });

  deals.value.forEach((deal) => {
    const status = deal.acf.status || "Без статуса";
    if (!result[status]) result[status] = [];
    result[status].push(deal);
  });

  groupedDeals.value = result;
};

onMounted(async () => {
  await dealStore.getDeals();
  initGroupedDeals();
});
</script>
