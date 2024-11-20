import { createMemoryHistory, createRouter } from 'vue-router';

const routes = [
  { 
    path: '/profile/', 
    name: 'profile', 
    component: () => import('../pages/Profile.vue'), 
    meta: {
      layout: 'Admin',
      requiresAuth: true,
    }, 
  }
];

export const ProfileRouter = createRouter({
  history: createMemoryHistory(),
  routes,
});


