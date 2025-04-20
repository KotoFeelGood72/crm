<template>
  <n-card
    size="small"
    content-class="justify-content flex"
    :class="{ 'opacity-50': isDone }"
  >
    <n-row class="flex-grow flex items-center gap-6">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-tag
            quaternary
            round
            size="tiny"
            :style="{ backgroundColor: currentPriority.color }"
            class="w-3 h-3"
          />
        </template>
        {{ currentPriority.label }}
      </n-tooltip>
      <!-- Статус задачи -->
      <n-tag
        round
        size="small"
        :style="{
          color: currentStatus.color,
          border: `1px solid ${currentStatus.color}`,
        }"
      >
        {{ currentStatus.label }}
      </n-tag>
      <n-ellipsis
        line-clamp="1"
        class="w-40"
        :class="{ 'line-through text-gray-400': isDone }"
      >
        {{ work.title }}
      </n-ellipsis>
      <n-col class="w-44 min-w-44">
        <n-progress
          type="line"
          :percentage="progressValue"
          processing
          :show-indicator="false"
        />
      </n-col>
      <n-col class="flex-grow flex items-center">
        <n-ellipsis
          line-clamp="1"
          class="max-w-96"
          :class="{ 'line-through text-gray-400': isDone }"
        >
          {{ work.meta.description }}
        </n-ellipsis>
      </n-col>
      <n-col class="flex items-center justify-center gap-4 flex-grow">
        <n-tag
          :bordered="false"
          round
          type="info"
          size="small"
          :class="{ 'text-gray-400': isDone }"
        >
          {{ formatForDisplay(work.meta.start_date) }}
        </n-tag>
        <n-tag
          :bordered="false"
          round
          type="info"
          size="small"
          :class="{ 'text-gray-400': isDone }"
        >
          {{ formatForDisplay(work.meta.due_date) }}
        </n-tag>
      </n-col>
      <n-col class="flex items-center justify-center gap-4">
        <n-avatar-group :options="userOptions" :size="26" :max="3">
          <template #avatar="{ option: { name, src } }">
            <n-tooltip>
              <template #trigger>
                <n-avatar :src="src" />
              </template>
              {{ name }}
            </n-tooltip>
          </template>
          <template #rest="{ options: restOptions, rest }">
            <n-dropdown
              :options="createDropdownOptions(restOptions)"
              placement="top"
            >
              <n-avatar class="text-[10px]">+{{ rest }}</n-avatar>
            </n-dropdown>
          </template>
        </n-avatar-group>
        <div class="cursor-pointer">
          <Icons icon="humbleicons:dots-vertical" color="inherit" :size="20" />
        </div>
      </n-col>
    </n-row>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatForDisplay } from "@/utils/formatDateAndTime";
const props = defineProps<{ work: any }>();

// Статусы на русском и соответствующий цвет
const statusMap: Record<string, { label: string; color: string }> = {
  todo: { label: "Ожидает", color: "#6b7280" }, // gray-500
  in_progress: { label: "В работе", color: "#3b82f6" }, // blue-500
  paused: { label: "Пауза", color: "#f59e0b" }, // amber-500
  done: { label: "Завершено", color: "#10b981" }, // emerald-500
};

const isDone = computed(() => props.work?.meta?.status === "done");

const progressValue = computed(() => {
  const val = Number(props.work?.meta?.progress ?? 0);
  return isNaN(val) ? 0 : Math.min(Math.max(val, 0), 100);
});

const priorityMap: Record<string, { label: string; color: string }> = {
  low: { label: "Низкий", color: "#18a058" },
  medium: { label: "Средний", color: "#f0a020" },
  high: { label: "Высокий", color: "#d03050" },
};

const currentPriority = computed(() => {
  const val = props.work?.meta?.priority ?? "medium";
  return priorityMap[val] || priorityMap["medium"];
});

const currentStatus = computed(() => {
  const key = props.work?.meta?.status;
  return statusMap[key] || { label: key || "", color: "#6b7280" };
});

const userOptions = computed(() => {
  const rawUsers = props.work?.meta?.users;
  const users = Array.isArray(rawUsers) ? rawUsers : [];
  return users.map((user: any) => ({
    name:
      `${user.acf?.name || ""} ${user.acf?.lastname || ""}`.trim() ||
      user.display_name ||
      user.user_login ||
      `User ${user.ID}`,
    src: user.acf?.avatar?.url || null,
  }));
});

function createDropdownOptions(options: any) {
  return options.map((option: any) => ({
    key: option.name,
    label: option.name,
  }));
}
</script>
