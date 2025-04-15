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
                <!-- Здесь можно вставить изображение аватара -->
                <img src="https://via.placeholder.com/150" alt="Avatar" />
              </div>
              <div>
                <n-row>
                  <n-upload
                    action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
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
              <n-button type="success" tertiary @click="handlePasswordChange">
                Сохранить
              </n-button>
            </n-form-item>
          </n-form>
        </n-card>
      </n-tab-pane>

      <!-- Дополнительная вкладка (например, "Jay Chou") -->
      <n-tab-pane name="Уведомления" tab="Уведомления"> Qilixiang </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
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

const formRef = ref(null);
const passwordFormRef = ref(null);

const formValue = ref({
  firstName: "",
  lastName: "",
  email: "",
  position: "",
  address: "",
  timezone: "",
});

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

// Для смены пароля:
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
      // Отправьте данные formValue на сервер
      console.log("Данные аккаунта сохранены:", formValue.value);
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
      // Отправьте данные passwordForm на сервер
      console.log("Пароль изменен:", passwordForm.value.newPassword);
    }
  });
}

function clearAvatar() {
  // Реализуйте очистку аватара, если это необходимо
  console.log("Аватар очищен");
}

function deactivateAccount() {
  if (!deactivateAgreed.value) {
    console.warn("Пользователь не согласился на деактивацию");
    return;
  }
  // Отправьте запрос на деактивацию аккаунта
  console.log("Аккаунт деактивирован");
}
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
