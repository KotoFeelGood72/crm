<template>
  <div class="card">
    <div class="card__head">
      <chip :title="formatedDate(card.date)" icon="solar:calendar-date-bold" />
      <div class="card_edit">
        <Icons icon="solar:menu-dots-bold" />
      </div>
    </div>
    <div class="card_top">
      <p>{{ card.acf.name }}</p>
      <div class="row">
        <chip title="http://localhost:5123/deals" icon="solar:planet-3-bold" />
        <chip title="150 000" icon="solar:dollar-minimalistic-linear" />
      </div>
    </div>
    <div class="card_body">
      <div class="row">
        <chip
          :title="formatedPhone(card.acf.phones)"
          icon="solar:phone-calling-bold"
        />
        <p>Виктор Иванович</p>
      </div>
    </div>
    <div class="card_bottom">
      <div class="card__reviews">
        <p :class="{ hidden: !hiddenText }">
          Уточнить по протоколу как правильно общаться с людьми и продавать им
          потрясающие продукты
        </p>
        <div class="more" @click="hiddenText = !hiddenText">Развернуть</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import chip from "../buttons/chip.vue";
import { ref } from "vue";
// @ts-ignore
import { formatedDate } from "@/utils/formatedDate.js";
// @ts-ignore
import { formatedPhone } from "@/utils/formatedPhone.js";

withDefaults(
  defineProps<{
    card: any;
  }>(),
  {
    card: {},
  }
);

const hiddenText = ref(false);
</script>

<style scoped lang="scss">
.card {
  background-color: $white;
  border: 1px solid $light;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  cursor: grab;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card_top {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.deal_info {
  @include flex-start;
  gap: 4px;
}

.card__head,
.row {
  @include flex-space;
}

.card_edit {
  @include flex-center;
  width: 20px;
  height: 20px;
}

.card_top {
  font-size: 12px;
  font-weight: 500;
  p {
    max-width: 80%;
  }
  span {
    font-size: 10px;
  }
}

.card_body {
  p {
    font-size: 10px;
    font-weight: 600;
  }
}

.card__reviews {
  font-size: 12px;
  p {
    margin-bottom: 5px;
  }
}

.more {
  font-size: 10px;
  font-weight: 600;
  color: $blue;
  cursor: pointer;
}

.hidden {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
