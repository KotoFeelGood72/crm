import { createMemoryHistory, createRouter } from 'vue-router';

const routes = [
  { 
    path: '/clients/', 
    name: 'clients', 
    component: () => import('../pages/Companies.vue'), 
    meta: {
      layout: 'Admin',
      requiresAuth: true,
    }, 
  }
];

export const CompaniesRouter = createRouter({
  history: createMemoryHistory(),
  routes,
});


