import { ref, computed, onMounted } from "vue";
import { darkTheme, type GlobalTheme } from "naive-ui";

const isDark = ref(false);

const theme = computed<GlobalTheme | null>(() => {
  return isDark.value ? darkTheme : null;
});

/**
 * Переключение темы:
 * 1. Меняем флаг isDark.
 * 2. Записываем новое значение в localStorage.
 */
const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
};

/**
 * Инициализация темы:
 * 1. Считываем сохранённое значение из localStorage.
 * 2. Устанавливаем флаг isDark.
 */
const initTheme = () => {
  const saved = localStorage.getItem("theme");
  isDark.value = saved === "dark";
};

export function useTheme() {
  onMounted(() => {
    console.log("saved");
    initTheme();
  });
  return {
    isDark,
    theme,
    toggleTheme,
  };
}
