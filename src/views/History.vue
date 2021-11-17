<template>
  <background />
  <connect-wallet />
  <div v-if="user !== null">
    <dialogue-box></dialogue-box>

    <job-history></job-history>
    <profile />

    <div v-if="wallet === true"></div>
    <div v-if="wallet !== true">
      <approve-modal></approve-modal>
      <approve-wallet></approve-wallet>
    </div>
  </div>
  <no-wallet v-if="user === null" />
</template>

<script>
import { useStore } from 'vuex';
import { computed, reactive } from 'vue';
import { useHead } from '@vueuse/head';

import ConnectWallet from '../components/Buttons/ConnectWallet.vue';
import ApproveWallet from '../components/Buttons/ApproveWallet.vue';
import Background from '../components/General/Background.vue';
import NoWallet from '../components/General/NoWallet.vue';
import ApproveModal from '../components/General/Approve.vue';
import DialogueBox from '../components/General/DialogueBox.vue';
import JobHistory from '../components/Display/JobHistory.vue';
import Profile from '../components/Buttons/Profile.vue';
// @ is an alias to /src

export default {
  name: 'HistorySite',
  components: {
    ConnectWallet,
    Background,
    NoWallet,
    ApproveModal,
    ApproveWallet,
    DialogueBox,
    JobHistory,
    Profile,
    // Navigation,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.User.user);
    const wallet = computed(() => store.state.User.approval);
    const siteData = reactive({
      title: 'DeGuild - History',
      description: 'Freelancer platform for everyone',
    });
    useHead({
      title: computed(() => siteData.title),
      meta: [
        {
          name: 'description',
          content: computed(() => siteData.description),
        },
      ],
    });
    // console.log(store.state.User.user);
    // console.log(user);
    return { user, wallet };
  },
};
</script>
