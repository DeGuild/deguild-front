<template>
  <div class="overlay">
    <h2 class="text">Final Judgement</h2>
    <h3>job id</h3>
    <div>
      <input
        v-model="reasoning.pattern"
        type="radio"
        id="not-talented"
        value="not-talented"
      />
      <label for="not-talented">Not talented enough</label><br />
    </div>
    <div>
      <input
        v-model="reasoning.pattern"
        type="radio"
        id="perma-lock"
        value="perma-lock"
      />
      <label for="perma-lock">Perma-lock</label><br />
    </div>
    <div>
      <input
        v-model="reasoning.pattern"
        type="radio"
        id="perfection"
        value="perfection"
      />
      <label for="perfection">Perfectionists</label><br />
    </div>
    <div>
      <input
        v-model="reasoning.pattern"
        type="radio"
        id="abandon"
        value="abandon"
      />
      <label for="abandon">Abandoning</label><br />
    </div>
    <div>
      <input
        v-model="reasoning.pattern"
        type="radio"
        id="freelancer-g"
        value="freelancer-g"
      />
      <label for="freelancer-g">Annoying Freelancer</label><br />
    </div>
    <div>
      <input
        v-model="reasoning.pattern"
        type="radio"
        id="client-g"
        value="client-g"
      />
      <label for="client-g">Annoying Client</label><br />
    </div>

    <div>
      <label>DeGuild fees</label>
      <input type="number" :value="reasoning.deGuildFees" readonly />
      %
    </div>
    <div>
      <label for="client-share">Client</label>
      <input
        id="client-share"
        type="number"
        oninput="validity.valid||(value='');"
        min=0
        max=100
      />
      %
    </div>
    <div>
      <label for="taker-share">Freelancer</label>
      <input
        id="taker-share"
        type="number"
        oninput="validity.valid||(value='');"
        min=0
        max=100
      />
      %
    </div>

    <div>
      <button class="register" @click="state.fetching ? null : decided()">
        {{ this.title }}
      </button>
    </div>
  </div>
</template>

<script>
import {
  defineComponent, reactive, computed, ref,
} from 'vue';
import { useStore } from 'vuex';
import Web3Token from 'web3-token';

require('dotenv').config();

const Web3 = require('web3');
const noImg = require('@/assets/no-url.jpg');

export default defineComponent({
  name: 'Registration',
  props: ['title'],
  emits: ['decided'],
  setup(_, { emit }) {
    const dummy = ref();
    const store = useStore();
    const web3 = new Web3(window.ethereum);

    const state = reactive({
      imageData: null,
      picture: noImg,
      uploadValue: 0,
      error: null,
      fileName: 'Please choose an image',
      uploading: false,
      username: null,
      fetching: computed(() => store.state.User.fetching),
    });

    const reasoning = reactive({
      pattern: null,
      deGuildFees: 0,
      client: 0,
      freelance: 0,
    });

    async function decided() {
      const address = (await web3.eth.getAccounts())[0];

      // generating a token with 1 day of expiration time
      const token = await Web3Token.sign(
        (msg) => web3.eth.personal.sign(msg, address),
        '1d',
      );
      console.log(token);
      emit('decided');
    }

    return {
      state,
      reasoning,
      dummy,
      decided,
    };
  },
});
</script>
<style scoped lang="scss">
.overlay {
  /* Rectangle 9939 */

  position: absolute;
  width: 53.802vw;
  height: 32.604vw;
  left: 23.125vw;
  top: 10.823vw;

  background: rgba(0, 0, 0, 0.5);
}

.text {
  position: relative;
  width: 53.802vw;
  height: 3.125vw;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 2.5vw;
  line-height: 3.646vw;
  color: #ffffff;
}

.preview {
  position: relative;
  width: 14vw;
  height: 14vw;
  left: 45.99vw;
  top: 17.906vw;

  border-radius: 50%;
}

.upload {
  position: relative;
  color: #ffffff;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 1vw;
  margin: 1vw 1vw 1vw 1vw;

  &.choose {
    width: 15vw;
  }

  &.button {
    color: black;
    width: 6.927vw;
    height: 2vw;
    line-height: 1vw;
    padding: 0.5vw 0.5vw 0.5vw 0.5vw;
  }
}

.username {
  position: relative;
  width: 22vw;
  height: 2.125vw;
  margin-top: 1vw;
  padding: 0vw 0.5vw 0vw 0.5vw;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 1vw;
  color: black;
}

.register {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 1.5vw;
  margin-top: 2vw;

  padding: 0.2vw 0.833vw;

  position: relative;

  background: #fdf1e3;

  border-radius: 0.208vw;
}

.noImg {
  position: relative;
  width: 11vw;
  height: 11vw;
  background: grey;
  border-radius: 50%;

  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 2vw;
  color: #ffffff;
}

input[type='file'] {
  display: none;
}

.custom-file-upload {
  position: relative;
  width: 30vw;
  height: 2vw;
  margin-top: 1vw;
  padding-bottom: 1vw;
  padding-left: 1vw;
  // background: red;

  // display: flex;
  // align-items: center;
  // justify-content: center;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 1vw;
  color: #000000;
  cursor: pointer;

  &.button {
    padding-bottom: 0vw;
    padding: 0.5vw 0.5vw 0.5vw 0.5vw;

    background: rgba(224, 224, 224, 0.6);
    overflow: hidden;
  }
}
.label-upload {
  position: absolute;
  cursor: default;
  color: white;
  bottom: 1vw;
  right: 1vw;
  font-size: 1vw;
}
.upload-pos {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  left: 30vw;
}
.fas {
  color: rgb(92, 92, 92);
}
</style>
