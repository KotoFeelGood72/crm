<template>
  <div class="clients">
    <h3>Клиенты</h3>
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
          @update:modelValue="clientStore.updateSelectedDate"
          :markers="markers"
        >
          <template #marker="{ marker }">
            <span v-if="marker" class="custom-marker"></span>
          </template>
        </DatePicker>

        <Selects
          v-model="selectedCategory"
          :options="clientStore.categories"
          placeholder="Выберите категорию"
          @update:modelValue="clientStore.updateCategory"
        />
        <Selects
          v-model="selectedStatus"
          :options="clientStore.statuses"
          placeholder="Выберите статус"
          @update:modelValue="clientStore.updateStatus"
          class="select_status"
        />
        <Selects
          v-model="selectedCity"
          :options="clientStore.cities"
          placeholder="Выберите город"
          @update:modelValue="clientStore.updateCity"
        />
        <Selects
          v-model="hasWebsite"
          :options="clientStore.hasWebsiteOptions"
          placeholder="Наличие сайта"
          @update:modelValue="clientStore.updateHasWebsite"
          class="select_website"
        />
        <Selects
          v-model="perPage"
          :options="clientStore.perPageOptions"
          placeholder="Элементов на странице"
          @update:modelValue="clientStore.updatePerPage"
          class="select_perpage"
        />
      </div>
      <div class="filter_row">
        <div class="search-filter">
          <input
            type="text"
            v-model="dynamicSearchModel"
            :placeholder="
              isPhoneSearch ? 'Введите номер телефона' : 'Введите запрос для поиска'
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
    <div class="clients_main">
      <Loader v-if="clientStore.isLoading" style="background-color: transparent" />
      <div v-else>
        <div class="client_list__w" v-if="clientStore.clients.length > 0">
          <div class="clients__list">
            <ClientCard
              v-for="item in clients"
              :key="item.id"
              :card="item"
              :class="clientStore.getStatusClass(item.acf.status)"
            />
          </div>
          <pagination
            @nextPage="clientStore.updatePage(page + 1)"
            @prevPage="clientStore.updatePage(page - 1)"
            :totalPages="clientStore.totalPages"
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
import { onMounted, ref, computed, watch, watchEffect } from "vue";
import { useClientStore, useClientStoreRefs } from "@/store/useClientStore";
import ClientCard from "@/components/ui/card/ClientCard.vue";
import pagination from "@/components/ui/buttons/pagination.vue";
import Loader from "@/components/ui/loading/Loader.vue";
import Selects from "@/components/ui/dropdown/Selects.vue";
import Switcher from "@/components/ui/inputs/Switcher.vue";
import IcBtn from "@/components/ui/buttons/IcBtn.vue";
import { ru } from "date-fns/locale";
// @ts-ignore
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
const isPhoneSearch = ref(false);
const clientStore = useClientStore();
const {
  clients,
  selectedCategory,
  selectedStatus,
  selectedCity,
  hasWebsite,
  perPage,
  searchPhone,
  searchQuery,
  selectedDate,
  totalPages,
  page,
} = useClientStoreRefs();

onMounted(() => {
  clientStore.getClients();
  clientStore.getCategories();
});

const dynamicSearchModel = computed({
  get() {
    return isPhoneSearch.value ? searchPhone.value : searchQuery.value;
  },
  set(value) {
    if (isPhoneSearch.value) {
      clientStore.updateSearchPhone(value);
    } else {
      clientStore.updateSearchQuery(value);
    }
  },
});

// Наблюдение за изменением переключателя
watch(isPhoneSearch, (newValue) => {
  if (newValue) {
    // Очистить поле для поиска по имени при переключении на поиск по телефону
    clientStore.updateSearchQuery("");
  } else {
    // Очистить поле для поиска по телефону при переключении на поиск по имени
    clientStore.updateSearchPhone("");
  }
});

function filterBySearch() {
  if (isPhoneSearch.value) {
    clientStore.updateSearchPhone(dynamicSearchModel.value);
  } else {
    clientStore.updateSearchQuery(dynamicSearchModel.value);
  }
}

function clearFilters() {
  clientStore.clearFilters();
}

const goToPage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    clientStore.updatePage(newPage);
  }
};

const markers = ref<any>([]);

onMounted(async () => {
  await clientStore.getClients();
  updateMarkers();
});

watchEffect(() => {
  if (clients.value.length > 0) {
    updateMarkers();
  }
});

function updateMarkers() {
  markers.value = clients.value
    .map((client) => {
      const callbackDate = client.acf.callback;

      // Проверка на валидность даты
      const date = callbackDate ? new Date(callbackDate) : null;

      if (date && !isNaN(date.getTime())) {
        return {
          date: date,
          type: "dot",
          tooltip: [{ text: "Звонки", color: "blue" }],
        };
      } else {
        // console.warn(`Invalid date found for client ID: ${client.id}`);
        return null; // Возвращаем null, чтобы исключить невалидные даты
      }
    })
    .filter((marker) => marker !== null); // Фильтруем null значения
}
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
</style>
