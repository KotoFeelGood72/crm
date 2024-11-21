<!-- @format -->

<template>
  <div class="single">
    <div class="single__main" v-if="clientData && clientData.acf">
      <div class="single_status">
        <div
          v-for="status in statuses"
          :key="status"
          class="single_status__item"
          :class="[
            getStatusClass(status, clientData.acf.status),
            getStatusColorClass(status),
          ]"
          @click="updateClientStatus(status)"
        >
          {{ status }}
        </div>
      </div>
      <div class="single__head">
        <div class="single__title">{{ clientData.acf.name }}</div>
        <div class="single__desc">{{ clientData.acf.address }}</div>
      </div>
      <div class="single_body">
        <div class="single_body__row">
          <div class="single_body__item">
            Категория: <span>{{ clientData.category_name }}</span>
          </div>
          <div class="single_body__item">
            Телефон: <span>{{ clientData.acf.phones }}</span>
          </div>
        </div>
        <div class="single_body__row">
          <div class="single_body__item">
            Вебсайт: <span>{{ clientData.acf.websites }}</span>
          </div>
          <div class="single_body__item">
            Город:
            <input type="text" v-model="clientData.acf.city" />
          </div>
          <div class="single_body__item">
            Перезвонить:
            <DatePicker
              v-model="clientData.acf.callback"
              :format="'dd.MM.yyyy HH:mm'"
              :enable-time="true"
              :locale="ruLocale"
            />
          </div>
        </div>
        <div class="single_body__row">
          <div class="single_body__item">
            ФИО менеджера:
            <input type="text" v-model="clientData.acf.manager_name" />
          </div>
          <div class="single_body__item">
            ФИО администратора:
            <input type="text" v-model="clientData.acf.admin_name" />
          </div>
          <div class="single_body__item">
            ФИО маркетолога:
            <input type="text" v-model="clientData.acf.marketer_name" />
          </div>
          <div class="single_body__item">
            ФИО ген. директора:
            <input type="text" v-model="clientData.acf.ceo_name" />
          </div>
        </div>
        <div class="single_body__row">
          <div class="single_body__item">
            ФИО директора:
            <input type="text" v-model="clientData.acf.director_name" />
          </div>
          <div class="single_body__item">
            Номер тел. личный:
            <input type="text" v-model="clientData.acf.personal_phone" />
          </div>
          <div class="single_body__item">
            Номер тел. рабочий:
            <input type="text" v-model="clientData.acf.work_phone" />
          </div>
        </div>
        <div class="single_body__row">
          <div class="single_body__item">
            Ватсап:
            <input type="text" v-model="clientData.acf.whatsapp" />
          </div>
          <div class="single_body__item">
            Телеграмм:
            <input type="text" v-model="clientData.acf.telegram" />
          </div>
          <div class="single_body__item">
            Email:
            <input type="email" v-model="clientData.acf.email" />
          </div>
          <div class="single_body__item">
            Адрес:
            <input type="text" v-model="clientData.acf.address" />
          </div>
        </div>

        <div class="single_body__row commentary">
          <div class="commentary__label">Комментарий</div>
          <InputArea v-model="commentary" />
        </div>
        <div class="single__action">
          <defaultBtn
            :name="isLoading ? 'Сохранение...' : 'Сохранить'"
            @click="saveCommentary"
            :isLoading="isLoading"
          />
        </div>
      </div>
      <div class="single_close" @click="closeModal('client', router)">
        <Icons icon="ic:round-close" size="26px" color="#424242" />
        <p>Закрыть</p>
      </div>
    </div>
    <Loader v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import InputArea from "@/components/ui/inputs/InputArea.vue";
import defaultBtn from "@/components/ui/buttons/default-btn.vue";
import Loader from "@/components/ui/loading/Loader.vue";
import { api } from "@/api/api";
import custom from "@/api/custom";
import { useModalStore } from "@/store/useModalStore";
import { useClientStore } from "@/store/useClientStore";
// @ts-ignore
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css"; // Импорт стилей
import { parse } from "date-fns";
const { closeModal } = useModalStore();
const clientStore = useClientStore();
import { ru } from "date-fns/locale";
const router = useRouter();
const route = useRoute();
const clientData = ref<any>({});
const commentary = ref<string>("");
const statuses = ["В обработке", "В работе", "Клиент", "Не актуально"];
const isLoading = ref<boolean>(false);

const ruLocale = ref<string>("ru"); // Устанавливаем локаль
async function getClientById(id: string) {
  try {
    const response = await api.get(`/wp-json/wp/v2/client_new/${id}`);
    clientData.value = response.data;

    if (clientData.value.acf.callback) {
      clientData.value.acf.callback = parse(
        clientData.value.acf.callback,
        "dd/MM/yyyy h:mm a",
        new Date(),
        { locale: ru }
      );
    }
    commentary.value = clientData.value.acf.comment || "";
  } catch (error) {
    console.error("Failed to fetch client data:", error);
  }
}

function getStatusClass(status: string, activeStatus: string) {
  return status === activeStatus ? "status-active" : "status-inactive";
}

function getStatusColorClass(status: string) {
  switch (status) {
    case "В обработке":
      return "status-processing";
    case "В работе":
      return "status-working";
    case "Клиент":
      return "status-client";
    case "Не актуально":
      return "status-not-relevant";
    default:
      return "";
  }
}

