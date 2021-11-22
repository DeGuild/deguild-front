<template>
  <div class="background">
    <div class="display" v-if="!state.fetching && state.job">
      <br />
      <job :job="state.job" @submit="dummy()"></job>
    </div>
    <div class="display" v-show="state.fetching">
      <img src="@/assets/Spinner-1s-200px.svg" />
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import {
  defineComponent, reactive, computed, onBeforeMount,
} from 'vue';
import { useStore } from 'vuex';
import Job from './JobAssigned.vue';

require('dotenv').config();

const Web3 = require('web3');

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

const deGuildABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/DeGuild/V2/IDeGuild+.sol/IDeGuildPlus.json').abi;

export default defineComponent({
  components: { Job },
  name: 'MyTask',
  setup() {
    const store = useStore();
    const userAddress = computed(() => store.state.User.user);
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
    const deGuild = new web3.eth.Contract(deGuildABI, deGuildAddress);

    async function fetchSkills(addresses, tokenIds) {
      return ['skilla', 'skillb'];
    }

    function addDays(date, days) {
      const result = new Date(date * 1000);
      result.setDate(result.getDate() + days);
      return result;
    }

    async function idToJob(tokenId, blockNumber) {
      const infoOnChain = await deGuild.methods.jobInfo(tokenId).call();
      const URI = await deGuild.methods.jobURI(tokenId).call();
      const responseOffChain = await fetch(URI, { mode: 'cors' });
      const infoOffChain = await responseOffChain.json();
      const skillsFetched = await fetchSkills(infoOnChain[3], infoOnChain[4]);
      const block = await web3.eth.getBlock(blockNumber);
      // console.log(block);
      const { timestamp } = block;
      let statusMessage = '';
      if (infoOffChain.note.length > 0) {
        statusMessage = 'Rejected';
      } else if (infoOffChain.submission.length > 0) {
        statusMessage = 'Submitted';
      } else {
        statusMessage = 'No Submission';
      }

      // console.log(infoOffChain);
      // console.log(infoOnChain);

      // TODO: Fetch user picture profile, and add time given since job is posted
      const jobObject = {
        id: tokenId,
        time: infoOffChain.time,
        reward: web3.utils.fromWei(infoOnChain[0]),
        client: infoOnChain[1],
        taker: infoOnChain[2],
        skills: skillsFetched,
        state: parseInt(infoOnChain[5], 10),
        difficulty: infoOnChain[6],
        level: parseInt(infoOffChain.level, 10),
        image:
          'https://media.kapowtoys.co.uk/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/s/h/sh-figuarts-chichi-1.jpg',
        title: infoOffChain.title,
        note: infoOffChain.note,
        submission: infoOffChain.submission,
        description: infoOffChain.description,
        submitted: infoOffChain.submission.length > 0,
        deadline: addDays(timestamp, 7),
        status: statusMessage,
      };

      // console.log(jobObject);
      return jobObject;
      // return {};
    }

    const state = reactive({
      job: null,
      recommend: false,
      available: true,
      posted: false,
      selectedOrder: 'asc',
      selectedSort: 'id',
      searchTitle: null,
      level: 5,
      fetching: computed(() => store.state.User.fetching),
    });

    async function getCurrentJob() {
      store.dispatch('User/setFetching', true);

      store.dispatch('User/setDialog', 'Please wait!');
      const realAddress = web3.utils.toChecksumAddress(userAddress.value);
      const caller = await deGuild.methods.jobOf(realAddress).call();
      const events = await deGuild.getPastEvents('JobTaken', {
        filter: { taker: realAddress },
        fromBlock: 0,
        toBlock: 'latest',
      });
      const selected = events.filter((ele) => ele.returnValues[0] === caller);
      // console.log(selected);
      if (selected.length > 0) {
        const history = await idToJob(caller, selected[0].blockNumber);
        state.job = history;
        if (state.job.submitted) {
          store.dispatch(
            'User/setDialog',
            'Submission completed. Your submission is now being reviewed.',
          );
        } else if (!state.job.submitted && state.job.note.length > 0) {
          store.dispatch(
            'User/setDialog',
            'Oh! It appears your submission is not quite right.\nPlease look at the feedbacks.',
          );
        } else {
          store.dispatch(
            'User/setDialog',
            'Please carefully read the description. \n Once you have finished your work, upload the zipped file.',
          );
        }
      } else {
        store.dispatch('User/setDialog', 'You have nothing to do right now.');
      }
      store.dispatch('User/setFetching', false);
    }
    function dummy() {
      getCurrentJob();
    }
    onBeforeMount(async () => {
      store.dispatch('User/setFetching', true);

      await getCurrentJob();
      store.dispatch('User/setFetching', false);
    });
    return {
      state,
      userAddress,
      dummy,
    };
  },
});
</script>

<style scoped lang="scss">
.background {
  -webkit-box-shadow: inset 0px 0px 0px 1vw #6c421b;
  -moz-box-shadow: inset 0px 0px 0px 1vw #6c421b;
  box-shadow: inset 0px 0px 0px 1vw #6c421b;
  width: 63vw;
  height: 80vh;
  position: absolute;
  background: url('../../assets/dashboard-bg.png');
  left: 35vw;
  bottom: 0vw;
  overflow: auto;
  background-size: cover;
  background-repeat: no-repeat;
}
.display {
  width: 61vw;
  height: 76vh;
  position: absolute;
  left: 1vw;
  top: 1vw;
  overflow: auto;
}
.search {
  width: 61.05vw;
  height: 4.2vw;
  top: 1vw;
  left: 1vw;
  position: relative;
  background: #997c61;
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 0.8vw;
  color: white;
  // padding-bottom: 1vw;

  &.icon {
    width: unset;
    height: unset;
    left: 0vw;
    top: 0vw;
    font-size: 1.5vw;
    padding-top: 0.5vw;
    padding-bottom: 0.25vw;
    // background: red;
    background: unset;
  }
  &.button {
    width: 6vw;
    left: 0vw;
    top: 0vw;
    cursor: pointer;
    position: absolute;

    &.available {
      left: 6vw;
      &.selected {
        top: -0.1vw;

        background: #6c421b;
      }
    }
    &.recommend {
      &.selected {
        top: -0.1vw;

        background: #6c421b;
      }
    }
    &.check-post {
      left: 12vw;
      &.selected {
        top: -0.1vw;

        background: #6c421b;
      }
    }
  }
  &.button:hover {
    background: rgba(108, 66, 27, 0.4);
  }
}
.half-circle-spinner {
  box-sizing: border-box;
  width: 5vw;
  height: 5vw;
  top: 1.1vw;
  left: 1.1vw;
  border-radius: 100%;
  position: absolute;

  &.circle {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    border: calc(60px / 10) solid transparent;
  }

  &.circle.circle-1 {
    border-top-color: #ff1d5e;
    animation: half-circle-spinner-animation 1s infinite;
  }

  &.circle.circle-2 {
    border-bottom-color: #ff1d5e;
    animation: half-circle-spinner-animation 1s infinite alternate;
  }

  @keyframes half-circle-spinner-animation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
