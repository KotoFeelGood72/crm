<template>
  <div class="deals min-h-screen">
    <n-page-header subtitle="Текущие сделки" class="mb-6">
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
        <a href="https://anyway.fm/" style="text-decoration: none; color: inherit">
          Сделки
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

    <div class="overflow-hidden">
      <div class="flex overflow-x-auto touch-pan-x scroll-smooth gap-2">
        <div v-for="status in statuses" :key="status.id">
          <KanbanCard
            class="min-w-64 max-w-64"
            :name="status.name"
            :count="groupedDeals[status.name]?.length || 0"
            @end="(e, newStatus, oldStatus) => onCardDrop(e, newStatus, oldStatus)"
            v-model="groupedDeals[status.name]"
          >
            <template #card="{ card }">
              <CardDeal
                :card="card"
                class="cursor-pointer"
                @click="openModal('nDeal', '', { deal: card.id }, router)"
              ></CardDeal>
            </template>
          </KanbanCard>
        </div>
      </div>
    </div>
    <ModalDeal />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useDealStore, useDealStoreRefs } from "@/store/useDealStore";
import CardDeal from "@/components/ui/card/CardDeal.vue";
import KanbanCard from "@/components/ui/card/KanbanCard.vue";
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
