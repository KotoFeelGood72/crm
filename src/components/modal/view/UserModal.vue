<template>
  <div
    class="user_dropdown"
    v-if="users && users.userInfo && users.userInfo.acf"
  >
    <div class="user_dropdown__top">
      <div class="user_top__left">
        <avatar
          v-if="users && users.userInfo"
          :img="users.userInfo?.acf?.user_img"
        />
        <div class="user_dropdown__topname">
          <p>{{ users.userInfo.acf.user_name }}</p>
          <p>{{ users.userInfo.acf.user_professional }}</p>
        </div>
      </div>
      <div class="user_top__right">
        <div class="user_logout" @click="logout">
          <Icons icon="solar:logout-broken" />
        </div>
      </div>
    </div>
    <div class="user_dropdown__body">
      <ul>
        <li>
          <RouterLink to="/">
            <Icons icon="solar:gallery-edit-bold" :size="20" />
            <p>Редактировать профиль</p>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/">
            <Icons icon="solar:library-bold" :size="20" />
            <p>Мои проекты</p>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/">
            <Icons icon="solar:letter-bold" :size="20" />
            <p>Получили КП</p>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/">
            <Icons icon="solar:settings-minimalistic-bold" :size="20" />
            <p>Настройки</p>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUsersStore, useUsersStoreRefs } from "@/store/useUserStore";
import avatar from "@/components/ui/people/avatar.vue";
import { useRouter } from "vue-router";
const { users } = useUsersStoreRefs();
const { clearUser } = useUsersStore();

const router = useRouter();

async function logout() {
  await clearUser();
  await router.push("/login");
}
</script>

<style scoped lang="scss">
.user_dropdown {
  background-color: $white;
  min-width: 300px;
  box-shadow: 0 0 20px 0 #9e9d9d22;
}

.user_dropdown__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 10px 20px 10px;
  border-bottom: 1px solid $light;
}

.user_top__left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  font-size: 14px;
  color: $dark;
  p {
    line-height: 130%;
  }
}

.user_logout {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  width: 30px;
  height: 30px;
  border-radius: 3px;
  &:hover {
    background-color: $ulight;
    svg {
      color: $blue !important;
    }
  }
}

.user_dropdown__body {
  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  li {
    a {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 15px 20px;
      transition: all 0.3s ease-in-out;
      text-decoration: none;
      color: $dark;
      gap: 10px;
      font-size: 14px;
      svg {
        color: $dark !important;
      }
      &:hover {
        background-color: $ulight;
      }
      &.router-link-exact-active {
        background-color: $light-blue;
        color: $blue;
        border-right: 2px solid $blue;
        svg {
          color: $blue !important;
        }
      }
    }
  }
}
</style>
