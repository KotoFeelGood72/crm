<template>
  <div class="deals min-h-screen">
    <SectionHeader
      title="Сделки"
      subtitle="Раздел для работы с сделками"
      button="фильтры"
      icon="solar:sun-bold"
      class="text-white"
    />

    <div class="container mx-auto rounded-lg overflow-hidden">
      <div class="flex overflow-x-auto touch-pan-x scroll-smooth gap-4 px-6">
        <div
          class="kanban__column bg-gray-800 rounded-md w-80 flex-shrink-0 min-w-[320px]"
          v-for="status in statuses"
          :key="status.id"
        >
          <KanbanCard
            :name="status.name"
            :count="groupedDeals[status.name]?.length || 0"
            @end="
              (e, newStatus, oldStatus) => onCardDrop(e, newStatus, oldStatus)
            "
            v-model="groupedDeals[status.name]"
          >
            <template #card="{ card }">
              <CardDeal
                :card="card"
                class="cursor-pointer"
                @click="openModal('deal', '', { deal: card.id }, router)"
              />
            </template>
          </KanbanCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import SectionHeader from "@/components/ui/header/SectionHeader.vue";
import { useDealStore, useDealStoreRefs } from "@/store/useDealStore";
import CardDeal from "@/components/ui/card/CardDeal.vue";
import KanbanCard from "@/components/ui/card/KanbanCard.vue";
import { useModalStore } from "@/store/useModalStore";
import { useRouter } from "vue-router";
// @ts-ignore
import draggable from "vuedraggable";
import "@vuepic/vue-datepicker/dist/main.css";

const groupedDeals = ref<Record<string, any[]>>({});

const { openModal } = useModalStore();
const router = useRouter();
const { updateDeal, getDeals } = useDealStore();
const { deals, statuses } = useDealStoreRefs();

const onCardDrop = async (event: any, newStatus: string, oldStatus: string) => {
  const movedCard = event.item.__draggable_context.element;

  if (!newStatus || !movedCard) return;

  // Если статус не поменялся — просто сортировка
  if (oldStatus === newStatus) return;

  // Обновляем статус на сервере
  await updateDeal(movedCard.id, { status: newStatus });

  // Обновляем статус локально — draggable уже переместил карточку
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
  await getDeals();
  initGroupedDeals();
});
</script>
