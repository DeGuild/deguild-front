<template>
  <button @click="sendTest()">TEST ME!</button>
</template>

<script>
// @ is an alias to /src
import Web3 from 'web3';
import Web3Token from 'web3-token';

export default {
  name: 'Sandbox',
  setup() {
    // console.log(store.state.User.user);
    // console.log(user);
    // Connection to MetaMask wallet
    const web3 = new Web3(window.ethereum);

    // attaching token to authorization header ... for example
    async function sendTest() {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // getting address from which we will sign message
      const address = (await web3.eth.getAccounts())[0];

      // generating a token with 1 day of expiration time
      const token = await Web3Token.sign(
        (msg) => web3.eth.personal.sign(msg, address),
        '1d',
      );

      console.log(token);

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token },
      };
      await fetch(
        'https://us-central1-deguild-2021.cloudfunctions.net/guild/test',
        requestOptions,
      );
    }

    return { sendTest };
  },
};
</script>
