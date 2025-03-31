<template>
  <div class="create_main">
    <div class="create_main_scroll">
      <div class="head">
        <h3>Добавить клиента</h3>
        <CloseModal @click="closeModal('create')" />
      </div>
      <div class="body">
        <form @submit.prevent="handleCreateClient" class="modal_block__list">
          <div class="modal_block">
            <h5>Основные данные</h5>
            <div class="modal_block__grid">
              <singleItem
                label="Наименование"
                v-model="form.name"
                place="Введите наименование"
                :edit="true"
              />
              <div class="selects">
                <p>Выберите категорию</p>
                <select class="select_cat" v-model="form.category">
                  <option disabled value="">Выберите категорию</option>
                  <option
                    v-for="cat in clientStore.categories"
                    :key="cat.id"
                    :value="cat.id"
                  >
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <singleItem
                label="Описание"
                v-model="form.description"
                place="Введите описание"
                :edit="true"
              />
              <singleItem
                label="График работы"
                v-model="form.schedule"
                place="Введите график"
                :edit="true"
              />
            </div>
          </div>

          <div class="modal_block">
            <h5>Местонахождение</h5>
            <div class="modal_block__grid">
              <singleItem
                label="Адрес"
                v-model="form.address"
                place="Введите адрес"
                :edit="true"
              />
              <singleItem
                label="Город"
                v-model="form.city"
                place="Введите город"
                :edit="true"
              />
            </div>
          </div>

          <div class="modal_block">
            <h5>Контактные данные</h5>
            <div class="modal_block__grid">
              <listItem
                label="Телефоны"
                v-model="form.phone_list"
                place="Введите номер телефона"
                :edit="true"
              />
              <listItem
                label="WhatsApp"
                v-model="form.whatsapps_list"
                place="Введите номер WhatsApp"
                :edit="true"
              />
              <listItem
                label="Telegram"
                v-model="form.telegrams_list"
                place="Введите Telegram"
                :edit="true"
              />
              <listItem
                label="E-Mail"
                v-model="form.emails_list"
                place="Введите e-mail"
                :edit="true"
              />
            </div>
          </div>

          <div class="modal_block">
            <h5>Медиа</h5>
            <div class="modal_block__grid">
              <listItem
                label="Сайты"
                v-model="form.websites_list"
                place="Введите сайт"
                :edit="true"
              />
              <singleItem
                label="ВКонтакте"
                v-model="form.vk"
                place="Введите ссылку"
                :edit="true"
              />
              <singleItem
                label="YouTube"
                v-model="form.youtube"
                place="Введите ссылку"
                :edit="true"
              />
            </div>
          </div>

          <div class="modal_block">
            <h5>Доп. информация</h5>
            <div class="modal_block__grid">
              <singleItem
                label="Источник"
                v-model="form.spring"
                place="Введите источник"
                :edit="true"
              />
              <singleItem
                label="Часовой пояс"
                v-model="form.times"
                place="Введите часовой пояс"
                :edit="true"
              />
              <singleItem
                label="Кол-во отзывов"
                v-model="form.reviews_count"
                place="Введите число"
                :edit="true"
              />
              <singleItem
                label="Рейтинг"
                v-model="form.stars"
                place="Введите рейтинг"
                :edit="true"
              />
              <div class="is_ads">
                <p>Есть реклама?</p>
                <Switcher v-model="form.is_ads" />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="bottom">
        <defaultBtn name="Создать" @click="handleCreateClient" />
        <defaultBtn name="Отменить" color="danger" @click="closeModal('create')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import Switcher from "@/components/ui/inputs/Switcher.vue";
import { useClientStore } from "@/store/useClientStore";
import defaultBtn from "@/components/ui/buttons/default-btn.vue";
import CloseModal from "@/components/ui/buttons/CloseModal.vue";
import { useModalStore } from "@/store/useModalStore";
import listItem from "@/components/ui/row/list-item.vue";
import singleItem from "@/components/ui/row/single-item.vue";
const { closeModal } = useModalStore();
const clientStore = useClientStore();
const { getCategories } = useClientStore();

const form = reactive<any>({
  name: "",
  description: "",
  schedule: "",
  address: "",
  category: "",
  city: "",
  phone_list: [],
  whatsapps_list: [],
  telegrams_list: [],
  emails_list: [],
  websites_list: [],
  vk: "",
  youtube: "",
  spring: "",
  timezone: "",
  reviews_count: "",
  stars: "",
  is_ads: false,
});

const handleCreateClient = async () => {
  try {
    await clientStore.createClient(form);
    alert("Клиент успешно создан");
    Object.keys(form).forEach((key) => {
      form[key] = Array.isArray(form[key])
        ? []
        : typeof form[key] === "boolean"
        ? false
        : "";
    });
    closeModal("create");
  } catch (err) {
    alert("Ошибка при создании клиента");
  }
};

onMounted(() => {
  getCategories();
});
</script>

<style scoped lang="scss">
.create_main {
  overflow: hidden;
  width: 1100px;
  // padding: 20px;
  border-radius: 20px;
  background-color: #f8f7f7;
}

.create_main_scroll {
  max-height: 90dvh;
  overflow-y: auto;
}

.modal_block__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40%, 1fr));
  grid-gap: 10px;
}

.modal_block__list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.head {
  @include flex-space;
  padding: 20px;
  background-color: $white;
}

.bottom {
  @include flex-start;
  gap: 10px;
  background-color: $white;
}

.body {
  padding: 20px;
  border-bottom: 1px solid #e1e0e0;
  border-top: 1px solid #e1e0e0;
}

.modal_block {
  h5 {
    font-size: 16px;
    margin-bottom: 20px;
  }
}

.is_ads {
  @include flex-start;
  font-size: 12px;
  gap: 10px;
  font-weight: 600;
}

.bottom {
  padding: 20px;
  :deep(.default-btn) {
    width: auto;
  }
}

.select_cat {
  -webkit-appearance: none;
  appearance: none;
  -moz-appearance: none;
  border: 1px solid rgba(204, 204, 204, 0.2901960784);
  padding: 5px 20px;
  font-size: 14px;
  width: 100%;
  background-color: #ffffff;
  height: 33px;
}

.selects {
  p {
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 5px;
  }
}
</style>
