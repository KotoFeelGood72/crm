<template>
  <div class="deals min-h-screen">
    <router-view />
    <ModalDeal />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useDealStore, useDealStoreRefs } from "@/store/useDealStore";
import ModalDeal from "@/components/nModal/ModalDeal.vue";
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

watch(
  deals,
  () => {
    initGroupedDeals();
  },
  { deep: true }
);

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
