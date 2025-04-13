<template>
  <n-card :title="lead.acf.name" hoverable>
    <div id="card-lead" class="relative">
      <!-- <StatusChip :status="lead.acf.status" /> -->
      <ul class="dark:text-gray-400 grid grid-cols-2 gap-2 text-xs mb-4">
        <!-- <li class="flex items-center gap-3">
          <p>Организация:</p>
          <span>{{ lead.acf.name }}</span>
        </li> -->
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
          <span v-for="item in lead.acf.whatsapps_list" :key="item">{{
            item.item
          }}</span>
        </li>
        <li class="flex items-center gap-3">
          <p>Telegram:</p>
          <span v-for="item in lead.acf.telegrams_list" :key="item">{{
            item.item
          }}</span>
        </li>
      </ul>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <!-- <btn
            label="Сменить статус"
            icon="pajamas:status-health"
            iconPosition="left"
            variant="primary"
            size="sm"
            iconColor="text-white"
            @click="openModal('status', {}, { status: lead.id }, router)"
          /> -->
          <n-dropdown :options="statusList" @select="handleStatusChange">
            <n-button>{{ lead.acf.status }}</n-button>
          </n-dropdown>
        </div>

        <div class="flex items-center gap-3">
          <div class="relative">
            <n-float-button position="relative" menu-trigger="hover">
              <n-badge :value="lead.acf.history.length" :offset="[6, -8]">
                <Icons icon="hugeicons:comment-01" :size="16" />
              </n-badge>
              <template #menu>
                <n-float-button shape="square" type="primary">
                  <n-icon>
                    <Icons
                      icon="material-symbols-light:history"
                      :size="20"
                      @click="showModalComment = true"
                    />
                  </n-icon>
                </n-float-button>
                <n-float-button @click="showModal = true">
                  <n-icon>
                    <Icons icon="hugeicons:comment-01" :size="16" />
                  </n-icon>
                </n-float-button>
              </template>
            </n-float-button>
            <n-drawer
              v-model:show="showModalComment"
              :width="502"
              :placement="'left'"
            >
              <n-drawer-content title="Коментарии">
                <!-- @load="handleLoad" -->
                <n-infinite-scroll :distance="10">
                  <div class="flex flex-col gap-2">
                    <div v-for="(comment, i) in lead.acf.history" :key="i">
                      <n-card>
                        <p>{{ comment.txt }}</p>
                        <div class="text-[10px] opacity-70 text-right">
                          {{ comment.time }}
                        </div>
                      </n-card>
                    </div>
                  </div>
                </n-infinite-scroll>
              </n-drawer-content>
            </n-drawer>
            <n-modal v-model:show="showModal" preset="dialog" title="Оставить">
              <template #header>
                <div>Оставить коментарий</div>
              </template>
              <div class="py-4">
                <n-input
                  v-model:value="newComment"
                  placeholder="Введите коментарий"
                  type="textarea"
                  :autosize="{
                    minRows: 3,
                    maxRows: 5,
                  }"
                />
              </div>

              <template #action>
                <div style="display: flex; justify-content: flex-end">
                  <n-button
                    round
                    type="primary"
                    @click="applyComment"
                    :loading="isSending"
                  >
                    Отправить
                  </n-button>
                </div>
              </template>
            </n-modal>
          </div>

          <n-popconfirm
            @positive-click="handlePositiveClick"
            @negative-click="handleNegativeClick"
            negative-text="Нет"
            positive-text="ДА"
          >
            <template #trigger>
              <!-- <n-button>Quote</n-button> -->

              <IconBtn
                icon="material-symbols-light:delete-outline"
                class="dark:text-red-600 w-7 h-7 flex items-center justify-center"
                iconSize="30"
                @click="emit('deleteLead', lead.id)"
              />
            </template>
            Подтвердить удаление?
          </n-popconfirm>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import IconBtn from "../buttons/IconBtn.vue";
// import btn from "../buttons/btn.vue";
// import StatusChip from "../other/StatusChip.vue";
import { statusList } from "@/api/data";
import { useModalStore } from "@/store/useModalStore";
import { useLeadsStore } from "@/store/useLeadsStore";
import { useRouter } from "vue-router";
import { defineEmits, ref } from "vue";
import { useLeadComment } from "@/composables/useLeadComment";
import { useUsersStoreRefs } from "@/store/useUserStore";

const { users } = useUsersStoreRefs();
const active = ref<any>(false);
const showModal = ref<any>(false);
const showModalComment = ref<any>(false);
const comment = ref<any>("");
const { sendLeadComment, isSending, newComment } = useLeadComment();
const userId = users.value.userInfo?.id;
const activate = () => {
  active.value = true;
};
const props = defineProps<{
  lead: any;
}>();

const emit = defineEmits<{
  (e: "deleteLead", id: number): void;
}>();
const selectedStatus = ref(props.lead.acf.status);
const { updateLead, deleteLead } = useLeadsStore();

const handlePositiveClick = () => {
  // emit("deleteLead", props.lead.id);
  deleteLead(props.lead.id);
};

const handleNegativeClick = () => {
  console.log("Good");
};

const handleStatusChange = async (status: string) => {
  selectedStatus.value = status;
  await updateLead(props.lead.id, { status }); // если API требует "status"
  // props.lead.acf.status = status; // обновляем локально, чтобы UI не дёргался
};

const router = useRouter();
const { openModal } = useModalStore();

const applyComment = async () => {
  if (!props.lead?.id) return;

  const success = await sendLeadComment(
    props.lead.id,
    props.lead.acf?.history || []
  );

  if (success) {
    newComment.value = "";
    showModal.value = false;
  }
};

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
