<template>
  <div v-if="!user">
    <div class="btn" @click="ethEnabled" v-html="state.primary"></div>
  </div>
  <div v-if="user">
    <div class="btn connected" v-html="state.primary"></div>
  </div>
</template>

<script>
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */

import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import {
  reactive, onBeforeMount, computed, defineComponent,
} from 'vue';

require('dotenv').config();

const Web3 = require('web3');

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

const deGuildABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/DeGuild/V2/IDeGuild+.sol/IDeGuildPlus.json').abi;

/**
 * Using relative path, just clone the git beside this project directory and compile to run
 */
// eslint-disable-next-line no-unused-vars

const dgcAddress = process.env.VUE_APP_DGC_ADDRESS;
const dgcABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/Tokens/DeGuildCoinERC20.sol/DeGuildCoinERC20.json').abi;
const ownerABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/@openzeppelin/contracts/access/Ownable.sol/Ownable.json').abi;
// DeGuild-MG-CS-Token-contracts/artifacts/@openzeppelin/contracts/access/Ownable.sol/Ownable.json
export default defineComponent({
  name: 'ConnectWallet',
  setup() {
    const store = useStore();
    const router = useRouter();

    const user = computed(() => store.state.User.user);

    function shortenedAddress(address) {
      if (!address) {
        return "<i class='fas fa-spinner fa-spin'></i>";
      }
      const accountLength = address.length;
      const connectedAddress = `${address.substring(
        0,
        5,
      )}...${address.substring(accountLength - 4, accountLength)}`;
      return connectedAddress;
    }

    const state = reactive({
      primary: computed(() => (store.state.User.fetching || store.state.User.user
        ? shortenedAddress(store.state.User.user)
        : 'CONNECT WALLET')),
      network: '',
      magicScrollsData: [],
    });
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

    /**
     * Returns whether user is the owner of this shop
     *
     * @param {address} address ethereum address
     * @return {bool} ownership.
     */
    async function isOwner(address) {
      const deGuild = new web3.eth.Contract(ownerABI, deGuildAddress);
      const realAddress = web3.utils.toChecksumAddress(address);
      try {
        const caller = await deGuild.methods.owner().call();
        return caller === realAddress;
      } catch (error) {
        // console.error('Not purchasable');
        return false;
      }
    }

    async function isOccupied(address) {
      const deGuild = new web3.eth.Contract(deGuildABI, deGuildAddress);
      const realAddress = web3.utils.toChecksumAddress(address);
      try {
        const caller = await deGuild.methods.jobOf(realAddress).call();
        return caller !== '0';
      } catch (error) {
        // console.error('Not purchasable');
        return false;
      }
    }

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
        // console.log(caller, balance, address);
        return caller <= balance && caller >= 0;
      } catch (error) {
        return false;
      }
    }
    /**
     * Returns verification of the Rinkeby Network
     *
     * @param {address} address The address of any contract using the interface given
     * @return {bool} status of verification.
     */
    async function verifyNetwork() {
      state.network = await web3.eth.net.getNetworkType();

      if (state.network !== 'rinkeby') {
        state.primary = 'CHANGE TO RINKEBY';
        return false;
      }
      return true;
    }

    /**
     * Connect to the Rinkeby Network
     */
    async function connectToRinkeby() {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x4' }],
        });
      } else {
        router.push('/no-provider');
      }
    }

    /**
     * Disconnect user from the dapp
     */
    function disconnected() {
      store.dispatch('User/setUser', null);
    }

    /**
     * Connect user to the dapp
     * @return {bool} status of connection.
     */
    async function connectWallet() {
      store.dispatch('User/reset');

      if (window.ethereum) {
        try {
          store.dispatch('User/setFetching', true);

          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          const ownership = await isOwner(accounts[0]);
          const approve = await hasApproval(accounts[0]);
          const canTakeJob = await isOccupied(accounts[0]);
          // const toAdd = [];

          store.dispatch(
            'User/setUser',
            web3.utils.toChecksumAddress(accounts[0]),
          );
          store.dispatch('User/setOccupied', canTakeJob);
          store.dispatch('User/setOwner', ownership);
          store.dispatch(
            'User/setDialog',
            'Please wait and I will show you what we have gotten!',
          );

          // console.log(approve);
          store.dispatch('User/setApproval', approve);
          if (!approve) {
            store.dispatch(
              'User/setDialog',
              'Seems like you have not approved your walllet.',
            );
          }

          store.dispatch('User/setFetching', false);
          store.dispatch(
            'User/setDialog',
            'Hi there! So, what would you like to take?',
          );

          return true;
        } catch (error) {
          console.log(error);
        }
      }
      return false;
    }

    /**
     * Handle what we do when the user changed the network
     */
    function handleChainChanged() {
      // We recommend reloading the page, unless you must do otherwise
      window.location.reload();
    }

    /**
     * Returns the information of the certificate of this user
     * @dev For now, 'eth_accounts' will continue to always return an array
     *
     * @param {address} address The addresses of connect wallets
     */
    function handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        disconnected();
        return;
      }
      const current = accounts[0];
      if (current !== store.state.User.user) {
        connectWallet();
      }
    }

    /**
     * Connect to the Ethereum network
     */
    async function ethEnabled() {
      if (state.network !== 'rinkeby') {
        await connectToRinkeby();
        return false;
      }
      await connectWallet();
      return true;
    }

    onBeforeMount(async () => {
      await verifyNetwork();

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    });

    return {
      state,
      user,
      ethEnabled,
    };
  },
});
</script>

<style scoped lang="scss">
.btn {
  /* Small button */

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  position: absolute;
  width: 16vw;
  height: 8vw;
  left: 82vw;
  top: 0vw;

  /* standart theme/error */
  background: url('../../assets/wallet-board.webp');
  border-radius: 4px;
  background-size: contain;
  background-repeat: no-repeat;

  font-family: Secular One;
  font-style: normal;
  font-weight: normal;
  font-size: 0.7vw;
  display: flex;
  align-items: center;
  letter-spacing: 0.00892857em;
  text-transform: uppercase;

  /* shades/white */
  color: #ffffff;
  cursor: pointer;

  /* Inside Auto Layout */
  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 0px 0px;

  &.connected {
    cursor: unset;
  }
}
</style>
