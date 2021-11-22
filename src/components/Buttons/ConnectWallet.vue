<template>
  <div v-if="!user">
    <div class="btn" @click="ethEnabled">
      <div class="text" v-html="state.primary"></div>
    </div>
  </div>
  <div v-if="user && registeredUser && state.userData">
    <div class="btn connected">
      <span>
        <div class="banner username">{{ state.userData.name }}</div>
        <div>
          <span>
            <div class="banner progress-custom">
              <div :style="levelBarStyle"></div>
            </div>
            <div class="banner progress-custom future">
              Need {{ (state.userData.level % 1) * 10 }} xp to level up
            </div>
          </span>
        </div>
      </span>
      <span
        ><div class="banner level">Level</div>
        <div class="banner level number">
          {{ Math.floor(state.userData.level) }}
        </div>
      </span>
      <span
        ><img
          class="banner img"
          :src="
            state.userData.url.slice(0, 125) +
            'thumb_' +
            state.userData.url.slice(125)
          "
      /></span>
    </div>
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
    const registeredUser = computed(() => store.state.User.registered);

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
      userData: computed(() => store.state.User.userProfile),
    });

    const levelBarStyle = computed(() => (state.userData
      ? { color: 'black', width: `${(state.userData.level % 1) * 10}vw` }
      : {}));
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

    async function isRegistered(address) {
      try {
        const response = await fetch(
          `https://us-central1-deguild-2021.cloudfunctions.net/app/readProfile/${web3.utils.toChecksumAddress(
            address,
          )}`,
          { mode: 'cors' },
        );
        const info = await response.json();

        if (response.status === 200) {
          return info;
        }
        return null;
      } catch (err) {
        return null;
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
          const registered = await isRegistered(accounts[0]);
          // console.log(registered);
          if (registered) {
            store.dispatch('User/setRegistration', true);
            store.dispatch('User/setUserProfile', registered);
            router.push('/');
          } else {
            router.push('/register');
          }
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
          // console.log(error);
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
      if (store.state.User.user) {
        const registered = await isRegistered(store.state.User.user);
        // console.log(registered);
        if (registered) {
          store.dispatch('User/setRegistration', true);
          store.dispatch('User/setUserProfile', registered);
        } else {
          router.push('/register');
        }
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    });

    return {
      state,
      user,
      registeredUser,
      levelBarStyle,
      ethEnabled,
    };
  },
});
</script>

<style scoped lang="scss">
.text {
  margin-top: 1.5vw;
}
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
  font-size: 1vw;
  display: flex;
  align-items: center;

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
    left: unset;
    right: 8vw;
    top: -2vw;
    height: 12vw;
    width: 22vw;
  }
}
.banner {
  position: relative;

  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 0.9vw;
  overflow: hidden;

  &.username {
    top: 1vw;
    left: 0vw;
    margin: 0.5vw 0.5vw 2vw 0.5vw;
    font-family: Roboto;
    font-weight: 900;
    font-size: 1.2vw;
    display: flex;
    align-items: center;
  }
  &.progress-custom {
    background: white;
    width: 10vw;
    height: 1vw;
    margin: 0.5vw 0.5vw 0.5vw 0.5vw;
    color: black;

    border-radius: 10%;
    & > div {
      height: 1vw;
      background: orange;
    }
    &.future {
      background: unset;
      position: absolute;
      bottom: 3.3vw;
    }
  }
  &.level {
    display: flex;
    align-items: center;
    justify-content: center;
    top: 1.2vw;
    width: 3vw;
    &.number {
      display: unset;
      width: 3vw;

      font-size: 1.3vw;
    }
  }
  &.img {
    margin: 1.5vw 0vw 0vw 1vw;
    width: 5vw;
    height: 5vw;
    border-radius: 50%;
    background: url('../../assets/Spinner-1s-200px.svg') no-repeat center;
  }
}
</style>
