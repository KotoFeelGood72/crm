<template>
  <div
    id="owner-header"
    class="flex items-center justify-between w-full z-40 py-4 sticky top-0"
  >
    <div
      class="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300 w-full"
    >
      <div id="search"></div>
      <div id="owner-action" class="flex items-center gap-5 text-purple-600">
        <IconBtn icon="f7:bell-fill" />
        <IconBtn
          @click="toggleTheme"
          :icon="isDark ? 'solar:sun-bold' : 'solar:moon-bold'"
          id="change-theme"
          :class="isDark ? 'text-white' : 'text-purple-600'"
        />
        <avatar
          img="https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import IconBtn from "../buttons/IconBtn.vue";
import avatar from "../user/avatar.vue";

const isDark = ref(false);

const toggleTheme = () => {
  const html = document.documentElement;

  if (isDark.value) {
    html.classList.remove("dark");
    html.classList.add("light");
    localStorage.setItem("theme", "light");
  } else {
    html.classList.remove("light");
    html.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }

  isDark.value = !isDark.value;
};

onMounted(() => {
  const html = document.documentElement;
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    isDark.value = true;
    html.classList.add("dark");
  } else {
    isDark.value = false;
    html.classList.add("light");
  }
});
</script>
