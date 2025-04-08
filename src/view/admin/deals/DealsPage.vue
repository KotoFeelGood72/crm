<template>
  <div class="deals bg-gray-900 min-h-screen p-6">
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
            @end="(e, newStatus, oldStatus) => onCardDrop(e, newStatus, oldStatus)"
            v-model="groupedDeals[status.name]"
          >
            <template #card="{ card }">
              <CardDeal :card="card" class="cursor-pointer" />
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
// @ts-ignore
import draggable from "vuedraggable";
import "@vuepic/vue-datepicker/dist/main.css";

const groupedDeals = ref<Record<string, any[]>>({});

const { updateDeal, getDeals } = useDealStore();
const { deals, statuses } = useDealStoreRefs();

const onCardDrop = async (event: any, newStatus: string, oldStatus: string) => {
  const movedCard = event.item.__draggable_context.element;

  console.log("oldStatus", oldStatus);
  console.log("newStatus", newStatus);

  if (!newStatus || !movedCard) return;

  // Если статус не поменялся — это просто сортировка, ничего делать не нужно
  if (oldStatus === newStatus) return;

  // Если поменялся — обновляем статус на сервере
  await updateDeal(movedCard.id, { status: newStatus });

  // Обновляем статус локально
  movedCard.acf.status = newStatus;

  // Удаляем из старого списка
  groupedDeals.value[oldStatus] = groupedDeals.value[oldStatus].filter(
    (deal) => deal.id !== movedCard.id
  );

  // Добавляем в новый список
  groupedDeals.value[newStatus].push(movedCard);

  // Триггерим реактивность
  groupedDeals.value = { ...groupedDeals.value };
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
