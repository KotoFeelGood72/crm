<template>
  <transition name="fade" @after-leave="handleAfterLeave">
    <div v-if="!isDeleted" class="card">
      <div class="card_top">
        <ul class="card_tab__link">
          <li
            @click.stop="activeTab = 'org'"
            :class="{ active: activeTab === 'org' }"
          >
            Сведение об организации
          </li>
          <li
            @click.stop="activeTab = 'history'"
            :class="{ active: activeTab === 'history' }"
          >
            Взаимодействие
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
              <Icons icon="solar:case-broken" :size="18" />
              <p>Организация:</p>
              <span>{{ card.acf.name }}</span>
            </li>
            <li>
              <Icons icon="solar:city-broken" :size="18" />
              <p>Отрасль:</p>
              <span>{{ card.category_name?.[0]?.name || "Не указано" }}</span>
            </li>
            <li>
              <Icons icon="solar:phone-rounded-broken" :size="18" />
              <p>Телефон контактный:</p>
              <div
                class="card__phone"
                v-if="formattedPhone"
                @click.stop="handlePhoneClick"
              >
                <span>{{ formattedPhone }}</span>
              </div>
            </li>
            <li>
              <Icons icon="solar:code-circle-broken" :size="18" />
              <p>Сайт:</p>
              <a
                :href="firstWebsite"
                target="_blank"
                @click.stop="handleWebsiteClick"
                >{{ firstWebsite }}</a
              >
            </li>
          </ul>
        </li>
        <li class="card_tab__content" v-if="activeTab === 'history'">
          <ul class="info__list history_list">
            <li class="history_item">
              <div class="item_head">
                <p>Перезвонить:</p>
              </div>
              <div class="input_date">
                <DatePicker
                  v-model="callback"
                  :format="'dd.MM.yyyy HH:mm'"
                  :month-change-on-scroll="false"
                  auto-apply
                  disable-year-select
                  :format-locale="ru"
                  placeholder="Выберите дату"
                  position="left"
                  @update:model-value="updateCallback"
                  select-text="Выбрать"
                  cancel-text="Закрыть"
                  @clear="clearCallback"
                />
                <Icons icon="solar:calendar-date-broken" />
              </div>
            </li>
            <li class="history_item comment">
              <div class="history_item__review">
                <div
                  class="empty_comment"
                  v-if="Object.keys(groupedComments).length === 0"
                >
                  <img
                    src="http://manager.dynamic-devs-collective.ru/wp-content/uploads/2024/09/empty-message.png"
                    alt=""
                  />
                  <p>Пусто</p>
                </div>
                <div class="comment__w" v-else>
                  <ul
                    v-for="(comments, date) in groupedComments"
                    :key="date"
                    class="comment_group"
                  >
                    <li class="comment_date">
                      <p>{{ date }}</p>
                    </li>
                    <ul class="comment_list">
                      <li
                        v-for="comment in comments"
                        :key="comment.id"
                        class="comment_item"
                      >
                        <div class="comment__head">
                          <span>{{ comment.comment_author }}</span>
                          <span class="comment_time">{{
                            new Date(comment.comment_date).toLocaleTimeString()
                          }}</span>
                        </div>
                        <p>{{ comment.comment_content }}</p>
                      </li>
                    </ul>
                  </ul>
                </div>
              </div>
              <div class="history_item__action">
                <textarea
                  name=""
                  id=""
                  placeholder="Оставить комментарий"
                  v-model="newComment"
                  @input="adjustTextareaHeight"
                  @click.stop
                  @keydown.enter="onEnter"
                ></textarea>
                <div class="send_comment" @click.stop="addComment">
                  <Icons
                    icon="solar:chat-round-unread-bold"
                    :size="20"
                  />Отправить
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <div class="card_bottom">
        <p>
          <Icons icon="solar:clipboard-text-broken" :size="14" />{{
            lastComment.comment_content
          }}
        </p>
        <div class="date">{{ lastComment.comment_date }}</div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Selects from "../dropdown/Selects.vue";
import { useModalStore } from "@/store/useModalStore";
import { useRouter } from "vue-router";
// @ts-ignore
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ru } from "date-fns/locale";
import { useClientStore, useClientStoreRefs } from "@/store/useClientStore";
import { useUsersStoreRefs } from "@/store/useUserStore";
import { api } from "@/api/api";
// import axios from "axios";

const props = withDefaults(
  defineProps<{
    card: any;
  }>(),
  {
    card: {},
  }
);

