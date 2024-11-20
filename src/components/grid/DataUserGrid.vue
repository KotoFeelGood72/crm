<template>
  <div class="data-grid">
    <!-- Фильтры -->
    <div class="filters">
      <Selects
        v-model="filters.role"
        @change="applyFilters"
        placeholder="Выберите роль"
        :options="[
          { id: '', name: 'Select Role' },
          { id: 'Maintainer', name: 'Maintainer' },
          { id: 'Subscriber', name: 'Subscriber' },
          { id: 'Editor', name: 'Editor' },
          { id: 'Author', name: 'Author' },
        ]"
      />
      <Selects
        v-model="filters.role"
        @change="applyFilters"
        placeholder="Выберите роль"
        :options="[
          { id: '', name: 'Select Role' },
          { id: 'Maintainer', name: 'Maintainer' },
          { id: 'Subscriber', name: 'Subscriber' },
          { id: 'Editor', name: 'Editor' },
          { id: 'Author', name: 'Author' },
        ]"
      />

      <select v-model="filters.plan" @change="applyFilters">
        <option value="">Select Plan</option>
        <option value="Enterprise">Enterprise</option>
        <option value="Basic">Basic</option>
        <option value="Team">Team</option>
      </select>

      <select v-model="filters.status" @change="applyFilters">
        <option value="">Select Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <input v-model="filters.search" @input="applyFilters" placeholder="Search User" />
    </div>

    <!-- Таблица данных -->
    <table border="1">
      <thead>
        <tr>
          <th><input type="checkbox" /></th>
          <th>User</th>
          <th>Role</th>
          <th>Plan</th>
          <th>Billing</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.email">
          <td><input type="checkbox" /></td>
          <td>
            <div class="user-info">
              <img :src="user.avatar" alt="Avatar" />
              <div>
                <div>{{ user.name }}</div>
                <div>{{ user.email }}</div>
              </div>
            </div>
          </td>
          <td>{{ user.role }}</td>
          <td>{{ user.plan }}</td>
          <td>{{ user.billing }}</td>
          <td>
            <span
              :class="{
                'status-active': user.status === 'Active',
                'status-inactive': user.status === 'Inactive',
              }"
            >
              {{ user.status }}
            </span>
          </td>
          <td>
            <button @click="viewUser(user)">👁️</button>
            <button @click="deleteUser(user)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import Selects from "../ui/dropdown/Selects.vue";
import { reactive, computed } from "vue";

interface User {
  name: string;
  email: string;
  role: string;
  plan: string;
  billing: string;
  status: string;
  avatar: string;
}

const filters = reactive({
  role: "",
  plan: "",
  status: "",
  search: "",
});

const users = reactive<User[]>([
  {
    name: "Zsazsa McCleverty",
    email: "zmcclevertye@soundcloud.com",
    role: "Maintainer",
    plan: "Enterprise",
    billing: "Auto Debit",
    status: "Active",
    avatar: "https://example.com/avatar1.png",
  },
  {
    name: "Yoko Pottie",
    email: "ypottiec@privacy.gov.au",
    role: "Subscriber",
    plan: "Basic",
    billing: "Auto Debit",
    status: "Inactive",
    avatar: "https://example.com/avatar2.png",
  },
  {
    name: "Wesley Burland",
    email: "wburlandj@uiuc.edu",
    role: "Editor",
    plan: "Team",
    billing: "Auto Debit",
    status: "Inactive",
    avatar: "https://example.com/avatar3.png",
  },
  {
    name: "Vladimir Koschek",
    email: "vkoschek17@abc.net.au",
    role: "Author",
    plan: "Team",
    billing: "Manual - Paypal",
    status: "Active",
    avatar: "https://example.com/avatar4.png",
  },
]);

const filteredUsers = computed(() =>
  users.filter((user) => {
    return (
      (!filters.role || user.role === filters.role) &&
      (!filters.plan || user.plan === filters.plan) &&
      (!filters.status || user.status === filters.status) &&
      (user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()))
    );
  })
);

function applyFilters() {
  // Фильтрация происходит через computed property `filteredUsers`
}

function viewUser(user: User) {
  alert(`Просмотр пользователя: ${user.name}`);
}

function deleteUser(user: User) {
  const index = users.findIndex((u) => u.email === user.email);
  if (index !== -1) {
    users.splice(index, 1);
    alert(`Пользователь ${user.name} удален.`);
  }
}
</script>

<style scoped>
.data-grid {
  width: 100%;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.status-active {
  color: green;
}

.status-inactive {
  color: gray;
}
</style>
