import { createRouter, createWebHistory } from 'vue-router';
import DeGuildSite from '../views/DeGuild.vue';
import RegistrationSite from '../views/RegistrationSite.vue';
import MyTask from '../views/MyTask.vue';
import NoProvider from '../views/NoProvider.vue';
import History from '../views/History.vue';
import store from '../store';

const AdminPage = () => import('../views/Admin.vue');
const Instructions = () => import('../views/Instruction.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DeGuildSite,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    beforeEnter() {
      if (!store.state.User.owner) {
        store.dispatch('User/reset');
      }
    },
  },
  {
    // UserProfile will be rendered inside User's <router-view>
    // when /user/:id/profile is matched
    path: '/admin/instructions',
    name: 'Instructions',
    component: Instructions,
    beforeEnter() {
      if (!store.state.User.owner) {
        store.dispatch('User/reset');
      }
    },
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
