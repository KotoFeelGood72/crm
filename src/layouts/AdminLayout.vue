<!-- @format -->

<template>
  <div class="admin">
    <adminSidebar />
    <div class="main">
      <AdminHeaderVue />
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminHeaderVue from "@/components/header/AdminHeader.vue";
import adminSidebar from "@/components/sidebars/admin-sidebar.vue";
</script>

<style scoped lang="scss">
.main {
  flex-grow: 1;
  min-height: 100%;
  height: 100%;
  width: 85%;
}
.admin {
  @include flex-start;
  align-items: flex-start;
  // &.fixed {
  //   overflow: hidden;
  // }
}
.content {
  min-height: calc(100vh - 70px);
  padding: 20px;
  background-color: $bg;
}
</style>
