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
              <inputs
                label="Наименование"
                v-model="form.name"
                placeholder="Наименование"
              />
              <inputs
                label="Описание"
                v-model="form.name"
                placeholder="Описание"
              />
              <inputs
                label="График работы"
                v-model="form.name"
                placeholder="График работы"
              />
            </div>
          </div>
          <div class="modal_block">
            <h5>Местонахождение</h5>
            <div class="modal_block__grid">
              <inputs label="Адрес" v-model="form.name" placeholder="Адрес" />
              <inputs label="Город" v-model="form.name" placeholder="Город" />
            </div>
          </div>
          <div class="modal_block">
            <h5>Контактные данные</h5>
            <div class="modal_block__grid">
              <inputs
                label="Телефон"
                v-model="form.name"
                placeholder="Телефон"
              />
              <inputs
                label="What`s App"
                v-model="form.name"
                placeholder="What`s App"
              />
              <inputs
                label="Telegram"
                v-model="form.name"
                placeholder="Telegram"
              />
              <inputs label="E-Mail" v-model="form.name" placeholder="E-Mail" />
            </div>
          </div>
          <div class="modal_block">
            <h5>Медиа</h5>
            <div class="modal_block__grid">
              <inputs
                label="Веб-сайт"
                v-model="form.name"
                placeholder="Веб-сайт"
              />
              <inputs
                label="ВКонтакте"
                v-model="form.name"
                placeholder="ВКонтакте"
              />
              <inputs
                label="Youtube"
                v-model="form.name"
                placeholder="Youtube"
              />
            </div>
          </div>
          <div class="modal_block">
            <h5>Доп. информация</h5>
            <div class="modal_block__grid">
              <inputs
                label="Источник"
                v-model="form.name"
                placeholder="Источник"
              />
              <inputs
                label="Часовой пояс"
                v-model="form.name"
                placeholder="Часовой пояс"
              />
              <inputs
                label="Кол-во отзывов"
                v-model="form.name"
                placeholder="Кол-во отзывов"
              />
              <inputs
                label="Рейтинг"
                v-model="form.name"
                placeholder="Рейтинг"
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
        <defaultBtn name="Создать" />
        <defaultBtn name="Отменить" color="danger" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import Switcher from "@/components/ui/inputs/Switcher.vue";
import { useClientStore } from "@/store/useClientStore";
import inputs from "@/components/ui/inputs/inputs.vue";
import defaultBtn from "@/components/ui/buttons/default-btn.vue";
import CloseModal from "@/components/ui/buttons/CloseModal.vue";
import { useModalStore } from "@/store/useModalStore";
const { closeModal } = useModalStore();

const clientStore = useClientStore();

const form = reactive<any>({
  name: "",
  city: "",
  phones: "",
  websites: "",
  category: "",
  status: "Новый",
  callback: "",
  email: "",
  note: "",
});

const handleCreateClient = async () => {
  try {
    await clientStore.createClient(form);
    alert("Клиент успешно создан");
    Object.keys(form).forEach((key) => (form[key] = "")); // сброс формы
  } catch (err) {
    alert("Ошибка при создании клиента");
  }
};
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
</style>
