<template>
  <div class="background">
    <div class="search">
      <div
        class="search button recommend"
        v-bind:class="{ selected: state.recommend, disabled: state.fetching }"
        @click="state.fetching ? null : selectRecommend()"
      >
        <div class="search icon"><i class="fa fa-star"></i></div>
        Recommend
      </div>
      <div
        class="search button available"
        v-bind:class="{ selected: state.available, disabled: state.fetching }"
        @click="state.fetching ? null : selectAvailable()"
      >
        <div class="search icon"><i class="fas fa-balance-scale"></i></div>
        Available
      </div>
      <div
        class="search button check-post"
        v-bind:class="{ selected: state.posted, disabled: state.fetching }"
        @click="state.fetching ? null : selectPosted()"
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
        @keyup.enter="state.fetching ? null : findJobs()"
        placeholder="Search job title"
      />
    </div>
    <div class="display" v-show="!state.fetching">
      <br />
      <div v-for="job in state.jobs" :key="job.id">
        <job :job="job" @cancel="selectPosted()"></job>
      </div>
    </div>
    <div class="display" v-show="state.fetching">
      <img src="@/assets/Spinner-1s-200px.svg" />
    </div>
  </div>
  <overlay v-if="overlay"> </overlay>
  <job-to-add
    v-if="overlay && !reviewJob"
    @submit="selectPosted()"
  ></job-to-add>
  <job-review
    :job="reviewJob"
    v-if="overlay && reviewJob"
    @submit="selectPosted()"
  ></job-review>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import {
  defineComponent, reactive, computed, onBeforeMount,
} from 'vue';
import { useStore } from 'vuex';

import Overlay from '../General/Overlay.vue';
import JobReview from '../Forms/JobReview.vue';
import JobToAdd from '../Forms/JobToAdd.vue';
import Job from '../Display/Job.vue';

require('dotenv').config();

const Web3 = require('web3');

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

const deGuildABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/DeGuild/V2/IDeGuild+.sol/IDeGuildPlus.json').abi;
const certificateABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/SkillCertificates/V2/ISkillCertificate+.sol/ISkillCertificatePlus.json').abi;
const noImg = require('@/assets/no-url.jpg');

