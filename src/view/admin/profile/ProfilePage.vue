<template>
  <div class="py-7 rounded-lg">
    <n-card class="relative flex items-start justify-start mb-4 py-9">
      <n-row class="flex items-center gap-4">
        <avatar v-model="profile.acf.avatar" class="" />
        <div>
          <n-button strong secondary type="info">
            {{ profile.slug }}
          </n-button>
          <n-h1 class="mt-0"
            >{{ profile.acf.name }} {{ profile.acf.lastname }}</n-h1
          >
        </div>
      </n-row>
    </n-card>
    <n-card>
      <n-tabs type="line" animated>
        <!-- Вкладка настроек аккаунта -->
        <n-tab-pane name="Профиль" tab="Профиль">
          <n-form
            ref="formRef"
            inline
            :model="profile"
            :rules="rules"
            v-if="profile && profile.acf"
          >
            <n-card title="Настройки аккаунта" content-style="padding: 0;">
              <n-card :bordered="false">
                <n-row>
                  <n-form-item
                    label="Имя"
                    path="firstName"
                    class="w-full flex-grow"
                  >
                    <n-input
                      v-model:value="profile.acf.name"
                      placeholder="Введите имя"
                    />
                  </n-form-item>
                  <n-form-item
                    label="Фамилия"
                    path="lastName"
                    class="w-full flex-grow"
                  >
                    <n-input
                      v-model:value="profile.acf.lastname"
                      placeholder="Введите фамилию"
                    />
                  </n-form-item>
                </n-row>
                <n-row>
                  <n-form-item
                    label="E-mail"
                    path="e-mail"
                    class="w-full flex-grow"
                  >
                    <n-input
                      v-model:value="profile.acf['e-mail']"
                      placeholder="Введите e-mail"
                    />
                  </n-form-item>
                  <!-- Другие поля можно добавить при необходимости -->
                </n-row>
                <n-row>
                  <n-form-item
                    label="Адрес"
                    path="address"
                    class="w-full flex-grow"
                  >
                    <n-input
                      v-model:value="profile.acf.address"
                      placeholder="Введите адрес"
                    />
                  </n-form-item>
                </n-row>
                <n-row class="mt-4">
                  <n-button type="success" tertiary @click="handleAccountSave">
                    Сохранить
                  </n-button>
                </n-row>
              </n-card>
            </n-card>
          </n-form>
          <!-- Блок деактивации аккаунта -->
          <n-card title="Деактивация аккаунта" class="mt-6">
            <n-button tertiary type="error" @click="deactivateAccount">
              Деактивировать
            </n-button>
          </n-card>
        </n-tab-pane>
        <!-- Вкладка смены пароля -->
        <n-tab-pane name="Безопасность" tab="Безопасность">
          <n-card title="Сменить пароль">
            <n-form
              ref="passwordFormRef"
              :model="passwordForm"
              :rules="passwordRules"
            >
              <n-form-item label="Новый пароль" path="newPassword">
                <n-input
                  type="password"
                  show-password-on="mousedown"
                  v-model:value="passwordForm.newPassword"
                  placeholder="Введите новый пароль"
                  :maxlength="8"
                />
              </n-form-item>
              <n-form-item label="Повторите пароль" path="confirmPassword">
                <n-input
                  type="password"
                  show-password-on="mousedown"
                  v-model:value="passwordForm.confirmPassword"
                  placeholder="Повторите пароль"
                  :maxlength="8"
                />
              </n-form-item>
              <n-form-item>
                <!-- <n-button type="success" tertiary @click="handlePasswordChange">
                  Сохранить
                </n-button> -->
              </n-form-item>
            </n-form>
          </n-card>
        </n-tab-pane>
        <!-- Дополнительная вкладка -->
        <n-tab-pane name="Уведомления" tab="Уведомления">
          Qilixiang
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
import avatar from "@/components/ui/people/avatar.vue"; // Компонент аватара должен эмитить update:avatar с объектом File
import {
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NRow,
  NAutoComplete,
  NCheckbox,
  NTabs,
  NTabPane,
  NCard,
} from "naive-ui";
import { useProfileStore, useProfileStoreRefs } from "@/store/useProfileStore";

// Из стора импортируем методы. Переименовываем updateAvatar из стора для избежания конфликта имен.
const { getProfile, updateProfile, updatePassword, updateAvatar } =
  useProfileStore();
const { profile } = useProfileStoreRefs();

const rules = ref({
  firstName: { required: false, message: "Имя обязательно", trigger: "blur" },
  lastName: {
    required: false,
    message: "Фамилия обязательна",
    trigger: "blur",
  },
  position: {
    required: false,
    message: "Должность обязательна",
    trigger: "blur",
  },
  address: { required: false, message: "Адрес обязателен", trigger: "blur" },
  timezone: {
    required: false,
    message: "Часовой пояс обязателен",
    trigger: "change",
  },
});

const autoCompleteOptions = ref([
  { label: "example@mail.com", value: "example@mail.com" },
  { label: "user@mail.com", value: "user@mail.com" },
]);

const timezoneOptions = ref([
  { label: "UTC+0", value: "UTC+0" },
  { label: "UTC+1", value: "UTC+1" },
  { label: "UTC+2", value: "UTC+2" },
  { label: "UTC+3", value: "UTC+3" },
]);

const passwordForm = ref({
  newPassword: "",
  confirmPassword: "",
});

const passwordRules = ref({
  newPassword: {
    required: true,
    message: "Новый пароль обязателен",
    trigger: "blur",
  },
  confirmPassword: {
    required: true,
    validator: (rule: any, value: string) => {
      if (value !== passwordForm.value.newPassword) {
        return new Error("Пароли не совпадают");
      }
      return true;
    },
    trigger: "blur",
  },
});

const deactivateAgreed = ref(false);

function handleAccountSave() {
  updateProfile()
    .then((updatedData) => {
      console.log("Профиль обновлен:", updatedData);
    })
    .catch((err) => {
      console.error("Ошибка обновления профиля:", err);
    });
}

// function handlePasswordChange() {
//   passwordFormRef.value.validate((errors: any) => {
//     if (errors) {
//       console.error("Валидация пароля не прошла:", errors);
//     } else {
//       updateProfile({ password: passwordForm.value.newPassword })
//         .then(() => {
//           console.log("Пароль изменен:", passwordForm.value.newPassword);
//         })
//         .catch((err) => {
//           console.error("Ошибка изменения пароля:", err);
//         });
//     }
//   });
// }

function deactivateAccount() {
  if (!deactivateAgreed.value) {
    console.warn("Пользователь не согласился на деактивацию");
    return;
  }
  console.log("Аккаунт деактивирован");
}

// Используем watchEffect для отслеживания изменения значения v-model аватара.
// Если profile.acf.avatar изменился и является объектом File, вызываем метод для загрузки аватара.
watchEffect(() => {
  const avatarValue = profile.value?.acf?.avatar;
  if (avatarValue && avatarValue instanceof File) {
    updateAvatar(avatarValue)
      .then((updatedData) => {
        console.log("Аватар обновлен", updatedData);
      })
      .catch((error) => {
        console.error("Ошибка обновления аватара", error);
      });
  }
});

// При монтировании получаем профиль
onMounted(() => {
  getProfile();
});
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
