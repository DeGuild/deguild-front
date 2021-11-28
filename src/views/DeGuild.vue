<template>
  <background v-if="!overlay" />

  <div v-if="user !== null">
    <profile />

    <job-dashboard></job-dashboard>
    <add-job v-if="!overlay" />

    <dialogue-box></dialogue-box>

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
import ApproveWallet from '../components/Buttons/ApproveWallet.vue';
import Background from '../components/General/Background.vue';
import NoWallet from '../components/General/NoWallet.vue';
import ApproveModal from '../components/General/Approve.vue';
import DialogueBox from '../components/General/DialogueBox.vue';
import JobDashboard from '../components/Display/JobDashboard.vue';
import Profile from '../components/Buttons/Profile.vue';
import AddJob from '../components/Buttons/AddJob.vue';
// @ is an alias to /src

export default {
  name: 'DeGuildSite',
  components: {
    Background,
    NoWallet,
    ApproveModal,
    ApproveWallet,
    DialogueBox,
    JobDashboard,
    Profile,
    AddJob,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.User.user);
    const wallet = computed(() => store.state.User.approval);
    const overlay = computed(() => store.state.User.overlay);
    const reviewJob = computed(() => store.state.User.reviewJob);
    // console.log(store.state.User.user);
    // console.log(user);
    const siteData = reactive({
      title: 'DeGuild - Dashboard',
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
    return {
      user,
      wallet,
      overlay,
      reviewJob,
    };
  },
};
</script>
