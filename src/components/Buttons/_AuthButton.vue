<template>
  <button @click="sendTest()">TEST ME!</button>
  <button @click="sendPost()">POST ME!</button>
  <button @click="sendPut()">PUT ME!</button>
</template>

<script>
// @ is an alias to /src
import Web3 from 'web3';
import Web3Token from 'web3-token';

export default {
  name: 'AuthToOffChainExample',
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
      const requestOptions = {
        method: 'GET',
        // eslint-disable-next-line quote-props
        headers: { Authorization: token },
      };

      const response = await fetch(
        'https://us-central1-deguild-2021.cloudfunctions.net/guild/test',
        requestOptions,
      );
      const data = await response.json();
      console.log(data);
    }

    async function sendPost() {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // getting address from which we will sign message
      const address = (await web3.eth.getAccounts())[0];

      // generating a token with 1 day of expiration time
      const token = await Web3Token.sign(
        (msg) => web3.eth.personal.sign(msg, address),
        '1d',
      );
      const requestOptions = {
        method: 'POST',
        headers: { Authorization: token, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'hello',
          address: '0x1906e3cA463E5De6B3F7C65d294696bD59cbfA31',
          level: '4',
          tokenId: '0',
          description: 'good',
          name: 'world',
          skills: ['good', 'skills'],
        }),
      };

      const response = await fetch(
        'https://us-central1-deguild-2021.cloudfunctions.net/guild/addJob',
        requestOptions,
      );
      const data = await response.json();
      console.log(data);
    }

    async function sendPut() {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // getting address from which we will sign message
      const address = (await web3.eth.getAccounts())[0];

      // generating a token with 1 day of expiration time
      const token = await Web3Token.sign(
        (msg) => web3.eth.personal.sign(msg, address),
        '1d',
      );
      const requestOptions = {
        method: 'PUT',
        // eslint-disable-next-line quote-props
        headers: { Authorization: token, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: '0x1906e3cA463E5De6B3F7C65d294696bD59cbfA31',
          tokenId: '0',
          submission: 'good',
          note: 'world',
        }),
      };

      const response = await fetch(
        'https://us-central1-deguild-2021.cloudfunctions.net/guild/submit',
        requestOptions,
      );
      const data = await response.json();
      console.log(data);
    }

    return { sendTest, sendPost, sendPut };
  },
};
</script>
