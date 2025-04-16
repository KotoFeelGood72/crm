<template>
  <div
    class="avatar-uploader relative"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <n-avatar :size="130" :src="previewUrl.url" @click="openFilePicker" />
    <input
      type="file"
      ref="fileInput"
      @change="onFileChange"
      accept="image/*"
      class="hidden"
    />
    <!-- Кнопки отображаются только при наведении -->
    <div
      v-show="isHovered"
      class="backdrop-blur-sm absolute bottom-0 left-[50%] -translate-x-[50%] w-full flex items-center justify-center space-x-2 bg-[#000000be] h-full"
    >
      <n-button tertiary circle @click="deleteAvatar">
        <template #icon>
          <Icons icon="material-symbols-light:delete-outline" color="inherit" />
        </template>
      </n-button>
      <n-button tertiary circle @click="openFilePicker">
        <template #icon>
          <Icons icon="lucide:edit" color="inherit" />
        </template>
      </n-button>
      <n-button tertiary circle @click="showModal = true">
        <template #icon>
          <Icons icon="solar:eye-linear" color="inherit" />
        </template>
      </n-button>
    </div>
    <n-modal
      v-model:show="showModal"
      preset="card"
      style="width: 600px"
      title="A Cool Picture"
    >
      <img :src="previewUrl.url" style="width: 100%" />
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, defineExpose } from "vue";

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits(["update:modelValue"]);

const showModal = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const isHovered = ref(false);

/**
 * Вычисляемое свойство для предпросмотра.
 * Если modelValue является объектом File, создаётся временный URL,
 * иначе возвращается modelValue как есть.
 */
const previewUrl = computed(() => {
  if (props.modelValue instanceof File) {
    return URL.createObjectURL(props.modelValue);
  }
  return props.modelValue || "https://via.placeholder.com/150";
});

/**
 * Открывает скрытый инпут для выбора файла.
 */
function openFilePicker() {
  fileInput.value?.click();
}

/**
 * Обрабатывает выбор файла.
 * Эмиттит событие update:modelValue, передавая выбранный объект File.
 */
function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    emit("update:modelValue", file);
  }
}

function deleteAvatar() {
  // Очищаем значение инпута (если требуется)
  if (fileInput.value) {
    fileInput.value.value = "";
  }
  // Эмиттим пустое значение
  emit("update:modelValue", "");
}
</script>
