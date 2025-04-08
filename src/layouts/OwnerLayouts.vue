<template>
  <div id="owner" class="flex items-start justify-between h-full w-full">
    <AdminSidebar class="w-[15%]" />
    <div class="flex items-center justify-between flex-col w-[85%]">
      <OwnerHeader class="light:bg-white dark:bg-gray-800" />
      <div id="content" class="light:bg-white dark:bg-gray-900 w-full min-h-[100dvh]">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from "@/sidebars/AdminSidebar.vue";
import OwnerHeader from "@/components/ui/header/OwnerHeader.vue";
</script>
