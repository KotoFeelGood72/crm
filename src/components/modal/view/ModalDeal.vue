<template>
  <div class="deal" v-if="currentDeal && currentDeal.acf">
    <div class="deal__w">
      <div class="deal__head">
        <div class="deal__preview">
          <div class="deal_preview__img" v-if="currentDeal.acf.img?.link">
            <img :src="currentDeal.acf.img.link" alt="" />
          </div>
          <h3>{{ currentDeal.title }}</h3>
        </div>
        <div class="right">
          <Button name="Сохранить" theme="primary" @click="saveDeal" v-if="isEditing" />
          <p :class="{ active: isEditing }" @click="isEditing = !isEditing">
            {{ isEditing ? "Редактирование" : "Просмотр" }}
          </p>
          <CloseModal />
        </div>
      </div>
      <div class="deal__body">
        <div class="deal__blocks">
          <ul class="deal__info">
            <li>
              <singleItem
                label="Наименование:"
                v-model="currentDeal.acf.name"
                place="Введите название"
                :edit="isEditing"
              />
            </li>

            <li>
              <listItem
                label="Номера телефонов:"
                v-model="currentDeal.acf.phone_list"
                place="Введите номер телефона"
                :edit="isEditing"
              />
            </li>

            <li>
              <listItem
                label="Сайты:"
                v-model="currentDeal.acf.websites_list"
                place="Введите адрес сайта"
                :edit="isEditing"
              />
            </li>

            <li>
              <listItem
                label="Whats App:"
                v-model="currentDeal.acf.whatsapps_list"
                place="Введите номер WhatsApp"
                :edit="isEditing"
              />
            </li>

            <li>
              <listItem
                label="E-Mail:"
                v-model="currentDeal.acf.emails_list"
                place="Введите e-mail"
                :edit="isEditing"
              />
            </li>
          </ul>
        </div>

        <div class="deal__blocks">
          <ul class="deal__info">
            <li>
              <listItem
                label="Telegram:"
                v-model="currentDeal.acf.telegrams_list"
                place="Введите Telegram"
                :edit="isEditing"
              />
            </li>

            <li class="row">
              <singleItem
                label="Youtube:"
                v-model="currentDeal.acf.youtube"
                place="Введите Youtube"
                :edit="isEditing"
              />
              <singleItem
                label="ВКонтакте:"
                v-model="currentDeal.acf.vk"
                place="Введите ВКонтакте"
                :edit="isEditing"
              />
            </li>
          </ul>
        </div>

        <div class="deal__blocks">
          <ul class="deal__info">
            <li class="row">
              <singleItem
                label="Адрес:"
                v-model="currentDeal.acf.address"
                place="Введите Адрес"
                :edit="isEditing"
              />
              <singleItem
                label="Город:"
                v-model="currentDeal.acf.city"
                place="Введите Адрес"
                :edit="isEditing"
              />
            </li>

            <li class="row">
              <div class="flex-row">
                <p>Есть ли реклама?</p>
                <Switcher v-model="currentDeal.acf.is_ads" />
              </div>
              <div class="reviews__count">
                <singleItem
                  label="Кол-во отзывов:"
                  v-model="currentDeal.acf.reviews_count"
                  place="кол-во отзывов"
                  :edit="isEditing"
                />
                <ul class="reviews__stars">
                  <li v-for="n in Number(currentDeal.acf.stars)" :key="'stars-item' + n">
                    <Icons icon="fluent-emoji-flat:star" :size="16" />
                  </li>
                </ul>
              </div>
            </li>

            <li class="row">
              <singleItem
                label="График работы:"
                v-model="currentDeal.acf.schedule"
                place="Введите график работы"
                :edit="isEditing"
              />
              <singleItem
                label="Источник:"
                v-model="currentDeal.acf.spring"
                place="Введите источник"
                :edit="isEditing"
              />
            </li>
          </ul>
        </div>

        <div class="deal__blocks history-chat" v-if="currentDeal.acf.history?.length">
          <h4>История комментариев:</h4>
          <div class="chat-wrapper">
            <div
              class="message"
              v-for="(entry, index) in currentDeal.acf.history"
              :key="index"
              :class="{ self: entry.role === 'me' }"
            >
              <div class="bubble">
                <p class="txt">{{ entry.txt }}</p>
                <span class="time">{{ entry.time }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="textarea__w">
          <Textarea v-model="newComment" />
          <Button name="Отправить" @click="handleComment" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CloseModal from "@/components/ui/buttons/CloseModal.vue";
import { useDealStore, useDealStoreRefs } from "@/store/useDealStore";
import Button from "@/components/ui/buttons/Button.vue";
import Textarea from "@/components/ui/inputs/Textarea.vue";
import { ref, watchEffect } from "vue";
import singleItem from "@/components/ui/row/single-item.vue";
import listItem from "@/components/ui/row/list-item.vue";
import Switcher from "@/components/ui/inputs/Switcher.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const deal = ref<any>(null);
const isEditing = ref(false);

const { getDealById, updateDeal } = useDealStore();
const { currentDeal } = useDealStoreRefs();

const addHistory = (text: string) => {
  const now = new Date();
  const time = now.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!Array.isArray(deal.value.acf.history)) {
    deal.value.acf.history = [];
  }

  deal.value.acf.history.push({ txt: text, time });
};

