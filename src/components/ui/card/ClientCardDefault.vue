<!-- @format -->

<template>
  <transition name="fade" @after-leave="handleAfterLeave">
    <div v-if="!isDeleted" class="card" @click="openClient(card.id)">
      <div v-if="isLoading" class="loading-overlay">
        <p>Loading...</p>
      </div>
      <div v-else class="card__row">
        <div class="card_col__left">
          <div class="card__title">
            <p>{{ card.acf.name }}</p>
          </div>
          <div class="card__address" @click.stop="copyToClipboard(card.acf.address)">
            <span>{{ card.acf.address }}</span>
            <div class="clipboard">
              <Icons icon="solar:clipboard-linear" size="18px" color="#424242" />
            </div>
          </div>
          <div class="card__phone" v-if="formattedPhone" @click.stop="handlePhoneClick">
            <span>{{ formattedPhone }}</span>
            <div class="clipboard" @click.stop="copyToClipboard(formattedPhone)">
              <Icons icon="solar:clipboard-linear" size="18px" color="#424242" />
            </div>
          </div>
          <div class="card__phone__mobile" v-if="formattedPhone" @click.stop>
            <a :href="`tel:${formattedPhone}`">{{ formattedPhone }}</a>
          </div>
          <div class="card__website" v-if="firstWebsite" @click.stop>
            <a :href="firstWebsite" target="_blank" @click.stop="handleWebsiteClick">{{
              firstWebsite
            }}</a>
          </div>
        </div>
        <div class="card_col__right">
          <div class="card__status">
            <div v-tooltip="'В обработке'">
              <div
                class="status_processing"
                @click.stop="updateStatus('В обработке')"
              ></div>
            </div>
            <div v-tooltip="'В работе'">
              <div class="status_working" @click.stop="updateStatus('В работе')"></div>
            </div>
            <div v-tooltip="'Клиент'">
              <div class="status_client" @click.stop="updateStatus('Клиент')"></div>
            </div>
            <div v-tooltip="'Не актуально'">
              <div
                class="status_not-relevant"
                @click.stop="updateStatus('Не актуально')"
              ></div>
            </div>
          </div>
          <div class="card__btn">
            <div class="card__open" @click="openClient(card.id)" v-tooltip="'Открыть'">
              <Icons icon="ion:open-outline" size="22px" color="green" />
              <p>Открыть</p>
            </div>
            <div class="card__delete" @click.stop="triggerDelete" v-tooltip="'Удалить'">
              <Icons icon="weui:delete-outlined" size="22px" color="white" />
              <p>Удалить</p>
            </div>
          </div>
        </div>
      </div>
      <div class="card__commentary">{{ card.acf.comment }}</div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useModalStore } from "@/store/useModalStore";
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

const emit = defineEmits(["deleteCard", "updateCard"]);
const isLoading = ref(false);
const isDeleted = ref(false);

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
  const phones = props.card.acf.phones.split(" ").map((phone: any) => phone.trim());
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
  emit("updateCard", { ...props.card, acf: { ...props.card.acf, status: newStatus } });
}

function copyToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log(`Copied to clipboard: ${text}`);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
}

function openClient(id: number) {
  openModal("client");
  const query = { ...router.currentRoute.value.query, client: id };
  router.push({ query });
}

function handlePhoneClick() {
  openQR(formattedPhone.value, "phone");
  // updateStatus("В обработке");
}

function handleWebsiteClick(event: Event) {
  event.preventDefault();
  // updateStatus("В обработке");
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
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Имитируем запрос на сервер
    emit("deleteCard");
    isDeleted.value = true;
  } catch (error) {
    console.error("Failed to delete card: ", error);
  } finally {
    isLoading.value = false;
  }
}

function triggerDelete() {
  isDeleted.value = true;
}

function handleAfterLeave() {
  deleteCard();
}
</script>

<style scoped lang="scss">
.card {
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  @include bp($point_2, $direction: min) {
    min-height: 325px;
  }

  &:hover {
    box-shadow: 0 0 30px 0 #6161610e;
  }
}
// .card_col__left,
// .card_col__right,
.card__btn {
  @include flex-start;
}

