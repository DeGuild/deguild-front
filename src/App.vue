<template>
  <link
    rel="stylesheet"
    href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
    integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
    crossorigin="anonymous"
  />
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/buttons">Buttons</router-link> |
    <router-link to="/connectWallet">Wallet</router-link>
  </div> -->
  <!-- <footer></footer> -->

  <router-view />
  <navigation v-if="user && !overlay && registered"></navigation>
  <connect-wallet></connect-wallet>
  <registration
    v-if="user && !overlay && update"
    title="Update Profile"
    @profileUpdated="updateProfile()"
  ></registration>
</template>
<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import Navigation from '@/components/General/Navigation.vue';
import Registration from '@/components/Forms/Registration.vue';
import ConnectWallet from './components/Buttons/ConnectWallet.vue';

const Web3 = require('web3');

// @ is an alias to /src

export default {
  name: 'App',
  components: {
    Navigation,
    Registration,
    ConnectWallet,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.User.user);
    const wallet = computed(() => store.state.User.approval);
    const overlay = computed(() => store.state.User.overlay);
    const update = computed(() => store.state.User.update);
    const registered = computed(() => store.state.User.registered);
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

    async function updateProfile() {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      try {
        const response = await fetch(
          `https://us-central1-deguild-2021.cloudfunctions.net/app/readProfile/${web3.utils.toChecksumAddress(
            user.value,
          )}`,
          { mode: 'cors' },
        );
        const info = await response.json();
        // console.log('REFRESH!!');
        if (response.status === 200) {
          // console.log(info);

          store.dispatch('User/setUserProfile', info);
          return info;
        }
        return null;
      } catch (err) {
        return null;
      }
    }

    // console.log(store.state.User.user);
    // console.log(user);
    return {
      user,
      wallet,
      overlay,
      update,
      registered,
      updateProfile,
    };
  },
};
</script>
<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  //this is where we use the variable
  color: $primary;
}
body {
  background-image: url('assets/bg 1920.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-color: #464646;
}

textarea:focus,
input:focus {
  outline: none;
}
</style>
