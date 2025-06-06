<template>
  <n-card size="small" :hoverable="true">
    <template #header>
      <div class="flex items-center justify-between gap-2">
        <n-ellipsis style="max-width: 240px">
          {{ work.title }}
        </n-ellipsis>
        <n-button
          quaternary
          size="tiny"
          :style="{
            color: currentPriority.color,
            border: `1px solid ${currentPriority.color}`,
          }"
          class="px-1 py-[4px] text-[8px]"
        >
          {{ currentPriority.label }}
        </n-button>
      </div>
    </template>
    <n-row>
      <n-col :span="24" class="my-3">
        <n-progress
          type="line"
          :percentage="progressValue"
          processing
          :show-indicator="false"
        />
      </n-col>
      <n-col :span="24">
        <n-ellipsis expand-trigger="click" line-clamp="2" :tooltip="false">
          {{ work.meta.description }}
        </n-ellipsis>
      </n-col>
    </n-row>
    <n-row>
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
    </n-row>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{
  work: any;
}>();

const progressValue = computed(() => {
  const val = Number(props.work?.meta?.progress ?? 0);
  return isNaN(val) ? 0 : Math.min(Math.max(val, 0), 100);
});

const priorityMap: any = {
  low: {
    label: "Низкий",
    color: "#18a058", // зелёный
  },
  medium: {
    label: "Средний",
    color: "#f0a020", // оранжевый
  },
  high: {
    label: "Высокий",
    color: "#d03050", // красный
  },
};

const currentPriority = computed(() => {
  const val = props.work?.meta?.priority ?? "medium";
  return priorityMap[val] || priorityMap["medium"];
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
  options.map((option: any) => ({
    key: option.name,
    label: option.name,
  }));
}
</script>
