<template>
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
        @update:modelValue="updateSelectedDate"
        :markers="markers"
        :hide-input-icon="true"
      >
        <template #marker="{ marker }">
          <span v-if="marker" class="custom-marker"></span>
        </template>
      </DatePicker>

      <Selects
        v-model="selectedCategory"
        :options="categories"
        placeholder="Выберите категорию"
        @update:modelValue="updateCategory"
      />
      <Selects
        v-model="selectedStatus"
        :options="statuses"
        placeholder="Выберите статус"
        @update:modelValue="updateStatus(selectedStatus)"
        class="select_status"
      />
      <Selects
        v-model="selectedCity"
        :options="cities"
        placeholder="Выберите город"
        @update:modelValue="updateCity"
      />
      <Selects
        v-model="perPage"
        :options="perPageOptions"
        placeholder="Элементов на странице"
        @update:modelValue="updatePerPage"
        class="select_perpage"
      />
    </div>
    <div class="filter_row">
      <div class="search-filter">
        <input
          type="text"
          v-model="dynamicSearchModel"
          :placeholder="
            isPhoneSearch
              ? 'Введите номер телефона'
              : 'Введите запрос для поиска'
          "
          @input="filterBySearch"
          class="search-input"
        />
        <Switcher v-model="isPhoneSearch" />
      </div>

      <div class="clear_filter" @click="clearFilters">
        <IcBtn icon="solar:refresh-broken" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClientStore, useClientStoreRefs } from "@/store/useClientStore";
import { computed, ref } from "vue";
import Selects from "@/components/ui/dropdown/Selects.vue";
import Switcher from "@/components/ui/inputs/Switcher.vue";

import { ru } from "date-fns/locale";
// @ts-ignore
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const markers = ref<any>([]);
const {
  clearFilters,
  updateStatus,
  updatePerPage,
  updateCity,
  updateSearchPhone,
  updateSearchQuery,
  updateSelectedDate,
  updateCategory,
} = useClientStore();
const isPhoneSearch = ref(false);
const {
  cities,
  categories,
  statuses,
  selectedCategory,
  selectedStatus,
  selectedCity,
  hasWebsite,
  perPage,
  searchPhone,
  searchQuery,
  selectedDate,
  totalPages,
  perPageOptions,
  page,
} = useClientStoreRefs();

const dynamicSearchModel = computed({
  get() {
    return isPhoneSearch.value ? searchPhone.value : searchQuery.value;
  },
  set(value) {
    if (isPhoneSearch.value) {
      updateSearchPhone(value);
    } else {
      updateSearchQuery(value);
    }
  },
});

function filterBySearch() {
  if (isPhoneSearch.value) {
    updateSearchPhone(dynamicSearchModel.value);
  } else {
    updateSearchQuery(dynamicSearchModel.value);
  }
}
</script>

<style scoped lang="scss">
.filter {
  height: 100dvh;
  background-color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 400px;
}

.filter_row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

:deep(.dp__pointer) {
  font-size: 12px;
  padding: 6px 4px;
  line-height: 100%;
  color: #000;
  &::placeholder {
    color: #000;
  }
}

.search-filter {
  display: flex;
  gap: 20px;
  flex-grow: 1;
  align-items: center;
  font-size: 12px;

  input {
    border: 1px solid #eeeeee;
    flex-grow: 1;
    padding: 5px 10px;
  }
}
</style>
