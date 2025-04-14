<template>
  <n-drawer
    v-model:show="modals.nLead"
    @update:show="closeModal"
    placement="right"
    default-width="600px"
  >
    <n-drawer-content :title="lead?.acf?.name">
      <n-scrollbar>
        <div v-if="lead && lead.acf" class="flex flex-col gap-2">
          <n-card title="Компания" size="small">
            <n-row class="flex flex-col gap-2">
              <n-row class="flex flex-col gap-2">
                <n-rate readonly :default-value="3" />
                <p>{{ lead.acf.reviews_count }}</p>
              </n-row>
              <n-input v-model:value="lead.acf.city" placeholder="Город" />
              <n-input v-model:value="lead.acf.spring" placeholder="Источник" />
              <n-input v-model:value="lead.acf.vk" placeholder="ВКонтакте" />
              <n-input v-model:value="lead.acf.youtube" placeholder="Youtube" />
            </n-row>
          </n-card>
          <n-card title="Номера телефонов" size="small">
            <n-dynamic-input
              v-model:value="lead.acf.phone_list"
              :max="10"
              item-style="margin-bottom: 6px"
              :on-create="() => ({ item: '' })"
            >
              <template #default="{ value }">
                <n-input v-model:value="value.item" placeholder="Телефон" />
              </template>
            </n-dynamic-input>
          </n-card>
          <n-card title="What`s App" size="small">
            <n-row>
              <n-dynamic-input
                v-model:value="lead.acf.whatsapps_list"
                :max="10"
                item-style="margin-bottom: 6px"
                :on-create="() => ({ item: '' })"
              >
                <template #default="{ value }">
                  <n-input v-model:value="value.item" placeholder="Телефон" />
                </template>
              </n-dynamic-input>
            </n-row>
          </n-card>
          <n-card title="Telegram" size="small">
            <n-row>
              <n-dynamic-input
                v-model:value="lead.acf.telegrams_list"
                :max="10"
                item-style="margin-bottom: 6px"
                :on-create="() => ({ item: '' })"
              >
                <template #default="{ value }">
                  <n-input v-model:value="value.item" placeholder="Телефон" />
                </template>
              </n-dynamic-input>
            </n-row>
          </n-card>
          <n-card title="E-Mail" size="small">
            <n-row>
              <n-dynamic-input
                v-model:value="lead.acf.emails_list"
                :max="10"
                item-style="margin-bottom: 6px"
                :on-create="() => ({ item: '' })"
              >
                <template #default="{ value }">
                  <n-input v-model:value="value.item" placeholder="Email" />
                </template>
              </n-dynamic-input>
            </n-row>
          </n-card>
          <n-card title="Website" size="small">
            <n-row>
              <n-dynamic-input
                v-model:value="lead.acf.websites_list"
                :max="10"
                item-style="margin-bottom: 6px"
                :on-create="() => ({ item: '' })"
              >
                <template #default="{ value }">
                  <n-input v-model:value="value.item" placeholder="Website" />
                </template>
              </n-dynamic-input>
            </n-row>
          </n-card>
          <n-row class="flex items-center gap-2">
            <n-button
              tertiary
              type="primary"
              class="flex-grow"
              @click="saveLead"
              :loading="isSaving"
            >
              Сохранить
            </n-button>

            <n-button
              tertiary
              type="error"
              class="flex-grow"
              @click="closeModal"
              :disabled="isSaving"
            >
              Закрыть
            </n-button>
          </n-row>
        </div>

        <n-space v-else class="absolute top-[50%] left-[50%] -translate-[-50%, -50%]">
          <n-spin size="large" />
        </n-space>
      </n-scrollbar>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { useModalStoreRefs, useModalStore } from "@/store/useModalStore";
import { useLeadsStore } from "@/store/useLeadsStore";
import { useRoute, useRouter } from "vue-router";
import { ref, watchEffect } from "vue";

const { modals } = useModalStoreRefs();
const { closeAllModals } = useModalStore();
const { getLeadById, updateLead } = useLeadsStore();

const route = useRoute();
const router = useRouter();
const lead = ref<any>(null);

// Добавляем реактивную переменную для состояния загрузки
const isSaving = ref(false);

const closeModal = () => {
  closeAllModals(router, route);
  lead.value = null;
};

const ensureArray = (value: any) =>
  Array.isArray(value)
    ? value.filter(
        (e) =>
          e && typeof e === "object" && typeof e.item === "string" && e.item.trim() !== ""
      )
    : [];

/**
 * Автоматически получаем lead по ID, когда открывается модал
 */
watchEffect(async () => {
  const leadId = route.query.lead;
  if (leadId && modals.value.nLead) {
    const result = await getLeadById(leadId);
    result.acf.phone_list = ensureArray(result.acf.phone_list);
    result.acf.whatsapps_list = ensureArray(result.acf.whatsapps_list);
    result.acf.telegrams_list = ensureArray(result.acf.telegrams_list);
    result.acf.emails_list = ensureArray(result.acf.emails_list);
    result.acf.websites_list = ensureArray(result.acf.websites_list);

    lead.value = result;
    console.log("lead получен:", lead.value);
  }
});

/**
 * Сохранение изменений по текущему lead
 */
const saveLead = async () => {
  try {
    if (!lead.value?.id) return;

    // Ставим индикатор загрузки
    isSaving.value = true;

    // Собираем поля для обновления
    await updateLead(lead.value.id, {
      // Предположим, что email лежит прямо на lead (если нет - уберите эту строку)
      email: lead.value.email,
      ...lead.value.acf,
    });

    // Успешно обновили - при необходимости закрываем модал
    // closeModal();
  } catch (error) {
    console.error("Ошибка при сохранении лида:", error);
  } finally {
    // Сбрасываем индикатор
    isSaving.value = false;
  }
};
</script>

<style scoped></style>
