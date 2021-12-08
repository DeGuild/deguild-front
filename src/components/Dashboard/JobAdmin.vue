<template>
  <div class="background">
    <div class="search">
      <div
        class="search button recommend"
        v-bind:class="{ selected: state.reported, disabled: state.fetching }"
        @click="state.fetching ? null : selectAvailable()"
      >
        <div class="search icon"><i class="fa fa-star"></i></div>
        Reported
      </div>
      <div v-if="state.jobs">
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
    </div>

    <div class="display" v-show="!state.fetching">
      <br />
      <div v-for="job in state.jobs" :key="job.id">
        <job :job="job"></job>
      </div>
    </div>
    <div class="display" v-show="state.fetching">
      <img src="@/assets/Spinner-1s-200px.svg" />
    </div>
  </div>
  <job-court
    :title="'Judge'"
    v-if="state.reportedJob"
    @decided="selectAvailable()"
  ></job-court>
</template>

<script>
import {
  defineComponent, reactive, computed, onBeforeMount,
} from 'vue';
import { useStore } from 'vuex';

import Job from '../Display/JobReported.vue';
import JobCourt from '../Forms/JobCourt.vue';
import { idToJob } from '../../apis-web3/helpers';

require('dotenv').config();

const Web3 = require('web3');

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

const deGuildABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/DeGuild/V2/IDeGuild+.sol/IDeGuildPlus.json').abi;

export default defineComponent({
  components: {
    Job,
    JobCourt,
  },
  name: 'JobAdmin',
  setup() {
    const store = useStore();
    const userAddress = computed(() => store.state.User.user);
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
    const deGuild = new web3.eth.Contract(deGuildABI, deGuildAddress);

    const overlay = computed(() => store.state.User.overlay);
    const examiningJob = computed(() => store.state.User.reportedJob);

    const state = reactive({
      jobs: null,
      jobsSaved: null,
      reported: false,
      available: false,
      posted: false,
      selectedOrder: 'asc',
      selectedSort: 'id',
      searchTitle: null,
      level: 5,
      fetching: computed(() => store.state.User.fetching),
      reportedJob: computed(() => store.state.User.reportedJob),
    });

    /**
     * Returns an array of reported jobs, fetching data from emitted events of `JobCaseOpened`
     *
     * @return {Object[]} an array of reported jobs.
     */
    async function getJobsReported() {
      store.dispatch('User/setDialog', 'Please wait!');
      const caller = await deGuild.getPastEvents('JobCaseOpened', {
        fromBlock: 0,
        toBlock: 'latest',
      });
      const history = await Promise.all(
        caller.map((ele) => idToJob(ele.returnValues[0], ele.blockNumber)),
      );
      state.jobs = history;

      return history;
    }

    /**
     * Sorting jobs display in the site (Client-side)
     */
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

    /**
     * Helper function
     */
    function changedSort() {
      sortJobs();
    }

    /**
     * Fetch reported jobs to be displayed and sort
     */
    async function fetchReportedCases() {
      const jobsAdded = await getJobsReported();
      state.jobs = jobsAdded.filter((job) => job.state === 0);
      changedSort();
    }

    /**
     * Fetch reported jobs and display only matched title (using RegEx)
     */
    async function fetchTitle() {
      if (store.state.User.occupied) {
        store.dispatch(
          'User/setDialog',
          'Please finish your current job before taking a new job',
        );
        return;
      }
      const correctRegex = new RegExp(state.searchTitle);
      if (state.jobsSaved) {
        state.jobs = state.jobsSaved.filter((job) => correctRegex.test(job.title));
      } else {
        state.jobsSaved = state.jobs;
        state.jobs = state.jobs.filter((job) => correctRegex.test(job.title));
      }
      changedSort();
      store.dispatch(
        'User/setDialog',
        `Here is the list of job titles starting with ${state.searchTitle}.`,
      );
    }

    /**
     * Fetch available reported jobs
     */
    async function selectAvailable() {
      state.reported = true;
      store.dispatch('User/setFetching', true);

      await fetchReportedCases();
      store.dispatch('User/setFetching', false);
    }

    /**
     * Fetch available reported jobs from title searched
     */
    async function findJobs() {
      store.dispatch('User/setFetching', true);

      await fetchTitle();
      store.dispatch('User/setFetching', false);
    }

    onBeforeMount(async () => {
      store.dispatch('User/setFetching', true);

      await selectAvailable();
      store.dispatch('User/setFetching', false);
    });

    return {
      state,
      userAddress,
      overlay,
      examiningJob,
      selectAvailable,
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
  width: 98vw;
  height: 87vh;
  position: absolute;
  background: url('../../assets/dashboard-bg.png');
  left: 1vw;
  bottom: 2vh;
  overflow: auto;
  background-size: cover;
  background-repeat: no-repeat;
}
.display {
  width: 96vw;
  height: 75vh;
  position: absolute;
  left: 1vw;
  top: 10vh;
  overflow: auto;
}
.search {
  width: 96vw;
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

  &.icon {
    width: unset;
    height: unset;
    left: 0vw;
    top: 0vw;
    font-size: 1.5vw;
    padding-top: 0.5vw;
    padding-bottom: 0.25vw;
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