const newComment = ref("");

const handleComment = async () => {
  if (!newComment.value.trim()) return;

  addHistory(newComment.value.trim());
  newComment.value = "";

  try {
    await updateDeal(deal.value.id, deal.value.acf);
  } catch (err) {
    console.error("Ошибка при сохранении комментария:", err);
  }
};

const saveDeal = async () => {
  try {
    await updateDeal(deal.value.id, deal.value.acf);
    isEditing.value = false;
  } catch (error) {
    console.error("Ошибка при обновлении:", error);
  }
};

watchEffect(async () => {
  const dealId = route.query.deal;
  if (dealId) {
    deal.value = await getDealById(dealId);
  }
});
</script>

<style scoped lang="scss">
.deal {
  overflow: hidden;
  width: 1100px;
  // padding: 20px;
  border-radius: 20px;
  background-color: #f8f7f7;

  ul {
    list-style: none;
  }
}

.modal_block__list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.deal__head {
  @include flex-space;
  padding: 20px;
  background-color: $white;
}

.bottom {
  @include flex-start;
  gap: 10px;
  background-color: $white;
}

.deal__body {
  padding: 20px;
  border-bottom: 1px solid #e1e0e0;
  border-top: 1px solid #e1e0e0;
  max-height: 70dvh;
  overflow-y: auto;
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

.right {
  @include flex-end;
  gap: 20px;
  p {
    background-color: #e1e0e0a7;
    padding: 5px 20px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;

    &.active {
      background-color: #f0a02919;
      color: #f0a129;
    }
  }
}

.reviews__count {
  @include flex-start;
  gap: 10px;
  position: relative;
}

.reviews__stars {
  @include flex-start;
  position: absolute;
  top: 70%;
  transform: translateY(-50%);
  right: 20px;
  li {
    @include flex-center;
  }
}

.history {
  margin-top: 10px;
  li {
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;

    .time {
      font-size: 12px;
      color: #999;
    }

    .txt {
      font-size: 14px;
      font-weight: 500;
    }
  }
}

.row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(45%, 1fr));
  grid-gap: 10px;
}

.flex-row {
  @include flex-start;
  gap: 10px;
  font-size: 12px;
  font-weight: 500;
}

.history-chat {
  margin-bottom: 20px;
  h4 {
    margin-bottom: 15px;
    font-size: 12px;
    font-weight: 600;
  }

  .chat-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 300px;
    overflow-y: auto;
    padding: 10px;
    background: #ffffff;
    border: 1px solid #ddd;
    border-radius: 10px;
  }

  .message {
    display: flex;
    justify-content: flex-start;
  }

  .bubble {
    max-width: 70%;
    min-width: 100px;
    background-color: #f0a02912;
    border: 1px solid #f0a0294e;
    padding: 10px 12px;
    border-radius: 6px;
    position: relative;
    font-size: 12px;
    line-height: 1.4;

    .txt {
      margin-bottom: 6px;
    }

    .time {
      font-size: 8px;
      color: #888;
      position: absolute;
      bottom: 6px;
      right: 10px;
    }
  }
}

.message.self {
  justify-content: flex-end;

  .bubble {
    background-color: #e6f9e8;
    border-color: #b7e6bd;
  }
}
</style>
