<template>
  <div class="deal">
    <div class="deal__head">
      <div class="deal__preview">
        <div class="deal_preview__img">
          <!-- <img :src="deal.acf.img.url" alt="" /> -->
        </div>
        <h3>{{ deal.title }}</h3>
      </div>
      <CloseModal />
    </div>
    <div class="deal__body">
      <ul class="tab_list">
        <li class="tab_item">
          <!-- <ul class="deal_list">
            <li>
              <p>Наименование:</p>
              <span>{{ deal.acf.name }}</span>
            </li>
            <li>
              <p>Город:</p>
              <span>{{ deal.acf.city }}</span>
            </li>
            <li>
              <p>Телефон:</p>
              <span>{{ deal.acf.websites_list[0].item }}</span>
            </li>
            <li>
              <p>Сайт:</p>
              <span>{{ deal.acf.websites_list[0].item }}</span>
            </li>
          </ul> -->
        </li>
      </ul>
    </div>
    <div class="deal__bottom">
      <Button name="Обновить" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CloseModal from "@/components/ui/buttons/CloseModal.vue";
import { useDealStore } from "@/store/useDealStore";
import Button from "@/components/ui/buttons/Button.vue";
import { onMounted, ref } from "vue";

const deal = ref<any>({});

const { getDealById } = useDealStore();

onMounted(() => {
  const dealId = 111469;
  getDealById(dealId)
    .then((data) => {
      console.log("Deal data:", deal);
      deal.value = data;
    })
    .catch((error) => {
      console.error("Error fetching deal data:", error);
    });
});
</script>

<style scoped lang="scss">
.deal {
  background-color: $light;
  border-radius: 20px;
  overflow: hidden;
  width: 100%;
  min-width: 1000px;
}

.deal__head {
  @include flex-space;
  background-color: $white;
  padding: 20px;
}

.deal__body {
  padding: 20px;
}

.deal__bottom {
  @include flex-space;
  background-color: $white;
  padding: 20px;
}
</style>
