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
];

export const LeadsRouter = createRouter({
  history: createMemoryHistory(),
  routes,
});
