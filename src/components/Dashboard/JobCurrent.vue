<template>
  <div class="background">
    <div class="display" v-if="!state.fetching && state.job">
      <br />
      <job :job="state.job" @submit="refreshDashboard()"></job>
    </div>
    <div class="display" v-show="state.fetching">
      <img src="@/assets/Spinner-1s-200px.svg" />
    </div>
  </div>
  <div v-if="!state.fetching && state.job">
    <report-job :job="state.job" @submit="refreshDashboard()"></report-job>
  </div>
</template>

<script>

import {
  defineComponent, reactive, computed, onBeforeMount,
} from 'vue';
import { useStore } from 'vuex';
import ReportJob from '../Buttons/ReportJob.vue';
import Job from '../Display/JobAssigned.vue';
import { idToJob } from '../../apis-web3/helpers';

require('dotenv').config();

const Web3 = require('web3');

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

const deGuildABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/DeGuild/V2/IDeGuild+.sol/IDeGuildPlus.json').abi;

export default defineComponent({
  components: { Job, ReportJob },
  name: 'MyTask',
  setup() {
    const store = useStore();
    const userAddress = computed(() => store.state.User.user);
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
    const deGuild = new web3.eth.Contract(deGuildABI, deGuildAddress);

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

    /**
     * Set an array of reported jobs to component state,
     *
     * Algorithm:
     * 1. Fetching data from emitted events of `JobTaken`
     * 2. Also, we display responsive dialouge to tell user of current situation.
     */
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
      if (selected.length > 0) {
        const history = await idToJob(caller, selected[0].blockNumber);
        state.job = history;
        if (state.job.state === 0) {
          store.dispatch(
            'User/setDialog',
            'This is being investigated, please wait for DeGuild master to manage this job.',
          );
        } else if (!state.job.submitted && state.job.note.length > 0) {
          store.dispatch(
            'User/setDialog',
            'Oh! It appears your submission is not quite right.\nPlease look at the feedbacks.',
          );
        } else if (state.job.submitted) {
          store.dispatch(
            'User/setDialog',
            'Submission completed. Your submission is now being reviewed.',
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

    /**
     * Helper function
     */
    function refreshDashboard() {
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
      refreshDashboard,
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
