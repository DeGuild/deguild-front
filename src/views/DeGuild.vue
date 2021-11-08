<template>
  <!-- <background /> -->
  <connect-wallet />

  <div v-if="user !== null">
    <job-dashboard></job-dashboard>
    <profile />
    <overlay v-if="overlay"> </overlay>
    <job-review :job="reviewJob"></job-review>

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
import { computed } from 'vue';
import ConnectWallet from '../components/Buttons/ConnectWallet.vue';
import ApproveWallet from '../components/Buttons/ApproveWallet.vue';
// import Background from '../components/General/Background.vue';
import NoWallet from '../components/General/NoWallet.vue';
import ApproveModal from '../components/General/Approve.vue';
import DialogueBox from '../components/General/DialogueBox.vue';
import JobDashboard from '../components/Display/JobDashboard.vue';
import Profile from '../components/Buttons/Profile.vue';
import Overlay from '../components/General/Overlay.vue';
import JobReview from '../components/Display/JobReview.vue';
// @ is an alias to /src

export default {
  name: 'DeGuildSite',
  components: {
    ConnectWallet,
    // Background,
    NoWallet,
    ApproveModal,
    ApproveWallet,
    DialogueBox,
    JobDashboard,
    Profile,
    Overlay,
    JobReview,
    // Navigation,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.User.user);
    const wallet = computed(() => store.state.User.approval);
    const overlay = computed(() => store.state.User.overlay);
    const reviewJob = computed(() => store.state.User.reviewJob);
    // console.log(store.state.User.user);
    // console.log(user);
    return {
      user, wallet, overlay, reviewJob,
    };
  },
};
</script>
