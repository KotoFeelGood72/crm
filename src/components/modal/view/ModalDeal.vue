<template>
  <div class="deal" v-if="deal && deal.acf">
    <div class="deal__w">
      <div class="deal__head">
        <div class="deal__preview">
          <div class="deal_preview__img" v-if="deal.acf.img?.link">
            <img :src="deal.acf.img.link" alt="" />
          </div>
          <h3>{{ deal.title }}</h3>
        </div>
        <div class="right">
          <Button
            name="Сохранить"
            theme="primary"
            @click="saveDeal"
            v-if="isEditing"
          />
          <p :class="{ active: isEditing }" @click="isEditing = !isEditing">
            {{ isEditing ? "Просмотреть" : "Редактировать" }}
          </p>
          <CloseModal />
        </div>
      </div>
      <div class="deal__body">
        <div class="deal__tabs">
          <ul class="tabs">
            <li
              :class="{ active: activeTab === 'deal' }"
              @click="activeTab = 'deal'"
            >
              Сделка
            </li>
            <li
              :class="{ active: activeTab === 'tasks' }"
              @click="activeTab = 'tasks'"
            >
              Дела
            </li>
          </ul>
        </div>
        <div v-if="activeTab === 'deal'">
          <!-- вся текущая информация о сделке -->
          <div class="deal__blocks">
            <ul class="deal__info">
              <li>
                <singleItem
                  label="Наименование:"
                  v-model="deal.acf.name"
                  place="Введите название"
                  :edit="isEditing"
                />
              </li>

              <li>
                <listItem
                  label="Номера телефонов:"
                  v-model="deal.acf.phone_list"
                  place="Введите номер телефона"
                  :edit="isEditing"
                />
              </li>

              <li>
                <listItem
                  label="Сайты:"
                  v-model="deal.acf.websites_list"
                  place="Введите адрес сайта"
                  :edit="isEditing"
                />
              </li>

              <li>
                <listItem
                  label="Whats App:"
                  v-model="deal.acf.whatsapps_list"
                  place="Введите номер WhatsApp"
                  :edit="isEditing"
                />
              </li>

              <li>
                <listItem
                  label="E-Mail:"
                  v-model="deal.acf.emails_list"
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
                  v-model="deal.acf.telegrams_list"
                  place="Введите Telegram"
                  :edit="isEditing"
                />
              </li>

              <li class="row">
                <singleItem
                  label="Youtube:"
                  v-model="deal.acf.youtube"
                  place="Введите Youtube"
                  :edit="isEditing"
                />
                <singleItem
                  label="ВКонтакте:"
                  v-model="deal.acf.vk"
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
                  v-model="deal.acf.address"
                  place="Введите Адрес"
                  :edit="isEditing"
                />
                <singleItem
                  label="Город:"
                  v-model="deal.acf.city"
                  place="Введите Адрес"
                  :edit="isEditing"
                />
              </li>

              <li class="row">
                <div class="flex-row">
                  <p>Есть ли реклама?</p>
                  <Switcher v-model="deal.acf.is_ads" />
                </div>
                <div class="reviews__count">
                  <singleItem
                    label="Кол-во отзывов:"
                    v-model="deal.acf.reviews_count"
                    place="кол-во отзывов"
                    :edit="isEditing"
                  />
                  <ul class="reviews__stars">
                    <li
                      v-for="n in Number(deal.acf.stars)"
                      :key="'stars-item' + n"
                    >
                      <Icons icon="fluent-emoji-flat:star" :size="16" />
                    </li>
                  </ul>
                </div>
              </li>

              <li class="row-3">
                <singleItem
                  label="График работы:"
                  v-model="deal.acf.schedule"
                  place="Введите график работы"
                  :edit="isEditing"
                />
                <singleItem
                  label="Источник:"
                  v-model="deal.acf.spring"
                  place="Введите источник"
                  :edit="isEditing"
                />
                <singleItem
                  label="Цена:"
                  v-model="deal.acf.price"
                  place="Введите стоимость"
                  :edit="isEditing"
                />
              </li>
              <li class="row-flex">
                <ul class="contacts__list">
                  <li
                    class="contacts__item"
                    v-for="(item, index) in deal.acf.contacts_list"
                  >
                    <singleItem
                      label="ФИО:"
                      v-model="item.fio"
                      place="Введите ФИо"
                      :edit="isEditing"
                    />
                    <singleItem
                      label="Номер телефона:"
                      v-model="item.phone"
                      place="Введите номер телефона"
                      :edit="isEditing"
                    />
                    <singleItem
                      label="Должность:"
                      v-model="item.prof"
                      place="Введите должность"
                      :edit="isEditing"
                    />
                    <div class="toggle__contacts">
                      <input
                        type="radio"
                        name="contacts"
                        :value="index"
                        v-model="selectedContactIndex"
                      />
                    </div>
                  </li>
                </ul>
                <div class="add" @click="addContact" v-if="isEditing">
                  <div class="add-icon">
                    <Icons icon="ic:round-plus" :size="14" color=" #f0a029e9" />
                  </div>
                  <p>Добавить</p>
                </div>
              </li>
            </ul>
          </div>

          <div
            class="deal__blocks history-chat"
            v-if="deal.acf.history?.length"
          >
            <h4>История комментариев:</h4>
            <div class="chat-wrapper">
              <div
                class="message"
                v-for="(entry, index) in deal.acf.history"
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
            <Textarea v-model="newComment" placeholder="Введите дело" />
            <Button name="Отправить" @click="handleComment" />
          </div>
        </div>
        <div v-if="activeTab === 'tasks'" class="tasks_tab">
          <div class="task_input">
            <input v-model="newTaskTitle" placeholder="Что нужно сделать" />
            <input type="datetime-local" v-model="newTaskDateTime" />
            <Button name="Добавить" @click="addTask" />
          </div>

          <div class="task_list">
            <div
              v-for="task in tasks"
              :key="task.id"
              class="task_item"
              :class="{ done: task.done }"
            >
              <div class="task_top">
                <input
                  type="checkbox"
                  v-model="task.done"
                  @change="updateTask(task.id!, { done: task.done })"
                />
                <strong>{{ task.title }}</strong>
                <small>{{ formatTaskDate(task.date, task.time) }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CloseModal from "@/components/ui/buttons/CloseModal.vue";
import { useDealStore, useDealStoreRefs } from "@/store/useDealStore";
import { useTaskStore, useTaskStoreRefs } from "@/store/useTaskStore";
import Button from "@/components/ui/buttons/Button.vue";
import Textarea from "@/components/ui/inputs/Textarea.vue";
import { ref, watch, watchEffect } from "vue";
import singleItem from "@/components/ui/row/single-item.vue";
import listItem from "@/components/ui/row/list-item.vue";
import Switcher from "@/components/ui/inputs/Switcher.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isEditing = ref(false);
const selectedContactIndex = ref<number | null>(null);
const { getDealById, updateDeal } = useDealStore();
const { getTasks, updateTask, createTask } = useTaskStore();
const { tasks } = useTaskStoreRefs();
const { deal } = useDealStoreRefs();
const activeTab = ref<"deal" | "tasks">("deal");

const newTaskTitle = ref("");
const newTaskDateTime = ref("");

const addTask = async () => {
  if (!newTaskTitle.value || !newTaskDateTime.value) return;

  const [date, time] = newTaskDateTime.value.split("T");

  await createTask({
    deal_id: deal.value.id,
    title: newTaskTitle.value,
    date,
    time,
    done: false,
  });

  newTaskTitle.value = "";
  newTaskDateTime.value = "";
};

const formatTaskDate = (date: string, time: string) =>
  `Сделать до ${new Date(`${date}T${time}`).toLocaleString("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  })}`;

watch(selectedContactIndex, (newIndex: any) => {
  deal.value.acf.contacts_list.forEach((contact: any, i: any) => {
    contact.priority = i === newIndex;
  });
});

watchEffect(() => {
  const deals = deal.value;
  if (!deals || !deals.acf || !Array.isArray(deals.acf.contacts_list)) return;

  const index = deals.acf.contacts_list.findIndex(
    (c: any) => c.priority === true
  );
  if (index !== -1) {
    selectedContactIndex.value = index;
  }
});

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

const addContact = () => {
  if (!Array.isArray(deal.value.acf.contacts_list)) {
    deal.value.acf.contacts_list = [];
  }

  deal.value.acf.contacts_list.push({
    fio: "",
    phone: "",
    prof: "",
    priority: false,
  });
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
    await getDealById(dealId);
    await getTasks(+dealId); // 👈 Подгружаем дела
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

.row-3 {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
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

.add {
  @include flex-center;
  gap: 5px;
  background-color: #f0a02912;
  padding: 5px;
  font-size: 12px;
  font-weight: 500;
  border: 1px dashed #f0a0296b;
  color: #f0a029e9;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: #f0a02935;
  }
}

.add-icon {
  @include flex-center;
}

.contacts__item {
  @include flex-center;
  gap: 10px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  li {
    padding: 8px 16px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    &.active {
      background-color: #f0a02919;
      border-color: #f0a029;
      color: #f0a029;
    }
  }
}

.tasks_tab {
  .task_input {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    input {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 14px;
    }
  }

  .task_list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .task_item {
    background-color: #fff8e5;
    border: 1px solid #f0a0293b;
    padding: 12px;
    border-radius: 10px;

    &.done {
      opacity: 0.6;
      text-decoration: line-through;
    }

    .task_top {
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: space-between;

      strong {
        font-size: 14px;
      }

      small {
        font-size: 12px;
        color: #888;
      }
    }

    .task_actions {
      margin-top: 8px;
    }
  }
}
</style>
