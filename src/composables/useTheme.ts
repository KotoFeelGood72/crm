import { ref, computed, onMounted } from "vue";
import { darkTheme, type GlobalTheme } from "naive-ui";

const isDark = ref(false);

const theme = computed<GlobalTheme | null>(() => (isDark.value ? darkTheme : null));

const toggleTheme = () => {
  isDark.value = !isDark.value;
  const html = document.documentElement;
  html.classList.toggle("dark", isDark.value);
  html.classList.toggle("light", !isDark.value);
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
};

const initTheme = () => {
  const saved = localStorage.getItem("theme");
  isDark.value = saved === "dark";
  document.documentElement.classList.toggle("dark", isDark.value);
  document.documentElement.classList.toggle("light", !isDark.value);
};

onMounted(() => {
  initTheme();
});

export function useTheme() {
  return {
    isDark,
    theme,
    toggleTheme,
  };
}