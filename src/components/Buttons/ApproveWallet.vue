<template>
  <div v-if="user">
    <button class="btn" @click="state.fetching ? null : approve()" v-html="state.primary"></button>
  </div>
</template>

<script>
import { useStore } from 'vuex';

import { reactive, computed, defineComponent } from 'vue';

require('dotenv').config();

const Web3 = require('web3');

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

/**
 * Using relative path, just clone the git beside this project directory and compile to run
 */

const dgcAddress = process.env.VUE_APP_DGC_ADDRESS;
const dgcABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/Tokens/DeGuildCoinERC20.sol/DeGuildCoinERC20.json').abi;

export default defineComponent({
  name: 'ApproveWallet',
  setup() {
    const store = useStore();

    const user = computed(() => store.state.User.user);

    const state = reactive({
      primary: 'APPROVE',
      network: '',
      magicScrollsData: [],
      fetching: computed(() => store.state.User.fetching),
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
        return caller <= balance && caller > 0;
      } catch (error) {
        return false;
      }
    }

    /**
     * Approve the contract and returns returns whether user has
     * approved this shop to spend their DGC
     *
     * @return {bool} approval.
     */
    async function approve() {
      store.dispatch('User/setFetching', true);
      state.primary = "<i class='fas fa-spinner fa-spin'></i>";

      const deguildCoin = new web3.eth.Contract(dgcABI, dgcAddress);
      const realAddress = web3.utils.toChecksumAddress(store.state.User.user);
      try {
        const balance = await deguildCoin.methods.balanceOf(realAddress).call();

        await deguildCoin.methods
          .approve(deGuildAddress, balance)
          .send({ from: realAddress });
        const approval = await hasApproval(realAddress);
        store.dispatch('User/setApproval', approval);
        store.dispatch('User/setFetching', false);

        return approval;
      } catch (error) {
        store.dispatch('User/setFetching', false);
        state.primary = 'APPROVE';

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
.btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  position: absolute;
  width: 25vw;
  height: 10vw;
  left: 38.4vw;
  top: 20vw;

  background: #ff7a52;
  border-radius: 4px;

  font-family: Secular One;
  font-style: normal;
  font-weight: normal;
  font-size: 3vw;
  display: flex;
  align-items: center;
  letter-spacing: 0.00892857em;
  text-transform: uppercase;

  color: #ffffff;

  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 0px 0px;

  &:hover {
    background: #ff6e42;
  }
  &.connected {
    &:hover {
      background: unset;
    }
    cursor: cursor;
  }
}
</style>
