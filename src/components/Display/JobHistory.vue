<template>
  <div class="background">
    <div class="search">
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
    <div class="display" v-if="!state.fetching">
      <br />
      <div v-for="job in state.jobs" :key="job.id">
        <job :job="job"></job>
      </div>
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
import Job from './Job.vue';

require('dotenv').config();

const Web3 = require('web3');

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

const deGuildABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/DeGuild/V2/IDeGuild+.sol/IDeGuildPlus.json').abi;
const certificateABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/SkillCertificates/V2/ISkillCertificate+.sol/ISkillCertificatePlus.json').abi;

export default defineComponent({
  components: { Job },
  name: 'JobHistory',
  setup() {
    const store = useStore();
    const userAddress = computed(() => store.state.User);
    const mockJobs = [
      {
        id: 0,
        level: 5,
        time: 365,
        reward: 800,
        difficulty: 1,
        image:
          'https://media.kapowtoys.co.uk/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/s/h/sh-figuarts-chichi-1.jpg',
        title: 'Do something!',
        client: userAddress.value.user,
        description:
          'I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!',
        skills: ['skilla', 'skillb'],
        state: 3,
        taker: '',
      },
      {
        id: 1,
        level: 10,
        time: 365,
        reward: 8000,
        difficulty: 2,
        image: '',
        title: 'Do something!',
        client: 'who?',
        description: 'I have no idea you have to figure this out!',
        skills: ['skilla', 'skillb'],
        state: 3,
        taker: userAddress.value.user,
      },
      {
        id: 2,
        level: 8,
        time: 365,
        reward: 80000,
        difficulty: 4,
        image: '',
        title: 'Do something!',
        client: 'who?',
        description: 'I have no idea you have to figure this out!',
        skills: ['skilla', 'skillb'],
        state: 3,
        taker: '',
      },
      {
        id: 3,
        level: 8,
        time: 365,
        reward: 80000,
        difficulty: 4,
        image: '',
        title: 'Do something!',
        client: 'who?',
        description: 'I have no idea you have to figure this out!',
        skills: ['skilla', 'skillb'],
        state: 3,
        taker: '',
      },
      {
        id: 8,
        level: 8,
        time: 365,
        reward: 80000,
        difficulty: 4,
        image: '',
        title: 'Do something!',
        client: 'who?',
        description: 'I have no idea you have to figure this out!',
        skills: ['skilla', 'skillb'],
        state: 3,
        taker: '',
      },
    ];
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
    const deGuild = new web3.eth.Contract(deGuildABI, deGuildAddress);
    function thumbThis(url) {
      const original = url.slice(0, 80);
      const file = url.slice(80);
      return `${original}thumb_${file}`;
    }
    async function fetchSkills(addresses, tokenIds) {
      const skillsOnChain = [];
      for (let index = 0; index < addresses.length; index += 1) {
        const address = addresses[index];
        tokenIds[index].forEach((id) => skillsOnChain.push([address, id]));
      }
      const displayableSkills = await Promise.all(skillsOnChain.map(async (pair) => {
        const manager = new web3.eth.Contract(certificateABI, pair[0]);
        const URI = await manager.methods.tokenURI(pair[1]).call();
        const response = await fetch(URI, { mode: 'cors' });
        const caller = await manager.methods.shop().call();
        const shop = new web3.eth.Contract(certificateABI, caller);
        const shopCaller = await shop.methods.name().call();
        const data = await response.json();

        return {
          name: data.title,
          image: thumbThis(data.url),
          address: data.address,
          tokenId: data.tokenId,
          shopName: shopCaller,
          added: false,
        };
      }));

      return displayableSkills;
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
      selectedOrder: 'asc',
      selectedSort: 'id',
      searchTitle: null,
      level: 5,
      fetching: computed(() => store.state.User.fetching),
    });

    async function getJobsCompleted() {
      store.dispatch('User/setDialog', 'Please wait!');
      store.dispatch('User/setFetching', true);

      const caller = await deGuild.getPastEvents('JobCompleted', {
        filter: { taker: userAddress.value.user },
        fromBlock: 0,
        toBlock: 'latest',
      });
      const history = await Promise.all(
        caller.map((ele) => idToJob(ele.returnValues[0], ele.blockNumber)),
      );
      // console.log(history);
      store.dispatch('User/setFetching', false);

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

    async function fetchTitle() {
      const jobsAdded = await getJobsCompleted();
      const correctRegex = new RegExp(state.searchTitle);

      state.jobs = jobsAdded.filter((job) => correctRegex.test(job.title));
      changedSort();
      store.dispatch(
        'User/setDialog',
        `Here is the list of job titles starting with ${state.searchTitle}.`,
      );
    }

    async function findJobs() {
      // console.log(state.searchTitle);
      // console.log(await getJobsCompleted());
      await fetchTitle();
      // const data = await fetchTitle();
    }

    onBeforeMount(async () => {
      await getJobsCompleted();
      store.dispatch(
        'User/setDialog',
        'Every job you have completed are shown.',
      );
    });

    return {
      state,
      userAddress,
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
