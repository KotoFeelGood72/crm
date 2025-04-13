import { createMemoryHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/leads/",
    name: "leads",
    component: () => import("../leads/LeadsPage.vue"),
    meta: {
      layout: "owner",
      requiresAuth: true,
    },
  },
  {
    path: "/deals/",
    name: "deals",
    component: () => import("../deals/DealsPage.vue"),
    meta: {
      layout: "owner",
      requiresAuth: true,
    },
  },
  {
    path: "/managment/",
    name: "Календарь",
    component: () => import("../managment/ManagmentPage.vue"),
    meta: {
      layout: "owner",
      requiresAuth: true,
    },
  },
  {
    path: "/history/",
    name: "history",
    component: () => import("../history/HistoryPage.vue"),
    meta: {
      layout: "owner",
      requiresAuth: true,
    },
  },
];

export const AdminRouter = createRouter({
  history: createMemoryHistory(),
  routes,
});
