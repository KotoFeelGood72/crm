<template>
  <div id="nav" class="">
    <ul>
      <li
        v-for="(item, i) in nav"
        :key="'nav-item' + i"
        class="px-6 py-3 relative flex items-center flex-col"
      >
        <RouterLink
          :to="item.to"
          class="items-center inline-flex w-full gap-4 transition-colors duration-150 hover:text-gray-800 text-gray-500 dark:text-white-500"
          :class="{
            'text-gray-800 font-semibold dark:text-white': route.path === item.to,
            'text-gray-500 dark:text-gray-400': route.path !== item.to,
          }"
        >
          <span
            v-if="route.path === item.to"
            class="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
            aria-hidden="true"
          ></span>
          <Icons
            :icon="item.icon"
            class="items-center flex justify-center"
            :size="20"
            color="inherit"
          />
          <p class="text-sm font-semibold">{{ item.name }}</p>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
defineProps<{
  nav: any;
}>();
</script>

<style scoped lang="scss"></style>
