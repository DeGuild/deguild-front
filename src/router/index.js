import { createRouter, createWebHistory } from 'vue-router';
import ConnectWallet from '../views/MagicShop.vue';
import Sandbox from '../views/_Sandbox.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ConnectWallet,
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
