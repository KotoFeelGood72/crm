<template>
  <div class="deals">
    <h3>Сделки</h3>
    <div class="filter">
      <div class="filter_row">
        <DatePicker
          v-model="selectedDate"
          :format="'dd.MM.yyyy'"
          :enable-time-picker="false"
          :month-change-on-scroll="false"
          auto-apply
          disable-year-select
          :format-locale="ru"
          placeholder="Выберите дату"
          position="left"
          :hide-offset-dates="false"
          select-text="Выбрать"
          cancel-text="Закрыть"
          @update:modelValue="dealStore.updateSelectedDate"
          :markers="markers"
        >
          <template #marker="{ marker }">
            <span v-if="marker" class="custom-marker"></span>
          </template>
        </DatePicker>

        <Selects
          v-model="selectedCategory"
          :options="dealStore.categories"
          placeholder="Выберите категорию"
          @update:modelValue="dealStore.updateCategory"
        />
        <Selects
          v-model="selectedStatus"
          :options="dealStore.statuses"
          placeholder="Выберите статус"
          @update:modelValue="dealStore.updateStatus"
          class="select_status"
        />
        <Selects
          v-model="selectedCity"
          :options="dealStore.cities"
          placeholder="Выберите город"
          @update:modelValue="dealStore.updateCity"
        />
        <Selects
          v-model="perPage"
          :options="dealStore.perPageOptions"
          placeholder="Элементов на странице"
          @update:modelValue="dealStore.updatePerPage"
          class="select_perpage"
        />
      </div>
    </div>

    <div class="deals_main">
      <Loader
        v-if="dealStore.isLoading"
        style="background-color: transparent"
      />
      <div v-else>
        <div class="deal_list__w" v-if="dealStore.deals.length > 0">
          <div class="deals__list">
            <deal
              v-for="item in deals"
              :key="item.id"
              :card="item"
              :class="dealStore.getStatusClass(item.acf.status)"
            />
          </div>
          <pagination
            @nextPage="dealStore.updatePage(page + 1)"
            @prevPage="dealStore.updatePage(page - 1)"
            :totalPages="dealStore.totalPages"
            :currentPage="page"
            @goToPage="goToPage"
          />
        </div>
        <div v-else>
          <p>Нет результатов по вашему запросу</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useDealStore, useDealStoreRefs } from "@/store/useDealStore";
import ClientCard from "@/components/ui/card/ClientCard.vue"; // при наличии можно заменить на DealCard.vue
import pagination from "@/components/ui/buttons/pagination.vue";
import Loader from "@/components/ui/loading/Loader.vue";
import Selects from "@/components/ui/dropdown/Selects.vue";
import Switcher from "@/components/ui/inputs/Switcher.vue";
import IcBtn from "@/components/ui/buttons/IcBtn.vue";
import { ru } from "date-fns/locale";
import deal from "@/components/ui/card/deal.vue";
// @ts-ignore
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const isPhoneSearch = ref(false);
const dealStore = useDealStore();

const {
  deals,
  selectedCategory,
  selectedStatus,
  selectedCity,
  perPage,
  selectedDate,
  totalPages,
  statuses,
  page,
} = useDealStoreRefs();

const dynamicSearchModel = ref("");

onMounted(() => {
  dealStore.getDeals();
});

function clearFilters() {
  dealStore.clearFilters();
}

const goToPage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    dealStore.updatePage(newPage);
  }
};

const markers = ref<any>([]);
</script>

<style scoped lang="scss">
.clients {
  min-height: 100vh;
  position: relative;
  width: 100%;
}

.filter {
  margin-bottom: 10px;
  @include flex-start;
  flex-wrap: wrap;
  gap: 5px;
}

.filter_row {
  width: 100%;
  @include flex-start;
  gap: 5px;

  @include bp($point_4) {
    flex-direction: column;
    width: 100%;
  }
}

.change__card {
  @include flex-start;
  gap: 5px;

  @include bp($point_4) {
    display: none;
  }

  div {
    @include flex-center;
    background-color: $bg-color-secondary;
    width: 42px;
    height: 42px;
    border-radius: 5px;
    color: $secondary-blue-active;
    cursor: pointer;
    svg {
      color: $secondary-blue-active !important;
    }

    &.active {
      background-color: $secondary-blue;
      svg {
        color: $primary-blue-active !important;
      }
    }

    &:nth-child(2) {
      transform: rotate(90deg);
    }
  }
}

.center_pag {
  min-width: 200px;
  @include flex-center;
  font-size: 18px;
}

.clients__list {
  overflow-x: auto;
  max-width: 100%;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.clients_main {
  width: 100%;
}

.filter {
  padding: 20px;
  background-color: $white;
  border: 1px solid $light;
  @include bp($point_4) {
    flex-direction: column;
  }
}

.filter_row {
  input {
    // background-color: #ebecf0;
    font-size: 14px;
    background-color: $white;
    border: 1px solid $light;
    border-radius: 5px;
    width: 100%;
    max-width: 300px;
    height: 37px;
    padding: 10px;
    &:focus {
      outline: none;
    }
  }
}

.search-filter {
  display: flex;
  gap: 20px;
  flex-grow: 1;
  align-items: center;
}

.select_perpage {
  max-width: 80px;
}
.select_website {
  max-width: 150px;
}

.select_status {
  max-width: 200px;
}

.client_list__w {
  // background-color: $white;
  // padding: 20px;
  border-radius: 5px;
}
h3 {
  color: $dark;
  font-size: 20px;
  margin-bottom: 20px;
}
:deep(.dp__cell_inner) {
  position: relative;
  z-index: 2;
}
.custom-marker {
  content: "";
  top: calc(80%);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: $light-blue;
  border-radius: 4px;
  z-index: -1;
}

:deep(.dp__marker_tooltip) {
  font-size: 12px;
}

.deals__list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}
</style>