export default defineComponent({
  components: {
    Job,
    Overlay,
    JobReview,
    JobToAdd,
  },
  name: 'JobDashboard',
  setup() {
    const store = useStore();
    const userAddress = computed(() => store.state.User.user);
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
    const deGuild = new web3.eth.Contract(deGuildABI, deGuildAddress);

    const overlay = computed(() => store.state.User.overlay);
    const reviewJob = computed(() => store.state.User.reviewJob);
    function thumbThis(url) {
      const original = url.slice(0, 125);
      const file = url.slice(125);
      return `${original}thumb_${file}`;
    }
    async function fetchSkills(addresses, tokenIds) {
      const skillsOnChain = [];
      for (let index = 0; index < addresses.length; index += 1) {
        const address = addresses[index];
        tokenIds[index].forEach((id) => skillsOnChain.push([address, id]));
      }
      const displayableSkills = await Promise.all(
        skillsOnChain.map(async (pair) => {
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
        }),
      );

      return displayableSkills;
    }

    function addDays(date, days) {
      const result = new Date(date * 1000);
      result.setDate(result.getDate() + days);
      return result;
    }

    async function idToJob(tokenId, blockNumber) {
      try {
        const infoOnChain = await deGuild.methods.jobInfo(tokenId).call();
        const URI = await deGuild.methods.jobURI(tokenId).call();
        const responseOffChain = await fetch(URI, { mode: 'cors' });
        const infoOffChain = await responseOffChain.json();
        const skillsFetched = await fetchSkills(infoOnChain[3], infoOnChain[4]);
        const block = await web3.eth.getBlock(blockNumber);
        const clientProfile = await fetch(
          `https://us-central1-deguild-2021.cloudfunctions.net/app/readProfile/${web3.utils.toChecksumAddress(
            infoOnChain[1],
          )}`,
          { mode: 'cors' },
        );
        let info = {
          name: 'Unknown',
          url: noImg,
        };
        if (clientProfile.status === 200) {
          info = await clientProfile.json();
          info.url = `${info.url.slice(0, 125)}thumb_${info.url.slice(125)}`;
        }
        const { timestamp } = block;
        const jobObject = {
          id: tokenId,
          time: infoOffChain.time,
          reward: web3.utils.fromWei(infoOnChain[0]),
          client: infoOnChain[1],
          clientName: info.name,
          taker: infoOnChain[2],
          skills: skillsFetched,
          state: parseInt(infoOnChain[5], 10),
          difficulty: infoOnChain[6],
          level: parseInt(infoOffChain.level, 10),
          image: info.url,
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
      } catch (err) {
        return {};
      }

      // console.log(infoOffChain);
      // console.log(infoOnChain);
    }
    const state = reactive({
      jobs: null,
      recommend: false,
      available: false,
      posted: false,
      selectedOrder: 'asc',
      selectedSort: 'id',
      searchTitle: null,
      level: 5,
      fetching: computed(() => store.state.User.fetching),
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
        fromBlock: 0,
        toBlock: 'latest',
      });
      const history = await Promise.all(
        caller.map((ele) => idToJob(ele.returnValues[0], ele.blockNumber)),
      );
      // console.log(history);
      state.jobs = history;

      return history;
    }

    async function getJobsPosted() {
      store.dispatch('User/setDialog', 'Please wait!');
      const caller = await deGuild.getPastEvents('JobAdded', {
        filter: { client: userAddress.value },
        fromBlock: 0,
        toBlock: 'latest',
      });
      // console.log(caller);
      const history = await Promise.all(
        caller.map((ele) => idToJob(ele.returnValues[0], ele.blockNumber)),
      );
      // console.log(history);
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
        (job) => job.state === 1
          && job.client !== userAddress.value
          && (job.taker === userAddress.value
            || job.taker === '0x0000000000000000000000000000000000000000'),
      );
      changedSort();
      store.dispatch(
        'User/setDialog',
        'Be careful! Though you can take any job, you might not be able to complete it easily.',
      );
    }

    async function fetchPosted() {
      // const test = await fetch(
      //   `https://us-central1-deguild-2021.cloudfunctions.net/app/postedJobs/${deGuildAddress}/${web3.utils.toChecksumAddress(
      //     userAddress.value,
      //   )}/0/${state.selectedSort}/${state.selectedOrder}/${
      //     state.searchTitle ? state.searchTitle : ''
      //   }`,
      //   { mode: 'cors' },
      // );

      // const testResult = await test.json();
      // console.log(testResult);

      state.jobs = [];
      const jobsAdded = await getJobsPosted();
      state.jobs = jobsAdded.filter((job) => job.client === userAddress.value);
      changedSort();
      store.dispatch(
        'User/setDialog',
        'Your jobs are now being worked on. Please kindly wait for submissions.',
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

      await fetchRecommend();
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
      // console.log(state.searchTitle);
      store.dispatch('User/setFetching', true);

      await fetchTitle();
      store.dispatch('User/setFetching', false);
    }
    onBeforeMount(async () => {
      store.dispatch('User/setFetching', true);
      const occ = await isOccupied(userAddress.value);
      store.dispatch('User/setOccupied', occ);

      // await selectAvailable();
      store.dispatch('User/setFetching', false);
    });

    return {
      state,
      userAddress,
      overlay,
      reviewJob,
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
        &:hover {
          background: #6c421b;
        }
      }
    }
    &.recommend {
      &.selected {
        top: -0.1vw;

        background: #6c421b;
        &:hover {
          background: #6c421b;
        }
      }
    }
    &.check-post {
      left: 12vw;
      &.selected {
        top: -0.1vw;

        background: #6c421b;
        &:hover {
          background: #6c421b;
        }
      }
    }
    &.disabled {
      top: -0.1vw;
      cursor: progress;

      background: #7a7a7a;
      &:hover {
        background: #7a7a7a;
      }
    }
  }
  &.button:hover {
    background: rgba(108, 66, 27, 0.4);
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
