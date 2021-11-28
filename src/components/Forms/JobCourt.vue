<template>
  <div class="overlay">
    <h2 class="text">Final Judgement of #{{ reasoning.client }}</h2>
    <button class="back" @click="goBack">X</button>
    <span class="radio-side">
      <div>
        <input
          v-model="reasoning.pattern"
          type="radio"
          id="not-talented"
          value="not-talented"
          @change="changedFees(10, 0, 0, false)"
        />
        <label for="not-talented">Not talented enough</label><br />
      </div>
      <div>
        <input
          v-model="reasoning.pattern"
          type="radio"
          id="perma-lock"
          value="perma-lock"
          @change="changedFees(10, 0, 90, true)"
        />
        <label for="perma-lock">Perma-lock</label><br />
      </div>
      <div>
        <input
          v-model="reasoning.pattern"
          type="radio"
          id="perfection"
          value="perfection"
          @change="changedFees(10, 45, 45, true)"
        />
        <label for="perfection">Perfectionists</label><br />
      </div>
      <div>
        <input
          v-model="reasoning.pattern"
          type="radio"
          id="abandon"
          value="abandon"
          @change="changedFees(0, 100, 0, true)"
        />
        <label for="abandon">Abandoning</label><br />
      </div>
      <div>
        <input
          v-model="reasoning.pattern"
          type="radio"
          id="freelancer-g"
          value="freelancer-g"
          @change="changedFees(5, 95, 0, true)"
        />
        <label for="freelancer-g">Annoying Freelancer</label><br />
      </div>
      <div>
        <input
          v-model="reasoning.pattern"
          type="radio"
          id="client-g"
          value="client-g"
          @change="changedFees(5, 0, 95, true)"
        />
        <label for="client-g">Annoying Client</label><br />
      </div>
    </span>
    <span class="shares-side">
      <div>Total fees and return</div>
      <br />
      <div>
        <label>DeGuild fees</label>
        <input
          class="fees"
          type="number"
          :value="reasoning.deGuildFees"
          readonly
        />
        %
      </div>
      <div>
        <label for="client-share">Client</label>
        <input
          v-model="reasoning.client"
          id="client-share"
          type="number"
          oninput="validity.valid||(value='');"
          min="0"
          max="100"
          @change="mathForReturn(true)"
          :readonly="reasoning.fixed"
        />
        %
      </div>
      <div>
        <label for="taker-share">Freelancer</label>
        <input
          v-model="reasoning.freelancer"
          id="taker-share"
          type="number"
          oninput="validity.valid||(value='');"
          min="0"
          max="100"
          @change="mathForReturn(false)"
          :readonly="reasoning.fixed"
        />
        %
      </div>
      <br />
      <div
        v-if="
          reasoning.deGuildFees + reasoning.client + reasoning.freelancer !==
          100
        "
        style="color: red"
      >
        Please distribute return fairly!
      </div>
    </span>

    <div v-if="reasoning.pattern === 'abandon'">
      <button
        class="last-decision cancel"
        @click="state.fetching ? null : cancelJob()"
      >
        CANCEL JOB
      </button>
    </div>
    <div v-else>
      <button
        class="last-decision"
        v-if="
          reasoning.deGuildFees + reasoning.client + reasoning.freelancer ===
          100
        "
        @click="state.fetching ? null : decided()"
      >
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

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

const deGuildABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/DeGuild/V2/IDeGuild+.sol/IDeGuildPlus.json').abi;

