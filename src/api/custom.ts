import axios from 'axios';
import { useUsersStore } from '@/store/useUserStore';

const customInstance = axios.create({
  baseURL: 'https://manager.dynamic-devs-collective.ru/wp-json/custom/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

customInstance.interceptors.request.use((config: any) => {
  const userStore = useUsersStore();
  const token = userStore.users.token;

  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

customInstance.interceptors.response.use(
  (response: any) => {
    return response;
  },
  async (error) => {
    const userStore = useUsersStore();

    if (error.response && error.response.status === 401) {
      // Пробуем обновить токен
      try {
        await userStore.refreshToken();
        
        // Повторяем оригинальный запрос с новым токеном
        const originalRequest = error.config;
        const newToken = userStore.users.token;
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return customInstance(originalRequest);
      } catch (refreshError) {
        // Не удалось обновить токен, очищаем данные пользователя
        userStore.clearUser();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default customInstance;