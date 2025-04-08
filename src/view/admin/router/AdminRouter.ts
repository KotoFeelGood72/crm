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
    path: "/deal/",
    name: "deal",
    component: () => import("../deals/DealsPage.vue"),
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
