import { createRouter, createWebHistory } from 'vue-router';
import DeGuildSite from '../views/DeGuild.vue';
import RegistrationSite from '../views/RegistrationSite.vue';
// import Sandbox from '../views/_Sandbox.vue';
import MyTask from '../views/MyTask.vue';
import NoProvider from '../views/NoProvider.vue';
import History from '../views/History.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DeGuildSite,
  },
  {
    path: '/task',
    name: 'Task',
    component: MyTask,
  },
  {
    path: '/metamask',
    beforeEnter() {
      window.location.href = 'https://metamask.io/download';
    },
  },
  {
    path: '/history',
    name: 'History',
    component: History,
  },
  {
    path: '/no-provider',
    name: 'no-provider',
    component: NoProvider,
  },
  { path: '/register', name: 'registration', component: RegistrationSite },
  // {
  //   path: '/test',
  //   name: 'Sandbox',
  //   component: Sandbox,
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
