<template>
  <n-drawer
    v-model:show="modals.nDeal"
    @update:show="closeModal"
    placement="right"
    default-width="700px"
  >
    <n-drawer-content :title="deal?.acf?.name">
      <n-scrollbar>
        <div v-if="deal && deal.acf" class="flex flex-col gap-2">
          <n-tabs type="line" animated>
            <n-tab-pane name="Сделка" tab="Сделка">
              <div class="flex flex-col gap-2">
                <n-card size="small" title="Статус">
                  <n-select
                    v-model:value="deal.acf.status"
                    :options="isStatus"
                  />
                </n-card>
                <n-card size="small" title="Тип услуги">
                  {{ deal.acf.services }}
                  <n-select
                    v-model:value="deal.acf.services"
                    multiple
                    placeholder="Выберите сервисы"
                    :options="isServices"
                    filterable
                  />
                </n-card>
                <n-card title="Компания" size="small">
                  <n-row class="flex flex-col gap-2">
                    <n-row class="flex flex-col gap-2">
                      <n-rate readonly :default-value="4.5" allow-half />
                      <p>{{ deal.acf.reviews_count }}</p>
                    </n-row>
                    <n-input
                      v-model:value="deal.acf.city"
                      placeholder="Город"
                    />
                    <n-input
                      v-model:value="deal.acf.spring"
                      placeholder="Источник"
                    />
                    <n-input
                      v-model:value="deal.acf.vk"
                      placeholder="ВКонтакте"
                    />
                    <n-input
                      v-model:value="deal.acf.youtube"
                      placeholder="Youtube"
                    />
                  </n-row>
                </n-card>
                <n-card title="Номера телефонов" size="small">
                  <n-dynamic-input
                    v-model:value="deal.acf.phone_list"
                    :max="10"
                    item-style="margin-bottom: 6px"
                    :on-create="() => ({ item: '' })"
                  >
                    <template #default="{ value }">
                      <n-input
                        v-model:value="value.item"
                        placeholder="Телефон"
                      />
                    </template>
                  </n-dynamic-input>
                </n-card>
                <n-card title="What`s App" size="small">
                  <n-row>
                    <n-dynamic-input
                      v-model:value="deal.acf.whatsapps_list"
                      :max="10"
                      item-style="margin-bottom: 6px"
                      :on-create="() => ({ item: '' })"
                    >
                      <template #default="{ value }">
                        <n-input
                          v-model:value="value.item"
                          placeholder="Телефон"
                        />
                      </template>
                    </n-dynamic-input>
                  </n-row>
                </n-card>
                <n-card title="Telegram" size="small">
                  <n-row>
                    <n-dynamic-input
                      v-model:value="deal.acf.telegrams_list"
                      :max="10"
                      item-style="margin-bottom: 6px"
                      :on-create="() => ({ item: '' })"
                    >
                      <template #default="{ value }">
                        <n-input
                          v-model:value="value.item"
                          placeholder="Телефон"
                        />
                      </template>
                    </n-dynamic-input>
                  </n-row>
                </n-card>
                <n-card title="E-Mail" size="small">
                  <n-row>
                    <n-dynamic-input
                      v-model:value="deal.acf.emails_list"
                      :max="10"
                      item-style="margin-bottom: 6px"
                      :on-create="() => ({ item: '' })"
                    >
                      <template #default="{ value }">
                        <n-input
                          v-model:value="value.item"
                          placeholder="Телефон"
                        />
                      </template>
                    </n-dynamic-input>
                  </n-row>
                </n-card>
                <n-card title="Website" size="small">
                  <n-row>
                    <n-dynamic-input
                      v-model:value="deal.acf.websites_list"
                      :max="10"
                      item-style="margin-bottom: 6px"
                      :on-create="() => ({ item: '' })"
                    >
                      <template #default="{ value }">
                        <n-input
                          v-model:value="value.item"
                          placeholder="Телефон"
                        />
                      </template>
                    </n-dynamic-input>
                  </n-row>
                </n-card>
                <n-row class="flex items-center gap-2">
                  <n-button
                    tertiary
                    type="primary"
                    class="flex-grow"
                    @click="handleSave"
                  >
                    Сохранить
                  </n-button>
                  <n-button
                    tertiary
                    type="error"
                    class="flex-grow"
                    @click="closeModal"
                  >
                    Закрыть
                  </n-button>
                </n-row>
              </div>
            </n-tab-pane>
            <n-tab-pane name="Комментарии" tab="Комментарии">
              <n-card title="Комментарии" size="small" class="mb-2">
                <n-infinite-scroll style="max-height: 60dvh" :distance="10">
                  <n-steps vertical>
                    <n-step
                      v-for="item in deal.acf.history"
                      :title="item.time"
                      :description="item.txt"
                    />
                  </n-steps>
                </n-infinite-scroll>
              </n-card>
              <n-input
                v-model:value="newComment"
                type="textarea"
                class="mb-2"
                @keydown:enter="handleComment"
              />
              <n-button
                class="w-full"
                tertiary
                type="success"
                @click="handleComment"
                >Отправить</n-button
              >
            </n-tab-pane>
            <n-tab-pane name="Дела" tab="Дела">
              <n-card title="Дела" size="small" class="mb-4">
                <n-infinite-scroll style="max-height: 60dvh" :distance="10">
                  <n-steps vertical>
                    <n-data-table
                      :columns="columns"
                      :data="tasks"
                      :pagination="false"
                      :bordered="false"
                    />
                  </n-steps>
                </n-infinite-scroll>
              </n-card>
              <n-input
                v-model:value="newTaskTitle"
                type="textarea"
                class="mb-2"
                @keydown:enter="addTask"
              />
              <div class="flex items-center gap-2">
                <n-date-picker
                  v-model:formatted-value="newTaskDateTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  clearable
                  class="flex-grow"
                />

                <n-button tertiary type="success" @click="addTask"
                  >Отправить</n-button
                >
              </div>
            </n-tab-pane>
          </n-tabs>
        </div>
        <n-space
          v-else
          class="absolute top-[50%] left-[50%] -translate-[-50%, -50%]"
        >
          <n-spin size="large" />
        </n-space>
      </n-scrollbar>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { useModalStoreRefs, useModalStore } from "@/store/useModalStore";
