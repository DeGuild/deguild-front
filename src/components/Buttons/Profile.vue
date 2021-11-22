<template>
  <h1 class="text" ><i class="fa fa-cog" aria-hidden="true"></i></h1>
</template>

<script>
/* eslint-disable no-await-in-loop */

import { useStore } from 'vuex';
// import { useRoute } from 'vue-router';

import { reactive, computed, defineComponent } from 'vue';

require('dotenv').config();

const Web3 = require('web3');

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

/**
 * Using relative path, just clone the git beside this project directory and compile to run
 */
// eslint-disable-next-line no-unused-vars

const dgcAddress = process.env.VUE_APP_DGC_ADDRESS;

/**
 * Using relative path, just clone the git beside this project directory and compile to run
 */
// eslint-disable-next-line no-unused-vars
const dgcABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/Tokens/DeGuildCoinERC20.sol/DeGuildCoinERC20.json').abi;

export default defineComponent({
  name: 'Profile',
  setup() {
    const store = useStore();
    // const route = useRoute();

    const user = computed(() => store.state.User.user);

    const state = reactive({
      primary: 'APPROVE',
      network: '',
      magicScrollsData: [],
    });
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

    /**
     * Returns whether user has approved this shop to spend their DGC
     *
     * @param {address} address ethereum address
     * @return {bool} approval.
     */
    async function hasApproval(address) {
      const deguildCoin = new web3.eth.Contract(dgcABI, dgcAddress);
      const realAddress = web3.utils.toChecksumAddress(address);
      try {
        const balance = await deguildCoin.methods.balanceOf(realAddress).call();
        const caller = await deguildCoin.methods
          .allowance(realAddress, deGuildAddress)
          .call();
        return caller <= balance && caller >= 0;
      } catch (error) {
        return false;
      }
    }

    /**
     * Returns whether user is the owner of this shop
     *
     * @param {address} address ethereum address
     * @return {bool} ownership.
     */
    async function approve() {
      state.primary = "<i class='fas fa-spinner fa-spin'></i>";

      const deguildCoin = new web3.eth.Contract(dgcABI, dgcAddress);
      const realAddress = web3.utils.toChecksumAddress(store.state.User.user);
      try {
        const balance = await deguildCoin.methods.balanceOf(realAddress).call();
        await deguildCoin.methods
          .approve(deGuildAddress, balance)
          .send({ from: realAddress });
        // console.log(caller);
        const approval = await hasApproval(realAddress);
        store.dispatch('User/setApproval', approval);

        return approval;
      } catch (error) {
        return false;
      }
    }

    return {
      state,
      user,
      approve,
    };
  },
});
</script>
<style scoped lang="scss">
.text {
  color: #ffffff;
  position: absolute;
  right: 2vw;
  font-size: 5vw;
  top: -1.5vw;
  :hover{
    cursor: pointer;
  }
}
</style>
