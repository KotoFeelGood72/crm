<template>
  <div class="admin-sidebar">
    <div class="admin_logo">
      <RouterLink to="/">
        <img
          src="http://manager.dynamic-devs-collective.ru/wp-content/uploads/2024/09/logo.svg"
          alt=""
        />
      </RouterLink>
    </div>
    <ul class="nav">
      <li v-for="(link, i) in AdminNav" :key="'admin-nav-item-' + i">
        <router-link :to="link.url">
          <div class="nav-link__icon">
            <Icons :icon="'solar:' + link.icon" />
          </div>
          <p>{{ link.name }}</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { AdminNav } from "@/consts/AdminNav";
</script>

<style scoped lang="scss">
.admin-sidebar {
  min-height: 100vh;
  height: 100%;
  border-right: 1px solid $bg-color-secondary;
  min-width: 270px;
  padding-top: 20px;
  position: sticky;
  top: 0;
  left: 0;
  @include bp($point_4) {
    display: none;
  }
}

.nav {
  list-style: none;
  @include flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  li {
    width: 100%;
    a {
      padding: 14px 20px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      text-decoration: none;
      gap: 15px;
      font-size: 14px;
      color: $dark;
      transition: all 0.3s ease-in-out;
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

.admin_logo {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  margin-bottom: 30px;
  padding: 0 20px;
  p {
    font-size: 20px;
    color: $dark;
  }
}

.nav-link__icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin_logo {
  max-width: 120px;
  @include flex-center;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
