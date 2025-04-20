<template>
  <section id="auth" class="grid grid-cols-2 h-screen">
    <div class="flex items-center justify-center">
      <img
        src="https://sun9-50.userapi.com/impf/c639519/v639519938/3cee4/5fn1ixwQkGY.jpg?size=1280x1280&quality=96&sign=9dd104506d3e4b785fd7f813ff713106&c_uniq_tag=3jIRjBcYAXQNs40sfqng-dFcZCSb8AwEg3ZBRoYqiV4&type=album"
        class="object-cover w-full h-full"
      />
    </div>
    <div class="flex items-center justify-center flex-col p-14">
      <n-spin :spinning="isLoading" size="large" show-overlay>
        <n-card size="large" class="max-w-md">
          <template #header>
            <div>
              <n-h2 class="mb-3">Вход в систему</n-h2>
              <n-text>Для входа в систему введите логин и пароль</n-text>
            </div>
          </template>

          <template #default>
            <div class="flex flex-col gap-3">
              <n-input
                v-model:value="userData.username"
                type="text"
                placeholder="Введите логин"
                :disabled="isLoading"
              />
              <n-input
                v-model:value="userData.password"
                type="password"
                show-password-on="mousedown"
                placeholder="Введите пароль"
                :disabled="isLoading"
              />
              <n-button
                type="success"
                block
                :loading="isLoading"
                @click="inLogin"
              >
                Войти
              </n-button>
              <n-text>
                Нажимая на кнопку «Войти», вы соглашаетесь с политикой
                конфиденциальности
              </n-text>
            </div>
          </template>
        </n-card>
      </n-spin>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUsersStore } from "@/store/useUserStore";
import { useMessage } from "naive-ui";

const router = useRouter();
const { login } = useUsersStore();
const message = useMessage();

const userData = ref({ username: "", password: "" });
const isLoading = ref(false);

async function inLogin() {
  if (!userData.value.username || !userData.value.password) return;
  isLoading.value = true;
  try {
    await login(userData.value);
    message.success("Успешный вход в систему");
    await router.push("/dashboard");
  } catch (err: any) {
    console.error("Ошибка при логине:", err);
    // Показываем ошибку из сервера или универсальное сообщение
    const text = err?.message || "Ошибка авторизации";
    message.error(text);
  } finally {
    isLoading.value = false;
  }
}
</script>
