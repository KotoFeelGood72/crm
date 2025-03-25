<!-- @format -->

<template>
  <div class="admin-header">
    <div class="admin__main">
      <div class="row-start">
        <nav>
          <RouterLink class="home-link" to="/"
            ><Icons icon="solar:widget-5-bold" :size="22" />
            <p>Стартовая страница</p></RouterLink
          >
        </nav>
      </div>
      <div class="row-end">
        <IcBtn icon="solar:settings-broken" />
        <IcBtn icon="solar:add-square-broken" @click="openModal('create')" />
        <IcBtn icon="solar:align-bottom-broken" />
        <IcBtn icon="solar:bell-broken" />
        <IcBtn icon="solar:chat-round-unread-broken" />
        <IcBtn icon="solar:remove-folder-broken" />
        <div class="user">
          <div class="user__main" @click="toggleUserModal" v-if="users && users.userInfo">
            <avatar :img="users.userInfo?.acf?.user_img" />
            <p>{{ users.user_display_name }}</p>
          </div>
          <transition>
            <UserModal v-if="userModal" ref="userModalRef" class="user-dropdown" />
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import avatar from "../ui/people/avatar.vue";
import UserModal from "../modal/view/UserModal.vue";
import { useUsersStoreRefs } from "@/store/useUserStore";
import IcBtn from "../ui/buttons/IcBtn.vue";
import { useModalStore } from "@/store/useModalStore";

const userModal = ref<boolean>(false);
const userModalRef = ref<HTMLElement | null>(null);
const { users } = useUsersStoreRefs();
const toggleUserModal = () => {
  userModal.value = !userModal.value;
};

const { openModal } = useModalStore();

onMounted(() => {
  // document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  // document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped lang="scss">
.admin-header {
  padding: 5px 20px;
  height: 65px;
  border-bottom: 1px solid $light;
  @include bp($point_4) {
    @include flex-space;
  }
  .admin__main {
    @include flex-space;
    width: 100%;
    gap: 20px;
    padding: 5px 0;
  }
}

.row-end {
  @include flex-end;
  gap: 10px;
}
.row-start {
  flex-grow: 1;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 13px);
  right: 0;
}

.user {
  position: relative;
  z-index: 20;
}

.home-link {
  display: inline-flex;
  align-items: center;
  justify-content: start;
  gap: 10px;
  text-decoration: none;
  color: $dark;
  background-color: $ulight;
  padding: 5px 15px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: $light;
  }
}

.user__main {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  font-size: 14px;
  user-select: none;
  svg {
    color: $dark !important;
  }
  &:hover {
    background-color: $ulight;
  }
}
</style>