onMounted(() => {
  if (route.query.client) {
    getClientById(route.query.client as string);
  }
});

watch(
  () => route.query.client,
  (newClientId) => {
    if (newClientId) {
      getClientById(newClientId as string);
    }
  }
);

async function updateClient(updatedClient: any) {
  isLoading.value = true;
  try {
    const response = await custom.post(
      `/wp-json/wp/v2/update-client/${updatedClient.id}`,
      {
        name: updatedClient.acf.name,
        city: updatedClient.acf.city,
        phones: updatedClient.acf.phones,
        websites: updatedClient.acf.websites,
        category: updatedClient.acf.category,
        status: updatedClient.acf.status,
        callback: updatedClient.acf.callback,
        comment: updatedClient.acf.comment,

        // Новые поля
        manager_name: updatedClient.acf.manager_name,
        admin_name: updatedClient.acf.admin_name,
        marketer_name: updatedClient.acf.marketer_name,
        ceo_name: updatedClient.acf.ceo_name,
        director_name: updatedClient.acf.director_name,
        personal_phone: updatedClient.acf.personal_phone,
        work_phone: updatedClient.acf.work_phone,
        whatsapp: updatedClient.acf.whatsapp,
        telegram: updatedClient.acf.telegram,
        email: updatedClient.acf.email,
        address: updatedClient.acf.address,
      }
    );

    console.log(`Client ${updatedClient.id} updated`, response.data);

    // Обновляем локальные данные клиента
    clientData.value = updatedClient;

    // Обновляем данные клиента в Pinia Store
    clientStore.updateClientInStore(updatedClient);
  } catch (error) {
    console.error(`Failed to update client ${updatedClient.id}:`, error);
  } finally {
    isLoading.value = false;
  }
}

function saveCommentary() {
  if (clientData.value && clientData.value.acf) {
    clientData.value.acf.comment = commentary.value;
    updateClient(clientData.value).then(() => {
      closeModal("client", router);
    });
  }
}

function updateClientStatus(status: string) {
  if (clientData.value && clientData.value.acf) {
    clientData.value.acf.status = status;
    updateClient(clientData.value);
  }
}
</script>

<style scoped lang="scss">
.single {
  background-color: #ffffff;
  height: 100vh;
  padding: 20px 40px;
  min-width: 600px;
  max-width: 600px;
  margin-left: auto;
  margin-right: 0;
  position: relative;
  font-size: $small-2;

  @include bp($point_4) {
    max-width: 100%;
    min-width: 300px;
    padding: 30px 20px 80px 20px;
    max-height: 90%;
    overflow-y: auto;
    width: 100%;
  }
}

.single__head {
  margin-bottom: 20px;
  .single__title {
    font-size: 24px;
    max-width: 500px;
    margin-bottom: 5px;
    line-height: 28px;
  }
}

.single_body__row,
.single_body {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.single_body {
  gap: 20px;
}

.single__main {
  max-height: 100%;
  //   max-height: calc(100% - 100px);
  overflow-y: auto;
}
.single_body__item {
  @include flex-space;
  background-color: #8d8d8d1e;
  padding: 10px 20px;
  border-radius: 8px;
  gap: 20px;

  input {
    flex-grow: 1;
  }

  input[type="text"],
  input[type="date"],
  input[type="datetime-local"] {
    width: 100%;
    padding: 5px;
    border-bottom: 1px solid #ccc;
    // border-radius: 4px;
  }
}

.single__action {
  @include flex-start;
  gap: 10px;
}

.single_status {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18%, 1fr));
  gap: 3px;
  width: 100%;
  margin-bottom: 20px;

  @include bp($point_4) {
    grid-template-columns: repeat(auto-fill, minmax(35%, 1fr));
  }

  .single_status__item {
    padding: 10px;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    font-size: $small-3;

    @include bp($point_4) {
      // font-size: 10px;
      // padding: 5px 7px;
    }
    &:hover {
      opacity: 0.8;
    }
  }

  .status-new {
    background-color: $bg-color-primary;
    color: white;
  }

  .status-processing {
    background-color: $secondary-orange;
    color: white;
  }

  .status-working {
    background-color: $secondary-green;
    color: white;
  }

  .status-client {
    background-color: $secondary-blue;
    color: white;
  }
  .status-work {
    background-color: $primary-green;
    color: white;
  }

  .status-not-relevant {
    background-color: $secondary-red;
    color: white;
  }

  .status-active {
    &.status-new {
      background-color: $text-color-primary;
      color: white;
    }

    &.status-processing {
      background-color: $primary-orange;
      color: white;
    }

    &.status-working {
      background-color: $primary-green;
      color: white;
    }

    &.status-client {
      background-color: $primary-blue;
      color: white;
    }

    &.status-not-relevant {
      background-color: $primary-red;
      color: white;
    }
  }

  .status-inactive {
    opacity: 0.6;
  }
}

.single_close {
  display: none;
  @include bp($point_4) {
    bottom: 10px;
    position: fixed;
    gap: 10px;
    @include flex-center;
    background-color: $secondary-red;
    font-size: 20px;
    border-radius: 10px;
    padding: 10px 20px;
    width: calc(100% - 40px);
  }
}

.single__main {
  @include bp($point_2) {
    // max-height: calc(100vh - 120px);
    overflow-y: auto;
  }
}
</style>
