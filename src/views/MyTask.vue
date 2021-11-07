<template>
  <background />
  <connect-wallet />
  <div v-if="user !== null">
    <dialogue-box></dialogue-box>
    <job-current></job-current>
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
import { computed } from 'vue';
import ConnectWallet from '../components/Buttons/ConnectWallet.vue';
import ApproveWallet from '../components/Buttons/ApproveWallet.vue';
import Background from '../components/General/Background.vue';
import NoWallet from '../components/General/NoWallet.vue';
import ApproveModal from '../components/General/Approve.vue';
import DialogueBox from '../components/General/DialogueBox.vue';
import Profile from '../components/Buttons/Profile.vue';
import JobCurrent from '../components/Display/JobCurrent.vue';
// import Navigation from '../components/Display/Navigation.vue';
// @ is an alias to /src

export default {
  name: 'MyTaskSite',
  components: {
    ConnectWallet,
    Background,
    NoWallet,
    ApproveModal,
    ApproveWallet,
    DialogueBox,
    Profile,
    JobCurrent,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.User.user);
    const wallet = computed(() => store.state.User.approval);
    // console.log(store.state.User.user);
    // console.log(user);
    return { user, wallet };
  },
};
</script>
