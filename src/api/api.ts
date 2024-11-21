import axios from "axios";

// Функция для получения токена из `localStorage`
const getToken = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const parsedUser = JSON.parse(userData);
    return parsedUser?.auth.token || null;
  }
  return null;
};

// Настройка основного API
const api = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_BASE_URL
      : "/api/",
});

// Интерцептор для запросов
const requestInterceptor = (config: any) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Используем токен в формате Bearer
  }
  return config;
};

// Интерцептор для обработки ошибок запросов
const errorInterceptor = (error: any) => Promise.reject(error);

// Применяем интерцепторы на запросы
api.interceptors.request.use(requestInterceptor, errorInterceptor);
// auth.interceptors.request.use(requestInterceptor, errorInterceptor);

// Интерцептор для ответов
const responseInterceptor = (response: any) => response;

// Обработка ошибки 401 для обоих API
const responseErrorInterceptor = (error: any) => {
  if (error.response && error.response.status === 401) {
    // Удаляем данные пользователя из localStorage и перенаправляем на страницу входа
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
  return Promise.reject(error);
};

// Применяем интерцепторы на ответы
api.interceptors.response.use(responseInterceptor, responseErrorInterceptor);
// auth.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export { api };
