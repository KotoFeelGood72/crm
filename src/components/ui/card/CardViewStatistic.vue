<template>
  <div class="card">
    <div class="card_main">
      <div class="card_txt">
        <span>{{ card.name }}</span>
        <p>{{ card.value }}</p>
      </div>
      <div class="card_icon"><Icons :icon="card.icon" :size="30" /></div>
    </div>
    <div class="card_totals">{{ card.total }}% {{ card.description }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  card: any;
}>();
</script>

<style scoped lang="scss">
.card {
  background-color: $white;
  border: 1px solid $light;
  border-radius: 5px;
}

.card_main {
  @include flex-space;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid $light-blue;
}

.card_totals {
  padding: 10px 20px;
  font-size: 12px;
}

.card_icon {
  svg {
    color: $blue !important;
  }
}

.card_txt {
  span {
    font-size: 12px;
  }
  p {
    font-size: 20px;
    font-weight: 600;
  }
}
</style>
