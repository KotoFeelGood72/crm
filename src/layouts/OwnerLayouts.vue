<template>
  <n-layout style="height: 100vh">
    <n-layout-header bordered class="z-10 relative">
      <OwnerHeader class="" />
    </n-layout-header>
    <n-layout has-sider position="absolute" class="pt-[64px]">
      <AdminSidebar />
      <n-layout has-sider>
        <n-scrollbar>
          <n-layout-content content-style="padding: 24px 32px;">
            <slot />
          </n-layout-content>
        </n-scrollbar>
      </n-layout>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import AdminSidebar from "@/sidebars/AdminSidebar.vue";
import OwnerHeader from "@/components/ui/header/OwnerHeader.vue";
</script>
