<template>
  <div class="clients">
    <div class="row_top">
      <h3>Клиенты</h3>
      <div class="row">
        <Button @click="openModal('create')" name="Добавить лид" />
        <Button @click="openModal('filter')" name="Фильтры" />
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
import { onMounted, ref, watch, watchEffect } from "vue";
import { useClientStore, useClientStoreRefs } from "@/store/useClientStore";
import { useModalStore } from "@/store/useModalStore";
import ClientCard from "@/components/ui/card/ClientCard.vue";
import pagination from "@/components/ui/buttons/pagination.vue";
import Loader from "@/components/ui/loading/Loader.vue";
import Button from "@/components/ui/buttons/Button.vue";
// @ts-ignore
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
const isPhoneSearch = ref(false);
const clientStore = useClientStore();

const { openModal } = useModalStore();
const {
  clients,
  // selectedCategory,
  // selectedStatus,
  // selectedCity,
  // hasWebsite,
  // perPage,
  // searchPhone,
  // searchQuery,
  // selectedDate,
  totalPages,
  page,
} = useClientStoreRefs();

onMounted(() => {
  clientStore.getClients();
  clientStore.getCategories();
});

// const dynamicSearchModel = computed({
//   get() {
//     return isPhoneSearch.value ? searchPhone.value : searchQuery.value;
//   },
//   set(value) {
//     if (isPhoneSearch.value) {
//       clientStore.updateSearchPhone(value);
//     } else {
//       clientStore.updateSearchQuery(value);
//     }
//   },
// });

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

// function filterBySearch() {
//   if (isPhoneSearch.value) {
//     clientStore.updateSearchPhone(dynamicSearchModel.value);
//   } else {
//     clientStore.updateSearchQuery(dynamicSearchModel.value);
//   }
// }

// function clearFilters() {
//   clientStore.clearFilters();
// }

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
  gap: 7px;
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

.filter-btn {
  @include flex-center;
  cursor: pointer;
  background-color: hsla(215, 100%, 54%, 0.12);
  padding: 5px 20px;
  border-radius: 5px;
  font-size: 12px;
  gap: 5px;
  font-weight: 500;
  user-select: none;
}

.row_top {
  @include flex-space;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid rgb(230, 235, 241);
  margin-bottom: 20px;
}

.row {
  @include flex-end;
  gap: 10px;
}
</style>
