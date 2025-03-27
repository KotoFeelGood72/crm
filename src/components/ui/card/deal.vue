<template>
  <div v-if="!isDeleted" class="card">
    <div class="card_edit">
      <IcBtn icon="solar:menu-dots-bold" />
    </div>
    <div class="card_top">
      <p>{{ card.acf.name }}</p>
      <span>{{ card.acf.name }}</span>
    </div>
    <div class="card_body">
      <div class="deal_info">
        <chip title="150 000" icon="solar:dollar-minimalistic-linear" />
        <chip title="Сайт" icon="solar:chart-square-linear" />
        <chip title="27.05.2025" icon="solar:calendar-date-linear" />
      </div>
    </div>
    <div class="card_bottom"></div>
  </div>
</template>

<script setup lang="ts">
import chip from "../buttons/chip.vue";
import { ref } from "vue";
import IcBtn from "../buttons/IcBtn.vue";

withDefaults(
  defineProps<{
    card: any;
  }>(),
  {
    card: {},
  }
);

const emit = defineEmits(["deleteCard", "updateCard"]);
const isDeleted = ref(false);
</script>

<style scoped lang="scss">
.card {
  background-color: $white;
  border: 1px solid $light;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  cursor: grab;
}

.deal_info {
  @include flex-start;
  gap: 4px;
}

.card_edit {
  position: absolute;
  top: 10px;
  right: 10px;
}

.card_top {
  font-size: 12px;
  margin-bottom: 20px;
  font-weight: 500;
  p {
    max-width: 80%;
  }
  span {
    font-size: 10px;
  }
}
</style>