export default defineComponent({
  name: 'Registration',
  props: ['title'],
  emits: ['decided'],
  setup(_, { emit }) {
    const dummy = ref();
    const store = useStore();
    const web3 = new Web3(window.ethereum);
    const deGuild = new web3.eth.Contract(deGuildABI, deGuildAddress);

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
      freelancer: 0,
      fixed: false,
    });

    async function decided() {
      const address = (await web3.eth.getAccounts())[0];

      // generating a token with 1 day of expiration time
      const token = await Web3Token.sign(
        (msg) => web3.eth.personal.sign(msg, address),
        '1d',
      );
      const realAddress = web3.utils.toChecksumAddress(store.state.User.user);

      const caller = await deGuild.methods
        .cancel(this.job.id)
        .send({ from: realAddress });
      console.log(token);
      console.log(caller);
      emit('decided');
    }

    async function cancelJob() {
      const address = (await web3.eth.getAccounts())[0];

      // generating a token with 1 day of expiration time
      const token = await Web3Token.sign(
        (msg) => web3.eth.personal.sign(msg, address),
        '1d',
      );
      console.log(token);
      emit('decided');
    }

    function changedFees(dgf, cl, fl, fx) {
      reasoning.deGuildFees = dgf;
      reasoning.client = cl;
      reasoning.freelancer = fl;
      reasoning.fixed = fx;
    }

    function goBack() {
      store.dispatch('User/setReportedJob', this.job);
    }

    function mathForReturn(isClient) {
      if (!isClient) {
        reasoning.client = 100 - reasoning.deGuildFees - reasoning.freelancer;
        reasoning.freelancer = 100 - reasoning.deGuildFees - reasoning.client;
      } else {
        reasoning.freelancer = 100 - reasoning.deGuildFees - reasoning.client;
        reasoning.client = 100 - reasoning.deGuildFees - reasoning.freelancer;
      }
    }

    return {
      state,
      reasoning,
      dummy,
      mathForReturn,
      changedFees,
      decided,
      goBack,
      cancelJob,
    };
  },
});
</script>
<style scoped lang="scss">
.overlay {
  /* Rectangle 9939 */

  position: absolute;
  width: 80vw;
  height: 60vh;
  left: 10vw;
  top: 10.823vw;

  background: rgba(0, 0, 0, 0.5);
}

.text {
  position: relative;
  width: 80vw;
  height: 3.125vw;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-family: Roboto;
  font-style: normal;
  font-weight: 900;
  font-size: 2.5vw;
  line-height: 3.646vw;
  color: #ffffff;
}
.radio-side {
  position: absolute;
  display: block;
  left: 4.5vw;
  padding-top: 5vh;
  width: 35vw;
  height: 27vh;
  background: rgba(0, 0, 0, 0.12);
  input[type='radio'] {
    position: absolute;
    left: 3vw;
    width: 1vw;
    height: 1vw;
  }
  label {
    margin-left: 1vw;
    font-family: Roboto;
    font-style: normal;
    font-weight: 900;
    font-size: 1.5vw;
    line-height: 2vw;
    color: #ffffff;
  }
}
.shares-side {
  position: absolute;
  display: block;
  right: 4.5vw;
  padding-top: 5vh;
  width: 35vw;
  height: 27vh;
  background: rgba(0, 0, 0, 0.12);

  div {
    margin-left: 1vw;
    font-family: Roboto;
    font-style: normal;
    font-weight: 900;
    font-size: 1.5vw;
    line-height: 2vw;
    color: #ffffff;
  }
  input[type='number'] {
    margin-left: 8vw;
    text-align: right;
    font-family: Roboto;
    font-style: normal;
    font-weight: 900;
    font-size: 1.5vw;
    line-height: 2vw;
    left: 3vw;
    width: 8vw;
    height: 1.5vw;
    &.fees {
      color: #ffffff;
      background: #4b2400;
    }
  }
  label {
    left: 2vw;
    position: absolute;
    margin-left: 1vw;
    font-family: Roboto;
    font-style: normal;
    font-weight: 900;
    font-size: 1.5vw;
    line-height: 2vw;
    color: #ffffff;
  }
}
.last-decision {
  position: absolute;
  bottom: 2vw;
  left: 35vw;
  width: 9vw;
  height: 6vh;
  font-family: Roboto;
  font-style: normal;
  color: #754d28;
  background: #fdf1e3;
  font-size: 1.5vw;
  font-weight: 500;
  text-decoration: none;

  cursor: pointer;
  border-radius: 10%;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24);

  &.cancel {
    width: 15vw;
    left: 32vw;

    color: #ffffff;
    background: #ff0000;
  }
}
.fas {
  color: rgb(92, 92, 92);
}
.back {
  position: absolute;
  right: 1vw;
  top: 1vw;
  font-size: 2vw;
  color: rgb(255, 0, 0);
  font-weight: 900;
}
</style>
