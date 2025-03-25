<template>
  <form @submit.prevent="handleCreateClient" class="create-client-form">
    <div>
      <label>Имя:</label>
      <input v-model="form.name" type="text" required />
    </div>

    <div>
      <label>Город:</label>
      <select v-model="form.city">
        <option v-for="city in clientStore.cities" :key="city.id" :value="city.id">
          {{ city.name }}
        </option>
      </select>
    </div>

    <div>
      <label>Телефон:</label>
      <input v-model="form.phones" type="text" required />
    </div>

    <div>
      <label>Сайт:</label>
      <input v-model="form.websites" type="text" />
    </div>

    <div>
      <label>Email:</label>
      <input v-model="form.email" type="email" />
    </div>

    <div>
      <label>Категория:</label>
      <select v-model="form.category">
        <option v-for="cat in clientStore.categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <div>
      <label>Статус:</label>
      <select v-model="form.status">
        <option
          v-for="status in clientStore.statuses"
          :key="status.id"
          :value="status.id"
        >
          {{ status.name }}
        </option>
      </select>
    </div>

    <div>
      <label>Комментарий:</label>
      <textarea v-model="form.note" rows="3"></textarea>
    </div>

    <div>
      <label>Дата обратного звонка:</label>
      <input v-model="form.callback" type="date" />
    </div>

    <button type="submit">Создать клиента</button>
  </form>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useClientStore } from "@/store/useClientStore";

const clientStore = useClientStore();

const form = reactive<any>({
  name: "",
  city: "",
  phones: "",
  websites: "",
  category: "",
  status: "Новый",
  callback: "",
  email: "",
  note: "",
});

const handleCreateClient = async () => {
  try {
    await clientStore.createClient(form);
    alert("Клиент успешно создан");
    Object.keys(form).forEach((key) => (form[key] = "")); // сброс формы
  } catch (err) {
    alert("Ошибка при создании клиента");
  }
};
</script>

<style scoped>
.create-client-form {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(45%, 1fr));
  gap: 1rem;
  max-width: 800px;
  background-color: #fff;
  padding: 30px;
}
.create-client-form input,
.create-client-form select,
.create-client-form textarea {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
</style>
