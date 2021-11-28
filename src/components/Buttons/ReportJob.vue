<template>
  <div class="addJob" @click="report" v-if="this.job.state !== 0">
    <span class="text">
      <i class="fas fa-bomb" aria-hidden="true"></i>
    </span>
    <span class="text desc">Report Job</span>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';

const Web3 = require('web3');
const deGuildABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/DeGuild/V2/IDeGuild+.sol/IDeGuildPlus.json').abi;

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

export default defineComponent({
  name: 'ReportJob',
  props: ['job'],
  emits: ['submit'],

  setup(props, { emit }) {
    const store = useStore();
    const userAddress = computed(() => store.state.User);
    const web3 = new Web3(window.ethereum);

    const state = reactive({
      user: computed(() => store.state.User.user),
      fetching: computed(() => store.state.User.fetching),
    });
    async function report() {
      store.dispatch('User/setFetching', true);

      store.dispatch(
        'User/setDialog',
        'Please confirm your action...',
      );
      try {
        const deGuild = new web3.eth.Contract(deGuildABI, deGuildAddress);
        const realAddress = web3.utils.toChecksumAddress(state.user);

        await deGuild.methods.report(props.job.id).send({ from: realAddress });
        store.dispatch('User/setDialog', `Job ID${props.job.id} is reported! Make sure you contact the DeGuild master later.`);

        store.dispatch('User/setFetching', false);
        emit('submit');
      } catch (error) {
        store.dispatch('User/setDialog', 'Job report has been cancelled!');
        store.dispatch('User/setFetching', false);
      }
    }

    return {
      state,
      userAddress,
      report,
    };
  },
});
</script>
<style scoped lang="scss">
.addJob {
  background: #ffffff;
  /* Shadow Blue · 16dp */
  width: 15vw;
  height: 4vw;
  box-shadow: 0vw 0.5vw 0.5vw rgba(0, 0, 0, 0.4);
  border-radius: 2vw;
  position: absolute;
  font-size: 2vw;
  left: 9vw;
  bottom: 18vw;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  :hover {
    cursor: pointer;
  }
}
.text {
  padding-left: 1.5vw;

  font-family: Secular One;
  font-style: normal;
  font-weight: normal;
  font-size: 1.5vw;
  line-height: 3vw;
  color: #6c421b;
}
</style>
