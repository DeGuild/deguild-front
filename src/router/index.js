import { createRouter, createWebHistory } from 'vue-router';
import DeGuildSite from '../views/DeGuild.vue';
import Sandbox from '../views/_Sandbox.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DeGuildSite,
  },
  {
    path: '/test',
    name: 'Sandbox',
    component: Sandbox,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
