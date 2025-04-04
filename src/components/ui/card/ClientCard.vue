<template>
  <div class="card">
    <div class="card_top">
      <ul class="card_tab__link">
        <li @click.stop="activeTab = 'org'" :class="{ active: activeTab === 'org' }">
          Сведение об организации
        </li>
      </ul>
      <Selects
        v-model="selectedStatus"
        :options="statuses"
        placeholder="Выберите статус"
        class="select_status"
        @update:modelValue="updateStatus(selectedStatus)"
      />
    </div>
    <ul class="card_tab__contents">
      <li class="card_tab__content" v-if="activeTab === 'org'">
        <ul class="info__list">
          <li>
            <p>Организация:</p>
            <span>{{ card.acf.name }}</span>
          </li>
          <li>
            <p>Город:</p>
            <span>{{ card.acf.city }}</span>
          </li>
          <li>
            <p>Телефон:</p>
            <div class="card__phone">
              <span v-for="item in card.acf.phone_list" :key="item">{{
                formatPhone(item.item)
              }}</span>
            </div>
          </li>
          <li>
            <p>What`s App:</p>
            <div class="card__phone">
              <span v-for="item in card.acf.whatsapps_list" :key="item">{{
                item.item
              }}</span>
            </div>
          </li>
          <li>
            <p>Telegram:</p>
            <div class="card__phone">
              <span v-for="item in card.acf.telegrams_list" :key="item">{{
                item.item
              }}</span>
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="prefooter"
      v-if="Array.isArray(card.acf?.history) && card.acf.history.length"
    >
      {{ card.acf.history[card.acf.history.length - 1].txt }}
      <div class="comment_date">
        {{ card.acf.history[card.acf.history.length - 1].time }}
      </div>
    </div>
    <div class="footer">
      <div class="btn" @click="openModal('comment', { comment: card.id }, router)">
        Оставить комментарий
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModalStore } from "@/store/useModalStore";
import { ref } from "vue";
import Selects from "../dropdown/Selects.vue";
// @ts-ignore
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useClientStore, useClientStoreRefs } from "@/store/useClientStore";
import { useRouter } from "vue-router";

const props = withDefaults(
  defineProps<{
    card: any;
  }>(),
  {
    card: {},
  }
);

const { openModal } = useModalStore();
const router = useRouter();

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  let number = digits;

  if (digits.length === 11 && digits.startsWith("8")) {
    number = "7" + digits.slice(1);
  } else if (digits.length === 10) {
    number = "7" + digits;
  } else if (digits.length === 11 && digits.startsWith("7")) {
    number = digits;
  }

  if (number.length !== 11) return raw; // если не получилось — отдаем как есть

  return `+7 (${number.slice(1, 4)}) ${number.slice(4, 7)}-${number.slice(
    7,
    9
  )}-${number.slice(9)}`;
}

const clientStore = useClientStore();
const { statuses } = useClientStoreRefs();
const activeTab = ref<any>("org");
const selectedStatus = ref<any>(props.card.acf.status);
const emit = defineEmits(["deleteCard", "updateCard"]);

function updateStatus(newStatus: string) {
  clientStore.updateClientStatus(props.card.id, newStatus);
  emit("updateCard", {
    ...props.card,
    acf: { ...props.card.acf, status: newStatus },
  });
}
</script>

<style scoped lang="scss">
.card {
  background-color: $white;
  border: 1px solid $light;
}
.card_top {
  margin-bottom: 10px;
  @include flex-space;
  padding-right: 15px;
  border-bottom: 1px solid $light;

  &:deep(.custom-select) {
    max-width: 300px;
  }
}
.card_tab__link {
  @include flex-start;
  list-style: none;

  li {
    border-bottom: 2px solid transparent;
    height: 100%;
    padding: 10px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
      color: $blue;
    }

    &.active {
      background-color: $light-blue;
      color: $blue;
      border-color: $blue;
    }
  }
}

.card_tab__contents {
  list-style: none;
}

.card__phone {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info__list {
  display: flex;
  flex-wrap: wrap;
  // gap: 10px;
  & > li {
    width: 50%;
    border-bottom: 1px dotted $light;
    @include flex-start;
    // align-items: flex-start;
    font-size: 11px;
    gap: 5px;
    padding: 8px 0;

    span {
      font-weight: 500;
      max-width: 400px;
    }
  }
}

.card_tab__content {
  padding: 10px 10px 20px 10px;
  font-weight: 400;
}

.card_bottom__left {
  @include flex-start;
  gap: 10px;
}

.card_bottom__right {
  @include flex-end;
  gap: 20px;
}

.card_bottom {
  @include flex-space;
  gap: 10px;
  padding: 0 10px 10px 10px;
}

.card__view,
.card__kp {
  @include flex-start;
  gap: 5px;
  font-size: 12px;
  background-color: $ulight;
  padding: 7px 10px;
  border-radius: 4px;
  transition: all 0.3s ease-in-out;
  font-weight: 500;
  &:hover {
    background-color: $light;
  }
}
.card_link__btn {
  @include flex-start;
  font-size: 12px;
  font-weight: 500;
  background-color: $ulight;
  padding: 0 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: $light;
  }
}

.list_item__full {
  width: 100% !important;
  align-items: flex-start !important;
  gap: 10px !important;
}

.box__list {
  flex-grow: 1;
  display: flex;
  list-style: none;
  font-size: 14px;
  font-weight: 500;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 5px;
  margin-top: -10px;

  li {
    background-color: $light;
    border-bottom: 1px solid $light;
    border-radius: 4px;
    padding: 5px 10px;
    font-size: 12px;
  }
}

.history_list {
  flex-direction: column;
}
.history_item {
  width: 100% !important;
  border-color: transparent !important;
  background-color: $white;
  border-radius: 5px;
  gap: 20px !important;

  padding: 10px !important;
  &.comment {
    flex-direction: column;
    align-items: flex-start !important;
  }

  &:deep(.dp__input_icon) {
    display: none;
  }
  &:deep(.dp__input_icon_pad) {
    border-bottom: 1px solid $light;
    border-width: 0 0 1px 0;
    border-radius: 0;
    padding: 15px 40px;
    font-size: 14px;
    background-color: transparent;
  }

  textarea {
    width: 100%;
    border: 1px solid $light;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 10px;
    resize: none;
    overflow-y: hidden;
    min-height: 150px;
    &:focus {
      outline: none;
      border-color: $blue;
    }
  }
}

.history_item__top {
  width: 100%;
  @include flex-start;
  gap: 10px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
}

.item_head {
  @include flex-start;
  gap: 10px;
  font-size: 16px;
  font-weight: 500;
}

.input_date {
  position: relative;
  width: 100%;
  svg {
    position: absolute;
    top: 47%;
    left: 0px;
    transform: translateY(-50%);
    pointer-events: none;
    color: #7a7a7a !important;
  }
}

.comment__w {
  max-height: 500px;
  overflow-y: auto;
  &::-webkit-scrollbar-track {
    background-color: $ulight;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #00000059;
  }
}

.comment_list {
  display: flex;
  flex-direction: column;
  list-style: none;
  font-size: 14px;
  gap: 10px;
  width: 100%;
  margin-bottom: 20px;
  max-width: 99%;

  li {
    display: inline-flex;
    background-color: $ulight;
    &:nth-child(2n) {
      &.comment_item {
        align-items: flex-end;
      }
    }
    p {
      max-width: 50%;
      border-radius: 5px;
      padding: 5px 10px;
      // background-color: $light;
    }
  }
}

.send_comment {
  @include flex-center;
  display: inline-flex;
  background-color: $blue;
  color: $white;
  cursor: pointer;
  padding: 12px 30px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 10px;
  gap: 10px;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: $hover;
  }

  svg {
    color: $white !important;
  }
}

.card_email__w {
  flex-grow: 1;
}

.card_email {
  @include flex-start;
  gap: 10px;
  flex-grow: 1;

  input {
    border-bottom: 1px solid $light;
    padding: 5px 10px;
    width: 100%;
    &:focus {
      outline: none;
      border-color: $blue;
    }
  }
}

.send__kp {
  position: relative;
  @include flex-start;
  background-color: $blue;
  padding: 5px 20px;
  color: $white;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border-radius: 5px;

  &.disabled {
    pointer-events: none;
    background-color: $light;
    color: $dark;
    svg {
      color: $dark !important;
    }
  }
  &:hover {
    background-color: $hover;
  }
  svg {
    color: $white !important;
  }
}

.send_load {
  @include flex-center;
}

.card {
  border-radius: 5px;
  position: relative;
  padding-left: 30px;
  &:before {
    content: "";
    width: 30px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    text-transform: uppercase;
    color: $white;
    font-weight: 500;
    letter-spacing: 1px;
  }
  &.status-new {
    border: 1px solid transparent;
    &:before {
      background-color: rgb(77, 221, 247);
      content: "Новый";
    }
  }
  &.status-not-relevant {
    &:before {
      background-color: rgb(247, 77, 77);
      content: "Не актуально";
    }
  }
  &.status-working {
    &:before {
      background-color: rgb(103, 77, 247);
      content: "В работе";
    }
  }
  &.status-processing {
    &:before {
      background-color: rgb(247, 154, 77);
      content: "В обработке";
    }
  }
  &.status-client {
    &:before {
      background-color: rgb(77, 247, 120);
      content: "Клиент";
    }
  }
}

.history_item {
  padding-top: 0 !important;
  padding-bottom: 20px !important;
  &.comment {
    @include flex-start;
    flex-direction: row;
    gap: 40px !important;
  }
}

.history_item__action {
  width: 50%;
  // padding-top: 45px;
}

.history_item__review {
  width: 50%;
}

.comment_date {
  @include flex-center;
  margin-bottom: 10px;
  p {
    // background-color: $ulight;
    font-weight: 500;
    font-size: 14px;
    padding: 4px 20px;
    border-radius: 100px;
  }
}

.comment_item {
  display: flex;
  flex-direction: column;
  // background-color: $ulight;
  padding: 10px;
  border-radius: 5px;
}

.comment__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  font-size: 12px;
  width: 100%;
  padding-bottom: 5px;
  border-bottom: 1px solid $light;
}

.contacts_people {
  list-style: none;
}

.card_tab_infoAdd {
  @include flex-start;
  gap: 10px;
  display: inline-flex;
  background-color: $ulight;
  padding: 10px 30px;
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;

  &:hover {
    background-color: $light-blue;
    color: $blue;
    svg {
      color: $blue !important;
    }
  }
}

.empty_comment {
  @include flex-start;
  border: 1px solid #7a7a7a2a;
  // box-shadow: 0px 0px 30px 0px #7a7a7a17;
  display: inline-flex;
  border-radius: 10px;
  padding: 20px 40px;
  img {
    max-width: 100px;
  }
  p {
    font-size: 22px;
    font-weight: 600;
    margin-left: 20px;
  }
}

.footer {
  padding: 0 10px 10px 10px;
}

.btn {
  border: 1px dashed #f0a029b9;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  padding: 3px 5px;
  background-color: #f0a02915;
  color: #f0a129;
  cursor: pointer;
}

.prefooter {
  font-size: 12px;
  padding: 5px 10px;
  border: 1px dashed #e7e7e7b9;
  background-color: #d4d4d415;
  display: inline-flex;
  margin: 0 10px 10px 10px;
  position: relative;
  min-width: 200px;
  padding-right: 150px;
}

.comment_date {
  font-size: 10px;
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
