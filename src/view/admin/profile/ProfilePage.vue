<template>
  <n-card>
    <n-tabs type="segment" animated>
      <!-- Вкладка настроек аккаунта -->
      <n-tab-pane name="oasis" tab="Oasis">
        <!-- Оборачиваем настройки аккаунта в форму -->
        <n-form ref="formRef" inline :model="formValue" :rules="rules">
          <n-card title="Настройки аккаунта">
            <!-- Блок аватара и загрузки -->
            <n-card :bordered="false">
              <div>
                <!-- Используем реактивное значение avatarUrl -->
                <img
                  :src="avatarUrl"
                  alt="Avatar"
                  style="width: 150px; height: 150px; object-fit: cover"
                />
              </div>
              <div>
                <n-row>
                  <n-upload
                    action="#"
                    :show-file-list="false"
                    :change="handleUploadSuccess"
                  >
                    <n-button>Upload File</n-button>
                  </n-upload>

                  <n-button tertiary type="error" @click="clearAvatar">
                    Очистить
                  </n-button>
                </n-row>
              </div>
            </n-card>
            <n-divider />
            <!-- Основные поля -->
            <n-card :bordered="false">
              <n-row>
                <n-form-item label="Имя" path="firstName">
                  <n-input
                    v-model:value="formValue.firstName"
                    placeholder="Введите имя"
                  />
                </n-form-item>
                <n-form-item label="Фамилия" path="lastName">
                  <n-input
                    v-model:value="formValue.lastName"
                    placeholder="Введите фамилию"
                  />
                </n-form-item>
              </n-row>
              <n-row>
                <n-form-item label="E-mail" path="email">
                  <n-auto-complete
                    v-model:value="formValue.email"
                    :options="autoCompleteOptions"
                    placeholder="Введите e-mail"
                  />
                </n-form-item>
                <n-form-item label="Должность" path="position">
                  <n-input
                    v-model:value="formValue.position"
                    placeholder="Введите должность"
                  />
                </n-form-item>
              </n-row>
              <n-row>
                <n-form-item label="Адрес" path="address">
                  <n-input
                    v-model:value="formValue.address"
                    placeholder="Введите адрес"
                  />
                </n-form-item>
                <n-form-item label="Часовой пояс" path="timezone">
                  <n-select
                    v-model:value="formValue.timezone"
                    :options="timezoneOptions"
                    placeholder="Выберите часовой пояс"
                  />
                </n-form-item>
              </n-row>
              <n-row class="mt-4">
                <n-button type="success" tertiary @click="handleAccountSave">
                  Сохранить
                </n-button>
                <n-button type="error" tertiary @click="resetAccountForm">
                  Очистить
                </n-button>
              </n-row>
            </n-card>
          </n-card>
        </n-form>

        <!-- Блок деактивации аккаунта -->
        <n-card title="Деактивировать аккаунт" class="mt-6">
          <n-checkbox
            v-model:value="deactivateAgreed"
            value="deactivate"
            label="Я согласен на деактивацию своего аккаунта"
          />
          <n-button tertiary type="error" @click="deactivateAccount">
            Деактивировать
          </n-button>
        </n-card>
      </n-tab-pane>

      <!-- Вкладка смены пароля -->
      <n-tab-pane name="Безопасность" tab="Безопасность">
        <n-card title="Сменить пароль">
          <n-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules">
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
              <n-button type="success" tertiary @click="handlePasswordChange">
                Сохранить
              </n-button>
            </n-form-item>
          </n-form>
        </n-card>
      </n-tab-pane>

      <!-- Дополнительная вкладка (например, "Уведомления") -->
      <n-tab-pane name="Уведомления" tab="Уведомления"> Qilixiang </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import {
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NDivider,
  NRow,
  NUpload,
  NAutoComplete,
} from "naive-ui";
import { useProfileStore, useProfileStoreRefs } from "@/store/useProfileStore";

const formRef = ref(null);
const passwordFormRef = ref(null);

const profileStore = useProfileStore();
const { profile } = useProfileStoreRefs();

// Задаем дефолтное изображение аватара
const avatarUrl = ref("https://via.placeholder.com/150");

const formValue = ref({
  firstName: "",
  lastName: "",
  email: "",
  position: "",
  address: "",
  timezone: "",
});

// Если ACF поля профиля нужны, можно их сохранить в formValue.acf
// Например, если у вас есть поле "phone", "company", итд.

const rules = ref({
  firstName: {
    required: true,
    message: "Имя обязательно",
    trigger: "blur",
  },
  lastName: {
    required: true,
    message: "Фамилия обязательна",
    trigger: "blur",
  },
  email: {
    required: true,
    message: "E-mail обязателен",
    trigger: "blur",
  },
  position: {
    required: true,
    message: "Должность обязательна",
    trigger: "blur",
  },
  address: {
    required: true,
    message: "Адрес обязателен",
    trigger: "blur",
  },
  timezone: {
    required: true,
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

// Форма смены пароля:
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

// Для деактивации аккаунта:
const deactivateAgreed = ref(false);

function handleAccountSave() {
  formRef.value.validate((errors: any) => {
    if (errors) {
      console.error("Валидация не прошла:", errors);
    } else {
      // Вызываем метод обновления профиля из ProfileStore
      profileStore
        .updateProfile(formValue.value)
        .then(() => {
          console.log("Данные аккаунта сохранены:", formValue.value);
        })
        .catch((err) => {
          console.error("Ошибка сохранения профиля:", err);
        });
    }
  });
}

function resetAccountForm() {
  formRef.value.resetFields();
}

function handlePasswordChange() {
  passwordFormRef.value.validate((errors: any) => {
    if (errors) {
      console.error("Валидация пароля не прошла:", errors);
    } else {
      profileStore
        .updateProfile({ password: passwordForm.value.newPassword })
        .then(() => {
          console.log("Пароль изменен:", passwordForm.value.newPassword);
        })
        .catch((err) => {
          console.error("Ошибка изменения пароля:", err);
        });
    }
  });
}

function clearAvatar() {
  avatarUrl.value = "https://via.placeholder.com/150";
  console.log("Аватар очищен");
}

function deactivateAccount() {
  if (!deactivateAgreed.value) {
    console.warn("Пользователь не согласился на деактивацию");
    return;
  }
  // Здесь можно вызвать метод деактивации профиля, если он реализован
  console.log("Аккаунт деактивирован");
}

// Допустим, при успешной загрузке файла сервер возвращает URL изображения в поле res.url
function handleUploadSuccess(res: any, file: any) {
  if (res?.url) {
    avatarUrl.value = res.url;
    
  } else if (file.url) {
    avatarUrl.value = file.url;
  } else {
    console.warn("Не удалось определить URL аватара");
  }
}

// При монтировании получаем профиль
onMounted(() => {
  profileStore.getProfile().then(() => {
    if (profile.value) {
      // Заполняем поля формы данными профиля
      formValue.value.firstName = profile.value.first_name || "";
      formValue.value.lastName = profile.value.last_name || "";
      formValue.value.email = profile.value.user_email || "";
      formValue.value.position = profile.value.acf?.position || "";
      formValue.value.address = profile.value.acf?.address || "";
      formValue.value.timezone = profile.value.acf?.timezone || "";
      // Если аватар передается в ACF, например, profile.value.acf.avatar
      avatarUrl.value = profile.value.acf?.avatar || avatarUrl.value;
    }
  });
});
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