.card_col__left,
.card_col__right {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.card_col__left {
  gap: 10px;
  flex-grow: 1;
  min-height: 182px;

  @include bp($point_4) {
    max-width: 100%;
    flex-direction: column;
    width: 100%;
  }
}
.card_col__right {
  gap: 30px;
  height: 100%;
  @include bp($point_4) {
    flex-direction: column;
    width: 100%;
    position: relative;
    z-index: 3;
  }
}
.card__btn {
  gap: 5px;
}

:deep(.tooltip-holder) {
  @include bp($point_4) {
    gap: 10px;
  }
}

.card {
  justify-content: space-between;
  background-color: $bg-color-quaternary;
  border-radius: 10px;
  padding: 15px 20px;

  :deep(.avatar) {
    @include bp($point_4) {
      display: none;
    }
  }
}

.card__status {
  @include flex-space;
  gap: 7px;
  div {
    width: 25%;
    height: 25px;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    box-shadow: 0px 2px 10px 0px #00000017;
    z-index: 99;

    &.status_processing {
      background-color: $secondary-orange-active;
      width: 100%;
      &:hover {
        background-color: $primary-orange;
      }
    }
    &.status_working {
      background-color: $secondary-green-active;
      width: 100%;
      &:hover {
        background-color: $primary-green;
      }
    }
    &.status_client {
      background-color: $secondary-blue-active;
      width: 100%;
      &:hover {
        background-color: $primary-blue;
      }
    }
    &.status_not-relevant {
      background-color: $secondary-red-active;
      width: 100%;
      &:hover {
        background-color: $primary-red;
      }
    }
  }
}

.card__open {
  background-color: $secondary-green;
  @include flex-center;
  padding: 7px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: $secondary-green-active;
  }
}
.card__delete {
  background-color: $primary-red;
  @include flex-center;
  padding: 7px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: $primary-red-hover;
  }
}

.card__phone,
.card__phone__mobile,
.card__website,
.card__categories,
.card__title,
.card__address {
  gap: 10px;
  padding: 7px 20px;
  font-size: $small-3;
  cursor: pointer;
  position: relative;
  z-index: 2;
  @include flex-start;
  font-size: 16px;
  @include bp($point_4) {
    width: 100%;
    justify-content: flex-start;
    padding: 7px;
  }
  p,
  a,
  span {
    @include bp($point_4) {
      max-width: 250px !important;
    }
  }
  &:hover {
    &:before {
      background-color: #94939348;
    }
  }
  &:before {
    border-radius: 5px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #9493931a;
    content: "";
    z-index: -1;
    // backdrop-filter: blur(20px);
    transition: all 0.3s ease-in-out;

    @include bp($point_4) {
      backdrop-filter: blur(0px);
    }
  }
}

.card__website {
  a {
    max-width: 115px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    @include bp($point_4) {
      max-width: 100%;
      @include flex-start;
      width: 100%;
      height: 100%;
    }
  }
}

.clipboard {
  @include flex-center;
}

.status-new {
  background-color: $bg-color-secondary;
}

.status-processing {
  background-color: $secondary-orange;
  .card__status {
    .status_processing {
      background-color: $primary-orange;
    }
  }
}
.status-working {
  background-color: $secondary-green;
  .card__status {
    .status_working {
      background-color: $primary-green;
    }
  }
}

.status-client {
  background-color: $secondary-blue;
  .card__status {
    .status_client {
      background-color: $primary-blue;
    }
  }
}
.status-not-relevant {
  background-color: $secondary-red;
  .card__status {
    .status_not-relevant {
      background-color: $primary-red;
    }
  }
}
.status-work {
  background-color: $secondary-green;
  .card__status {
    .status_not-relevant {
      background-color: $primary-green;
    }
  }
}

.card__title {
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.card__address {
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.card__phone {
  @include bp($point_4) {
    display: none;
  }
}
.card__phone__mobile {
  display: none;
  @include bp($point_4) {
    display: block;
  }
  a {
    @include flex-start;
    width: 100%;
    height: 100%;
    font-size: 20px;
    text-decoration: none;
    color: $text-color-primary;
  }
}

.card__website {
  a {
    @include bp($point_4) {
      @include flex-start;
      width: 100%;
      height: 100%;
      font-size: 20px;
      text-decoration: none;
      color: $text-color-primary;
      max-width: 100%;
    }
  }
}

.card__title {
  p {
    @include bp($point_4) {
      font-size: 18px;
      max-width: 90%;
    }
  }
}

.card__btn {
  @include bp($point_4) {
    gap: 10px;
    width: 100%;
  }
  & > div {
    gap: 10px;
    flex-grow: 1;
    &:nth-child(2) {
      p {
        color: #fff;
      }
    }
  }
  p {
    font-size: 16px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.card__row {
  @include flex-space;
  width: 100%;
  flex-direction: column;
  gap: 20px;
}
</style>
