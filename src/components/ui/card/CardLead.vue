<template>
  <div
    id="card-lead"
    class="min-w-0 rounded-lg shadow-xs overflow-hidden light:bg-white dark:bg-gray-800 py-4 pl-14 pr-4 flex flex-col relative"
  >
    <StatusChip :status="lead.acf.status" />
    <ul class="dark:text-gray-400 grid grid-cols-2 gap-2 text-xs mb-4">
      <li class="flex items-center gap-3">
        <p>Организация:</p>
        <span>{{ lead.acf.name }}</span>
      </li>
      <li class="flex items-center gap-3">
        <p>Город:</p>
        <span>{{ lead.acf.city }}</span>
      </li>
      <li class="flex items-center gap-3">
        <p>Телефон:</p>
        <span v-for="item in lead.acf.phone_list" :key="item">{{
          formatPhone(item.item)
        }}</span>
      </li>
      <li class="flex items-center gap-3">
        <p>What`s App:</p>
        <span v-for="item in lead.acf.whatsapps_list" :key="item">{{ item.item }}</span>
      </li>
      <li class="flex items-center gap-3">
        <p>Telegram:</p>
        <span v-for="item in lead.acf.telegrams_list" :key="item">{{ item.item }}</span>
      </li>
    </ul>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <btn
          label="Сменить статус"
          icon="pajamas:status-health"
          iconPosition="left"
          variant="primary"
          size="sm"
          iconColor="text-white"
          @click="openModal('status', {}, { status: lead.id }, router)"
        />
      </div>

      <div class="flex items-center gap-3">
        <div class="relative">
          <div
            v-if="lead.acf.history && lead.acf.history.length > 0"
            class="absolute -top-1.5 -right-1.5 text-[10px] font-bold bg-red-500 rounded-full w-4 h-4 flex items-center justify-center"
          >
            {{ lead.acf.history.length }}
          </div>
          <IconBtn
            icon="hugeicons:comment-01"
            class="dark:text-gray-400"
            @click="openModal('commentary', {}, { commentary: lead.id }, router)"
          />
        </div>
        <IconBtn
          icon="material-symbols-light:delete-outline"
          class="dark:text-red-600 w-7 h-7 flex items-center justify-center"
          iconSize="30"
          @click="emit('deleteLead', lead.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconBtn from "../buttons/IconBtn.vue";
import btn from "../buttons/btn.vue";
import StatusChip from "../other/StatusChip.vue";
import { useModalStore } from "@/store/useModalStore";
import { useRouter } from "vue-router";
import { defineEmits } from "vue";
defineProps<{
  lead: any;
}>();

const emit = defineEmits<{
  (e: "deleteLead", id: number): void;
}>();

const router = useRouter();
const { openModal } = useModalStore();

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
</script>

<style scoped lang="scss"></style>
