import { createMemoryHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../dashboard/DashboardPage.vue"),
    meta: {
      layout: "owner",
      requiresAuth: true,
    },
  },
  {
    path: "/analytics",
    name: "Статистика",
    component: () => import("../analytics/AnalyticsPage.vue"),
    meta: {
      layout: "owner",
      requiresAuth: true,
    },
  },
  {
    path: "/leads/",
    name: "leads",
    component: () => import("../leads/LeadsPage.vue"),
    meta: {
      layout: "owner",
      requiresAuth: true,
    },
    children: [
      {
        name: 'my-leads',
        path: 'my',
        component: () => import('../leads/LeadsPageMy.vue')
      },
      {
        name: 'all-leads',
        path: 'all',
        component: () => import('../leads/LeadsPageAll.vue')
      }
    ],
  },
  {
    path: "/profile/:id",
    name: "profile",
    component: () => import("../profile/ProfilePage.vue"),
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
    path: "/works/",
    name: "works",
    component: () => import("../works/WorksPage.vue"),
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
    children: [
      {
        name: 'my-history',
        path: 'my',
        component: () => import('../history/HistoryPageMy.vue')
      },
      {
        name: 'all-history',
        path: 'all',
        component: () => import('../history/HistoryPageAll.vue')
      }
    ],
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