import { useDealStore, useDealStoreRefs } from "@/store/useDealStore";
import { useRoute, useRouter } from "vue-router";
import { computed, ref, watchEffect } from "vue";
import { useTaskStore, useTaskStoreRefs } from "@/store/useTaskStore";
import { h } from "vue";
// @ts-ignore
import { NButton } from "naive-ui";
import Icons from "../ui/Icons.vue";
import { mapToSelectOptions } from "@/utils/mapToSelectOptions";
import { useSettingsStoreRefs } from "@/store/useSettingsStore";

const { modals } = useModalStoreRefs();
const { closeAllModals } = useModalStore();
const { getTasks, updateTask, createTask, deleteTask } = useTaskStore();
const { tasks } = useTaskStoreRefs();
const { getDealById, updateDeal } = useDealStore();
const { statuses, deal } = useDealStoreRefs();
const { settings } = useSettingsStoreRefs();
const route = useRoute();
const router = useRouter();
const newComment = ref("");
const newTaskTitle = ref("");
const newTaskDateTime = ref<any>(null);

const isServices = computed(() => {
  return settings.value.global.services.map((service: any) => ({
    label: service.name,
    value: service,
  }));
});
const isStatus = computed(() => {
  return mapToSelectOptions(statuses.value, "name", "id", true);
});

const handleSave = async () => {
  try {
    // Отправляем все ACF-поля (включая статус, телефоны и т. д.) на сервер
    await updateDeal(deal.value.id, deal.value.acf);
    console.log("✅ Изменения сохранены:", deal.value.acf);
  } catch (error) {
    console.error("❌ Ошибка при сохранении сделки:", error);
  }
};

