<template>
  <Transition name="fade-modal">
    <div
      class="modal"
      v-if="activeModalComponent"
      :class="['modal_postionY__' + positionY, 'modal_postionX__' + positionX]"
    >
      <div class="modal__bg" @click="closeCurrentModal"></div>
      <div class="modal_main__w">
        <div class="modal_main">
          <CloseModal v-if="isCloseModalBtn" @click="closeCurrentModal()" />
          <component :is="activeModalComponent" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import CloseModal from "../ui/buttons/CloseModal.vue";
import { computed, defineAsyncComponent } from "vue";
import { useModalStore, useModalStoreRefs } from "@/store/useModalStore";
import { useRouter } from "vue-router";
const AsyncModalSingleData = defineAsyncComponent(
  () => import("./view/ModalSingleData.vue")
);
const AsyncModalDeal = defineAsyncComponent(
  () => import("./view/ModalDeal.vue")
);

const AsyncModalSingleQR = defineAsyncComponent(
  () => import("./view/SingleQR.vue")
);
const AsyncModalUser = defineAsyncComponent(
  () => import("./view/UserModal.vue")
);
const AsyncModalCreate = defineAsyncComponent(
  () => import("./view/ModalCreate.vue")
);
const AsyncModalFilter = defineAsyncComponent(
  () => import("./view/ModalFilter.vue")
);
const AsyncModalNote = defineAsyncComponent(
  () => import("./view/NotificationModal.vue")
);
const AsyncModalComment = defineAsyncComponent(
  () => import("./view/ModalComment.vue")
);

withDefaults(
  defineProps<{
    positionY?: "center" | "right" | "left";
    positionX?: "center" | "right" | "left";
  }>(),
  {
    positionY: "center",
    positionX: "center",
  }
);

const { modals } = useModalStoreRefs();
const router = useRouter();
const { closeModal } = useModalStore();
type ModalKey = keyof typeof modals.value;

const activeModalComponent = computed(() => {
  for (const [key, isActive] of Object.entries(modals.value)) {
    if (isActive) {
      switch (key) {
        case "client":
          return AsyncModalSingleData;
        case "note":
          return AsyncModalNote;
        case "qr":
          return AsyncModalSingleQR;
        case "user":
          return AsyncModalUser;
        case "create":
          return AsyncModalCreate;
        case "filter":
          return AsyncModalFilter;
        case "comment":
          return AsyncModalComment;
        case "deal":
          return AsyncModalDeal;
        default:
          return null;
      }
    }
  }
  return null;
});

const isCloseModalBtn = computed(() => {
  switch (activeModalName.value) {
    case "client":
      return true;
    case "comment":
      return true;
    case "qr":
      return true;
    case "user":
      return true;
    case "filter":
      return true;
    default:
      return false;
  }
});

const activeModalName = computed(() => {
  for (const name in modals.value) {
    if (modals.value[name as ModalKey]) {
      return name as ModalKey;
    }
  }
  return null;
});

const closeCurrentModal = () => {
  const modalName: any = activeModalName.value;
  if (modalName) {
    closeModal(modalName, router);
  }
};
</script>

<style scoped lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 101;

  .modal_postionY__center {
    @include flex-center;
  }
  .modal_postionX__center {
    @include flex-center;
  }

  &.modal_postionX__right {
    .modal_main__w {
      @include flex-end;
    }
    .close-modal {
      right: auto;
      left: -60px;
      transform: translateY(-50%);
      top: 50%;
      @include bp($point_4) {
        left: 20px;
        top: 20px;
        transform: translateY(0);
        z-index: 99;

        background-color: $bg-color-secondary;
      }
    }
  }
}

.modal_main__w {
  position: relative;
  width: 100%;
  height: 100%;
  @include flex-center;
  pointer-events: none;
}

.modal_main {
  position: relative;
  pointer-events: all;
  @include bp($point_4) {
    width: 100%;
  }
}

.close-modal {
  position: absolute;
  top: -40px;
  right: -40px;
  @include bp($point_4) {
    display: none;
  }
}

.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-modal-enter-to,
.fade-modal-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