const { openModal } = useModalStore();
const clientStore = useClientStore();
const { statuses } = useClientStoreRefs();
const { users } = useUsersStoreRefs();
const router = useRouter();
const activeTab = ref<any>("org");
const callback = ref<any>(props.card.acf.callback);
const selectedStatus = ref<any>(props.card.acf.status);
const newComment = ref("");
const emit = defineEmits(["deleteCard", "updateCard"]);
const isLoading = ref(false);
const isDeleted = ref(false);

const lastComment = computed(() => {
  if (!props.card.comments || props.card.comments.length === 0) return null;
  // Сортируем по дате и берём последний
  return [...props.card.comments].sort((a, b) => {
    return (
      new Date(b.comment_date).getTime() - new Date(a.comment_date).getTime()
    );
  })[0];
});

const groupedComments = computed(() => {
  return props.card.comments.reduce((groups: any, comment: any) => {
    const date = new Date(comment.comment_date).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(comment);
    return groups;
  }, {});
});

const firstWebsite = computed(() => {
  if (!props.card.acf.websites) return null;
  const websitesArray = props.card.acf.websites
    .split(/[\s|,]+/)
    .map((item: any) => item.trim())
    .filter(isValidUrl);
  return websitesArray[0] || null;
});

const formattedPhone = computed(() => {
  if (!props.card.acf.phones) return null;
  const phones = props.card.acf.phones
    .split(" ")
    .map((phone: any) => phone.trim());
  const firstPhone = phones[0];
  if (firstPhone.startsWith("8")) {
    return formatPhoneNumber(firstPhone.replace("8", "+7"));
  } else {
    return formatPhoneNumber(firstPhone);
  }
});

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function formatPhoneNumber(phone: string): string {
  const cleaned = ("" + phone).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }
  return phone;
}

function updateStatus(newStatus: string) {
  clientStore.updateClientStatus(props.card.id, newStatus);
  emit("updateCard", {
    ...props.card,
    acf: { ...props.card.acf, status: newStatus },
  });
}

function clearCallback() {
  callback.value = null;
}

function onEnter(event: KeyboardEvent) {
  // Проверяем, нажата ли клавиша Shift
  if (event.shiftKey) {
    // Если Shift + Enter, то добавляем новую строку
    newComment.value += "\n";
  } else {
    // Если просто Enter, то вызываем метод отправки комментария
    addComment();
    // Предотвращаем стандартное поведение Enter
    event.preventDefault();
  }
}

async function addComment() {
  if (newComment.value.trim()) {
    try {
      // Отправляем новый комментарий через API
      await api.post("/wp-json/wp/v2/comments", {
        post: props.card.id,
        content: newComment.value.trim(),
        author_name: users.value.userInfo.name,
        author_email: users.value.userInfo.acf.user_email,
      });

      // После успешной отправки комментария, заново получаем обновленную карточку клиента
      const updatedCard = await api.get(
        `/wp-json/wp/v2/client_new/${props.card.id}`
      );

      // Обновляем карточку клиента в хранилище
      clientStore.updateClientInStore(updatedCard.data);

      console.log("Комментарий успешно добавлен и карточка обновлена.");
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
    }

    newComment.value = ""; // Очищаем поле ввода после отправки
  }
}

async function handlePhoneClick() {
  await clientStore.updateClient({
    id: props.card.id,
    acf: {
      ...props.card.acf,
      phone_visible: true,
    },
  });
  console.log(props.card.phone_visible);
  openQR(formattedPhone.value, "phone");
}

function handleWebsiteClick(event: Event) {
  event.preventDefault();
  window.open(firstWebsite.value, "_blank");
}

function openQR(link: any, type: "phone" | "url") {
  openModal("qr");
  if (type === "phone") {
    const query = { ...router.currentRoute.value.query, phone: link };
    router.push({ query });
  }
}

async function deleteCard() {
  isLoading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    emit("deleteCard");
    isDeleted.value = true;
  } catch (error) {
    console.error("Failed to delete card: ", error);
  } finally {
    isLoading.value = false;
  }
}

// function triggerDelete() {
//   isDeleted.value = true;
// }

function handleAfterLeave() {
  deleteCard();
}

function adjustTextareaHeight(event: Event) {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

async function updateCallback(newCallback: Date) {
  try {
    isLoading.value = true;

    await clientStore.updateClient({
      id: props.card.id,
      acf: {
        ...props.card.acf,
        callback: newCallback,
      },
    });

    callback.value = newCallback;
    props.card.acf.callback = newCallback;
  } catch (error) {
    console.error("Ошибка при обновлении поля 'Перезвонить':", error);
  } finally {
    isLoading.value = false;
  }
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

.card_bottom {
  background-color: #f5f5f5f5;
  padding: 5px 10px;
  font-size: 12px;
  margin: 10px;
  border-radius: 5px;
  gap: 40px;

  p {
    @include flex-start;
    gap: 5px;
  }
}
</style>