const columns = [
  {
    title: "Задача",
    key: "title",
  },
  {
    title: "Дата/время",
    key: "dateTime",
    render(rowData: any) {
      // Предположим, что в rowData есть поля rowData.date и rowData.time.
      // Склеиваем их одной строкой.
      const display = `${rowData.date} ${rowData.time ?? ""}`.trim();
      return h("div", display);
    },
  },
  {
    title: "Статус",
    key: "done",
    render(rowData: any) {
      const statusText = rowData.done ? "Завершена" : "В процессе";
      const iconName = rowData.done
        ? "material-symbols:check-circle-outline"
        : "material-symbols:schedule"; // или любые ваши иконки

      return h("div", [
        h(Icons, { icon: iconName, color: "inherit", size: 18 }),
      ]);
    },
  },
  {
    title: "Действия",
    key: "actions",
    render: (rowData: any) => {
      return h(
        "div",
        {
          class: "flex items-center gap-2 ",
        },
        [
          h(
            NButton,
            {
              text: true,
              type: "success",
              size: "small",
              onClick: () => handleComplete(rowData),
            },
            {
              // Иконку передаём через слот `icon`
              icon: () =>
                h(Icons, {
                  icon: rowData.done
                    ? "iconamoon:player-end-light"
                    : "iconamoon:player-end-light",
                  color: "inherit",
                }),
            }
          ),
          h(
            NButton,
            {
              text: true,
              type: "error",
              size: "small",
              onClick: () => handleDelete(rowData),
            },
            {
              icon: () =>
                h(Icons, {
                  icon: "material-symbols:close-rounded",
                  color: "inherit",
                }),
            }
          ),
        ]
      );
    },
  },
];

function handleComplete(task: any) {
  // Переключаем статус. Например, если task.done = false, делаем true
  updateTask(task.id, { done: !task.done });
}

function handleDelete(task: any) {
  // Удаляем
  deleteTask(task.id);
}

const closeModal = () => {
  closeAllModals(router, route);
  deal.value = null;
};

const ensureArray = (value: any) =>
  Array.isArray(value)
    ? value.filter(
        (e) =>
          e &&
          typeof e === "object" &&
          typeof e.item === "string" &&
          e.item.trim() !== ""
      )
    : [];

watchEffect(async () => {
  const dealId = route.query.deal;
  if (dealId && modals.value.nDeal) {
    await getDealById(dealId);

    // Гарантируем, что все списки массивы
    deal.value.acf.phone_list = ensureArray(deal.value.acf.phone_list).filter(
      (e) => e?.item?.trim?.() !== ""
    );
    deal.value.acf.services = ensureArray(deal.value.acf.services).filter(
      (e) => e?.item?.trim?.() !== ""
    );
    deal.value.acf.whatsapps_list = ensureArray(
      deal.value.acf.whatsapps_list
    ).filter((e) => e?.item?.trim?.() !== "");
    deal.value.acf.telegrams_list = ensureArray(
      deal.value.acf.telegrams_list
    ).filter((e) => e?.item?.trim?.() !== "");
    deal.value.acf.emails_list = ensureArray(deal.value.acf.emails_list).filter(
      (e) => e?.item?.trim?.() !== ""
    );
    deal.value.acf.websites_list = ensureArray(
      deal.value.acf.websites_list
    ).filter((e) => e?.item?.trim?.() !== "");

    console.log("deal получен:", deal.value);
    await getTasks(Number(dealId));
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

const addTask = async () => {
  if (!newTaskTitle.value || !newTaskDateTime.value) return;

  // Раскладываем datetime формата 'YYYY-MM-DD HH:mm:ss', если необходимо
  const [date, time] = newTaskDateTime.value?.split(" ");

  try {
    await createTask({
      deal_id: deal.value.id,
      title: newTaskTitle.value,
      date,
      time,
      done: false,
    });
    // Очистить поля
    newTaskTitle.value = "";
    newTaskDateTime.value = null;
    const dealId = route.query.deal;
    await getTasks(Number(dealId));
  } catch (error) {
    console.error("Ошибка при создании задачи:", error);
  }
};

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
</script>
