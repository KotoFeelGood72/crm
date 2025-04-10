<template>
  <div
    class="w-full px-6 py-10 light:bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg md:w-[80vw] max-w-4xl relative"
    v-if="deal && deal.acf"
  >
    <div class="absolute top-2 right-2">
      <IconBtn
        icon="material-symbols:close-rounded"
        @click="closeAllModals(router, route)"
        class="inline-flex items-center justify-center w-6 h-6 text-gray-400 rounded dark:hover:text-gray-200 hover:text-gray-700"
        :icon-size="18"
      />
    </div>
    <div class="max-h-[70dvh] overflow-y-auto custom-scroll pr-2">
      <div class="deal__head">
        <div class="deal__preview">
          <h3
            class="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300"
          >
            {{ deal.title }}
          </h3>
        </div>
        <div class="right">
          <Button
            name="Сохранить"
            theme="primary"
            @click="saveDeal"
            v-if="isEditing"
          />
        </div>
      </div>
      <div class="deal__body">
        <Tabs :tabs="['Основное', 'Контакты', 'Коментарии', 'Дела']">
          <template #Основное>
            <div>
              <div class="grid grid-cols-3 gap-4 mb-3">
                <InputsEdit
                  label="Наименование:"
                  v-model="deal.acf.name"
                  place="Введите название"
                  :edit="isEditing"
                />
                <InputsEdit
                  label="Город:"
                  v-model="deal.acf.name"
                  place="Введите  город"
                  :edit="isEditing"
                />
                <InputsEdit
                  label="Адрес:"
                  v-model="deal.acf.name"
                  place="Введите адрес"
                  :edit="isEditing"
                />
              </div>
              <div class="grid grid-cols-3 gap-4">
                <InputsEdit
                  label="Youtube:"
                  v-model="deal.acf.name"
                  place="Введите название"
                  :edit="isEditing"
                />
                <InputsEdit
                  label="ВКонтакте:"
                  v-model="deal.acf.name"
                  place="Введите название"
                  :edit="isEditing"
                />
                <InputsEdit
                  label="График работы:"
                  v-model="deal.acf.name"
                  place="Введите график работы"
                  :edit="isEditing"
                />
              </div>
            </div>
          </template>

          <template #Контакты>
            <div>
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
              <InputsGroupEdit
                label="Номера телефонов:"
                v-model="deal.acf.whatsapps_list"
                place="Введите номер телефона"
                :edit="isEditing"
              />
              <InputsGroupEdit
                label="Whats App:"
                v-model="deal.acf.whatsapps_list"
                place="Введите номер WhatsApp"
                :edit="isEditing"
              />
              <InputsGroupEdit
                label="Веб-сайты:"
                v-model="deal.acf.whatsapps_list"
                place="Введите url сайта"
                :edit="isEditing"
              />
              <InputsGroupEdit
                label="E-Mail:"
                v-model="deal.acf.whatsapps_list"
                place="Введите e-mail"
                :edit="isEditing"
              />
              <InputsGroupEdit
                label="Telegrams:"
                v-model="deal.acf.whatsapps_list"
                place="Введите telegram"
                :edit="isEditing"
              />
            </div>
          </template>
          <template #Коментарии>
            <Textarea v-model="newComment" placeholder="Введите коментарий" />
            <Button name="Отправить" @click="handleComment" />
          </template>
          <template #Дела>
            <div>
              <div class="relative">
                <InputArea
                  v-model="newComment"
                  placeholder="Введите название дела"
                  @keydown.enter=""
                  :rows="6"
                />
                <div
                  class="input-footer absolute bottom-4 flex justify-between items-center w-full px-2"
                >
                  <div class="date">
                    <CalendarTimePicker v-model="newTaskDateTime" />
                  </div>
                  <div
                    class="submit text-gray-400 cursor-pointer flex items-center justify-center"
                  >
                    <Icons icon="formkit:submit" color="inherit" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabs from "@/components/ui/other/Tabs.vue";
import { useModalStore } from "@/store/useModalStore";
import { useDealStore, useDealStoreRefs } from "@/store/useDealStore";
import { useTaskStore, useTaskStoreRefs } from "@/store/useTaskStore";
import Button from "@/components/ui/buttons/Button.vue";
import Textarea from "@/components/ui/inputs/Textarea.vue";
import { ref, watch, watchEffect } from "vue";
import singleItem from "@/components/ui/row/single-item.vue";
import IconBtn from "@/components/ui/buttons/IconBtn.vue";
import CalendarTimePicker from "@/components/ui/inputs/CalendarTimePicker.vue";
import InputsEdit from "@/components/ui/inputs/InputsEdit.vue";
import InputsGroupEdit from "@/components/ui/inputs/InputsGroupEdit.vue";
import { useRoute, useRouter } from "vue-router";
import InputArea from "@/components/ui/inputs/InputArea.vue";

const { closeAllModals } = useModalStore();

const route = useRoute();
const router = useRouter();
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
