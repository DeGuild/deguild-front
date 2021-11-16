<template>
  <div class="background">
    <div class="search">
      <div
        class="search button recommend"
        v-bind:class="{ selected: state.recommend }"
        @click="selectRecommend()"
      >
        <div class="search icon"><i class="fa fa-star"></i></div>
        Recommend
      </div>
      <div
        class="search button available"
        v-bind:class="{ selected: state.available }"
        @click="selectAvailable()"
      >
        <div class="search icon"><i class="fas fa-balance-scale"></i></div>
        Available
      </div>
      <div
        class="search button check-post"
        v-bind:class="{ selected: state.posted }"
        @click="selectPosted()"
      >
        <div class="search icon"><i class="fa fa-user-clock"></i></div>
        Posted
      </div>
      <select
        class="sorter box-1"
        v-model="state.selectedSort"
        @change="changedSort()"
      >
        <option value="id">ID</option>
        <option value="reward">REWARD</option>
        <option value="difficulty">DIFFICULTY</option>
        <option value="level">LEVEL</option>
      </select>
      <select
        class="sorter box-2"
        v-model="state.selectedOrder"
        @change="changedSort()"
      >
        <option value="asc">Ascending</option>
        <option value="dsc">Descending</option>
      </select>
      <div class="sorter text"><h2>Sort By</h2></div>

      <div class="searcher icon">
        <p><i class="fa fa-search" aria-hidden="true"></i></p>
      </div>
      <input
        class="searcher"
        v-model="state.searchTitle"
        @keyup.enter="findJobs()"
        placeholder="Search job title"
      />
    </div>
    <div class="display">
      <br />
      <div v-for="job in state.jobs" :key="job.id">
        <job :job="job"></job>
      </div>
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

import Job from './Job.vue';

require('dotenv').config();

const Web3 = require('web3');

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

const deGuildABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/DeGuild/V2/IDeGuild+.sol/IDeGuildPlus.json').abi;

