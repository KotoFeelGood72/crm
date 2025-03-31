<template>
  <div class="deals">
    <div class="row_top">
      <h3>Сделки</h3>
    </div>

    <div class="kanban__wrapper" v-if="!dealStore.isLoading">
      <div class="kanban__column" v-for="status in statuses" :key="status.id">
        <div class="kanban__header">
          <h4>{{ status.name }}</h4>
          <span class="count">{{ groupedDeals[status.name]?.length || 0 }}</span>
        </div>

        <draggable
          v-model="groupedDeals[status.name]"
          group="deals"
          item-key="id"
          :emptyInsert="true"
          @end="(e: any) => onCardDrop(e)"
          class="kanban__cards"
        >
          <template #item="{ element }">
            <deal
              :card="element"
              @click="openModal('deal', { deal: element.id }, router)"
            />
          </template>
        </draggable>
      </div>
    </div>

    <Loader v-else style="background-color: transparent" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
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
const {
  deals,

  statuses,
} = useDealStoreRefs();

const onCardDrop = async (event: any) => {
  const movedCard = event.item.__draggable_context.element;

  const columnEl = event.to.closest(".kanban__column");
  const headerEl = columnEl?.querySelector("h4");
  const newStatus = headerEl?.textContent?.trim();

  if (!newStatus || !movedCard) return;

  // Ничего не делаем, если статус не поменялся
  if (movedCard.acf.status === newStatus) return;

  // Обновляем статус на сервере
  await dealStore.updateDealStatus(movedCard.id, newStatus);

  // Обновляем статус локально
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

<style scoped lang="scss">
.kanban__wrapper {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 30px;
  width: 100%;
}

.kanban__column {
  background-color: $ulight;
  border: 1px solid $light;
  border-radius: 8px;
  padding: 10px;
  min-width: 300px;
  max-width: 350px;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
}

.kanban__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  h4 {
    font-size: 16px;
    font-weight: 600;
  }
  .count {
    font-size: 12px;
    background-color: $blue;
    color: #fff;
    padding: 2px 8px;
    border-radius: 10px;
  }
}

.kanban__cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 50px;
  min-height: 70dvh;
}

.row_top {
  margin-bottom: 20px;
}
</style>
