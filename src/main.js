import { createApp } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faDollarSign,
  faFire,
  faCog,
  faSpinner,
  faHashtag,
  faClock,
  faSearch,
  faStar,
  faUserClock,
  faBalanceScale,
  faPaperclip,
  faEye,
  faPlus,
  faPlusCircle,
  faExclamationCircle,
  faProjectDiagram,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import '@fontsource/poppins';
import '@fontsource/secular-one';
import '@fontsource/roboto';
import 'viewerjs/dist/viewer.css';
import VueSocialSharing from 'vue-social-sharing';
import '@/plugins/firebase';
import { createHead } from '@vueuse/head';

import App from './App.vue';
import router from './router';
import store from './store';

library.add(faFire);
library.add(faProjectDiagram);
library.add(faDollarSign);
library.add(faHashtag);
library.add(faCog);
library.add(faSpinner);
library.add(faClock);
library.add(faSearch);
library.add(faBalanceScale);
library.add(faStar);
library.add(faEye);
library.add(faUserClock);
library.add(faPlus);
library.add(faPlusCircle);
library.add(faExclamationCircle);
library.add(faPaperclip);
const head = createHead();

createApp(App)
  .use(head)
  .use(store)
  .use(router)
  .use(VueSocialSharing)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
