import { createWebHistory, createRouter } from "vue-router";
import { AdminRouter } from "../view/admin/router/AdminRouter";

const routes = [
  ...AdminRouter.options.routes,
  {
    path: "/login",
    name: "Login",
    component: () => import("../modules/auth/LoginPages.vue"),
    meta: {
      layout: "Empty",
    },
  },
  {
    path: "/sign",
    name: "Sign",
    component: () => import("../modules/auth/SignPages.vue"),
    meta: {
      layout: "Empty",
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const userData = localStorage.getItem("user");
  let isAuthenticated = false; 

  if (userData) {
    try {
      const parsedUser = JSON.parse(userData); 
      isAuthenticated = !!parsedUser?.auth.token;
    } catch (error) {
      console.error("Ошибка при парсинге данных пользователя:", error);
    }
  }

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    next({ path: "/login" }); 
  } else if (to.path === "/login" && isAuthenticated) {
    next({ path: "/" }); 
  } else {
    next(); 
  }
});
