<template>
  <div
    class="w-full px-6 py-10 overflow-hidden light:bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:max-w-xl"
    role="dialog"
  >
    <div class="absolute top-2 right-2">
      <IconBtn
        icon="material-symbols:close-rounded"
        @click="closeAllModals(router, route)"
        class="inline-flex items-center justify-center w-6 h-6 text-gray-400 rounded dark:hover:text-gray-200 hover:text-gray-700"
        :icon-size="18"
        :class="{ 'opacity-0': isLoading }"
      />
    </div>

    <div class="relative">
      <Skeletor
        width="100%"
        class="h-full rounded-md w-full flex-grow flex absolute top-0 left-0"
        v-if="isLoading"
      />
      <p
        class="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300"
        :class="{ 'opacity-0': isLoading }"
      >
        Обратная связь по лиду
      </p>
    </div>
    <div class="relative">
      <Skeletor
        width="100%"
        class="h-full rounded-md w-full flex-grow flex absolute top-0 left-0"
        v-if="isLoading"
      />
      <span
        class="mt-4 mb-8 text-base text-gray-700 dark:text-gray-300 block"
        :class="{ 'opacity-0': isLoading }"
        >Оставьте обратную связь по лиду, с целью сбора статистики, и отладки
        алгоритма подбора контактов</span
      >
    </div>
    <div class="relative">
      <Skeletor
        width="100%"
        class="h-full rounded-md w-full flex-grow flex absolute top-0 left-0"
        v-if="isLoading"
      />
      <Textareas :class="{ 'opacity-0': isLoading }" v-model="newComment" />
    </div>
    <div class="flex items-center mt-6 gap-4 justify-end">
      <div class="relative">
        <Skeletor
          width="100%"
          class="h-full rounded-md w-full flex-grow flex absolute top-0 left-0"
          v-if="isLoading"
        />
        <btn
          label="Применить"
          @click="applyComment"
          :class="{ 'opacity-0': isLoading }"
        />
      </div>
      <div class="relative">
        <Skeletor
          width="100%"
          class="h-full rounded-md w-full flex-grow flex absolute top-0 left-0"
          v-if="isLoading"
        />
        <btn
          label="Закрыть"
          variant="outline"
          @click="closeAllModals(router, route)"
          :class="{ 'opacity-0': isLoading }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useModalStore } from "@/store/useModalStore";
import { useLeadsStore } from "@/store/useLeadsStore";
import { useRouter, useRoute } from "vue-router";
import { Skeletor } from "vue-skeletor";
import btn from "@/components/ui/buttons/btn.vue";
import Textareas from "@/components/ui/inputs/Textareas.vue";
import IconBtn from "@/components/ui/buttons/IconBtn.vue";

const { getLeadById, updateLead } = useLeadsStore();
const { closeAllModals } = useModalStore();

const lead = ref<any>(null);
const newComment = ref("");
const isLoading = ref(true);

const route = useRoute();
const router = useRouter();

const applyComment = async () => {
  const text = newComment.value.trim();
  if (!text || !lead.value?.id) return;

  const now = new Date();
  const time = now.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const history = Array.isArray(lead.value.acf?.history)
    ? [...lead.value.acf.history]
    : [];

  history.push({ txt: text, time });

  try {
    await updateLead(lead.value.id, { history });
    newComment.value = "";
    closeAllModals(router, route);
    console.log("✅ Комментарий сохранён");
  } catch (err) {
    console.error("❌ Ошибка при сохранении комментария:", err);
  }
};

watchEffect(async () => {
  const leadIdRaw = route.query.commentary;

  if (!leadIdRaw || Array.isArray(leadIdRaw)) {
    console.warn("Некорректный leadId:", leadIdRaw);
    return;
  }

  const leadId = parseInt(leadIdRaw, 10);
  if (isNaN(leadId)) return;

  try {
    const leadData = await getLeadById(leadId);
    lead.value = leadData;
  } catch (error) {
    console.error(`❌ Ошибка при получении лида #${leadId}:`, error);
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 200);
  }
});
</script>
