<!-- @format -->

<template>
  <section class="auth">
    <div class="auth_main">
      <div class="auth_head">
        <heading title="Вход в систему" size="7" />
        <v-text text="Для входа в систему введите логин и пароль" color="gray" size="2" />
      </div>
      <div class="auth_form">
        <div class="auth_form__inputs">
          <inputs icon="smile" placeholder="Введите логин" v-model="userData.username" />
          <inputsPass
            icon="lock"
            placeholder="Введите пароль"
            v-model="userData.password"
          />
          <defaultBtn name="Войти" @click="inLogin()" />
        </div>
        <v-text
          text="Нажимая на нопку войти, вы соглашаетесь с политикой конфиденциальности"
          color="gray"
          size="3"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import inputs from "@/components/ui/inputs/inputs.vue";
import inputsPass from "@/components/ui/inputs/inputs-pass.vue";
import defaultBtn from "@/components/ui/buttons/default-btn.vue";

import { ref } from "vue";

import { useUsersStore } from "@/store/useUserStore";
import { useRouter } from "vue-router";

const router = useRouter();

const { login } = useUsersStore();

const userData = ref<any>({
  username: "",
  password: "",
});

async function inLogin() {
  await login(userData.value);
  await router.push("/clients?page=1&view=list&count=10");
}
</script>

<style scoped lang="scss">
.auth {
  @include flex-center;
  height: 100vh;
  background-image: url("./assets/img/auth-bg.png");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.auth_main {
  background-color: $bg-color-quaternary;
  box-shadow: 0 0 20px 0 #00000018;
  max-width: 410px;
  padding: 53px 29px;
  border-radius: 15px;
  text-align: center;
}

.auth_form__inputs {
  @include flex-center;
  flex-direction: column;
  gap: 20px;
}

.auth_head {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.auth_form__inputs {
  margin-bottom: 20px;
}
</style>