export default defineComponent({
  components: { Job },
  name: 'JobDashboard',
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
      const { timestamp } = block;

      // console.log(infoOffChain);
      // console.log(infoOnChain);

      // TODO: Fetch user picture profile, and add time given since job is posted
      const jobObject = {
        id: tokenId,
        time: 7,
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
        status:
          infoOffChain.submission.length > 0 ? 'Submitted' : 'No submission',
      };

      // console.log(jobObject);
      return jobObject;
    }
    const state = reactive({
      jobs: null,
      recommend: false,
      available: true,
      posted: false,
      selectedOrder: 'asc',
      selectedSort: 'id',
      searchTitle: null,
      level: 5,
    });

    async function isOccupied(address) {
      const realAddress = web3.utils.toChecksumAddress(address);
      try {
        const caller = await deGuild.methods.jobOf(realAddress).call();
        return caller !== '0';
      } catch (error) {
        // console.error('Not purchasable');
        return false;
      }
    }

    async function getJobsAdded() {
      store.dispatch('User/setDialog', 'Please wait!');
      const caller = await deGuild.getPastEvents('JobAdded', {
        filter: { taker: userAddress.value },
        fromBlock: 0,
        toBlock: 'latest',
      });
      const history = await Promise.all(
        caller.map((ele) => idToJob(ele.returnValues[0], ele.blockNumber)),
      );
      console.log(history);
      state.jobs = history;

      return history;
    }

    function sortJobs() {
      if (state.selectedOrder === 'asc') {
        state.jobs = state.jobs.sort((a, b) => (parseInt(a[state.selectedSort], 10)
          > parseInt(b[state.selectedSort], 10)
          ? 1
          : -1));
      } else {
        state.jobs = state.jobs.sort((a, b) => (parseInt(a[state.selectedSort], 10)
          < parseInt(b[state.selectedSort], 10)
          ? 1
          : -1));
      }
    }

    function changedSort() {
      // console.log(state.selectedOrder);
      // console.log(state.selectedSort);
      sortJobs();
    }

    async function fetchRecommend() {
      if (store.state.User.occupied) {
        store.dispatch(
          'User/setDialog',
          'Please finish your current job before taking a new job',
        );
        return;
      }
      const jobsAdded = await getJobsAdded();
      state.jobs = jobsAdded.filter(
        (job) => job.state === 1
          && job.level - state.level > -2
          && job.level - state.level < 1
          && job.client !== userAddress.value,
      );
      changedSort();
      store.dispatch(
        'User/setDialog',
        'Recommendation from us is based on your level. Please take a look!',
      );
    }

    async function fetchAvailable() {
      if (store.state.User.occupied) {
        store.dispatch(
          'User/setDialog',
          'Please finish your current job before taking a new job',
        );
        return;
      }
      const jobsAdded = await getJobsAdded();
      state.jobs = jobsAdded.filter(
        (job) => job.state === 1 && job.client !== userAddress.value,
      );
      changedSort();
      store.dispatch(
        'User/setDialog',
        'Be careful! Though you can take any job, you might not be able to complete it easily.',
      );
    }

    async function fetchPosted() {
      const jobsAdded = await getJobsAdded();
      state.jobs = jobsAdded.filter((job) => job.client === userAddress.value);
      changedSort();
      store.dispatch(
        'User/setDialog',
        'You should contact your job taker as soon as possible.',
      );
    }

    async function fetchTitle() {
      if (store.state.User.occupied) {
        store.dispatch(
          'User/setDialog',
          'Please finish your current job before taking a new job',
        );
        return;
      }
      const jobsAdded = await getJobsAdded();
      const correctRegex = new RegExp(state.searchTitle);

      state.jobs = jobsAdded.filter((job) => correctRegex.test(job.title));
      changedSort();
      store.dispatch(
        'User/setDialog',
        `Here is the list of job titles starting with ${state.searchTitle}.`,
      );
    }

    async function selectAvailable() {
      state.recommend = false;
      state.available = true;
      state.posted = false;
      store.dispatch('User/setFetching', true);

      await fetchAvailable();
      store.dispatch('User/setFetching', false);
    }
    async function selectRecommend() {
      state.recommend = true;
      state.available = false;
      state.posted = false;
      store.dispatch('User/setFetching', true);

      fetchRecommend();
      store.dispatch('User/setFetching', false);
    }
    async function selectPosted() {
      state.recommend = false;
      state.available = false;
      state.posted = true;
      store.dispatch('User/setFetching', true);

      await fetchPosted();
      store.dispatch('User/setFetching', false);
    }

    async function findJobs() {
      console.log(state.searchTitle);
      store.dispatch('User/setFetching', true);

      await fetchTitle();
      store.dispatch('User/setFetching', false);
    }
    onBeforeMount(async () => {
      store.dispatch('User/setFetching', true);
      const occ = await isOccupied(userAddress.value);
      store.dispatch('User/setOccupied', occ);

      await selectAvailable();
      store.dispatch('User/setFetching', false);
    });

    return {
      state,
      userAddress,
      selectAvailable,
      selectPosted,
      selectRecommend,
      findJobs,
      changedSort,
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
  height: 68vh;
  position: absolute;
  left: 1vw;
  top: 10vh;
  overflow: auto;
}
.search {
  width: 61.05vw;
  height: 8vh;
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

.searcher {
  position: absolute;
  height: 2.95vw;
  width: 18vw;
  right: 1vw;
  top: 0.4vw;
  background: #814f21;
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 1vw;
  line-height: 0vw;

  color: #ffffff;
  border: 1px solid #814f21;

  &.icon {
    width: 3vw;
    height: 3.05vw;
    align-content: center;
    justify-content: center;
    right: 19vw;
  }

  &::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: whitesmoke;
    opacity: 1; /* Firefox */
  }

  &:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: whitesmoke;
  }

  &::-ms-input-placeholder {
    /* Microsoft Edge */
    color: whitesmoke;
  }
}
.sorter {
  &.box-1 {
    position: absolute;
    height: 2vw;
    right: 33vw;
    top: 1.4vw;
    width: 7.5vw;

    /* Roboto / OVERLINE */
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 1vw;
  }
  &.box-2 {
    position: absolute;
    height: 2vw;
    right: 23vw;
    width: 9.5vw;

    top: 1.4vw;

    /* Roboto / OVERLINE */
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 1vw;
  }
  &.text {
    position: absolute;
    height: 1vw;

    right: 36.8vw;
    top: 0.5vw;
    /* Roboto / OVERLINE */
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 0.6vw;
    line-height: 0vw;
    /* identical to box height, or 160% */
    display: flex;
    align-items: center;
    text-transform: uppercase;

    /* Gray / 50 */
    color: #787885;

    /* White 100% */
    text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff,
      1px 1px 0 #fff;
  }
}
</style>
