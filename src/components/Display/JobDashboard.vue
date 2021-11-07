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

import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import Job from './Job.vue';

export default defineComponent({
  components: { Job },
  name: 'JobDashboard',
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
        state: 1,
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
        state: 2,
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
        state: 1,
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
        state: 1,
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
        state: 1,
        taker: '',
      },
    ];

    const state = reactive({
      jobs: mockJobs,
      recommend: false,
      available: true,
      posted: false,
      selectedOrder: 'asc',
      selectedSort: 'id',
      searchTitle: null,
      level: 5,
    });

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
      console.log(state.selectedOrder);
      console.log(state.selectedSort);
      sortJobs();
    }

    async function fetchRecommend() {
      store.dispatch('User/setDialog', 'Please wait!');
      const response = await fetch(
        'https://us-central1-deguild-2021.cloudfunctions.net/shop/allMagicScrolls/',
        { mode: 'cors' },
      );
      state.jobs = mockJobs.filter(
        (job) => job.level - state.level > -2 && job.level - state.level < 1,
      );
      changedSort();
      store.dispatch(
        'User/setDialog',
        'Recommendation from us is based on your level. Please take a look!',
      );
      return response;
    }

    async function fetchAvailable() {
      store.dispatch('User/setDialog', 'Please wait!');
      const response = await fetch(
        'https://us-central1-deguild-2021.cloudfunctions.net/shop/allMagicScrolls/',
        { mode: 'cors' },
      );
      state.jobs = mockJobs.filter((job) => job.state === 1);
      changedSort();
      store.dispatch(
        'User/setDialog',
        'Be careful! Though you can take any job, you might not be able to complete it easily.',
      );
      return response;
    }

    async function fetchPosted() {
      store.dispatch('User/setDialog', 'Please wait!');
      const response = await fetch(
        'https://us-central1-deguild-2021.cloudfunctions.net/shop/allMagicScrolls/',
        { mode: 'cors' },
      );
      state.jobs = mockJobs.filter(
        (job) => job.state === 2 && job.taker === userAddress.value.user,
      );
      changedSort();
      store.dispatch(
        'User/setDialog',
        'You should contact your job taker as soon as possible.',
      );
      return response;
    }

    async function fetchTitle() {
      store.dispatch('User/setDialog', 'Please wait!');
      const response = await fetch(
        'https://us-central1-deguild-2021.cloudfunctions.net/shop/allMagicScrolls/',
        { mode: 'cors' },
      );
      changedSort();
      store.dispatch(
        'User/setDialog',
        `Here is the list of job titles starting with ${state.searchTitle}.`,
      );
      return response;
    }

    async function selectAvailable() {
      state.recommend = false;
      state.available = true;
      state.posted = false;
      const data = await fetchAvailable();
    }
    async function selectRecommend() {
      state.recommend = true;
      state.available = false;
      state.posted = false;
      const data = await fetchRecommend();
    }
    async function selectPosted() {
      state.recommend = false;
      state.available = false;
      state.posted = true;
      const data = await fetchPosted();
    }

    async function findJobs() {
      console.log(state.searchTitle);

      const data = await fetchTitle();
    }

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
  -webkit-box-shadow: inset 0px 0px 0px 1vw #6C421B;
  -moz-box-shadow: inset 0px 0px 0px 1vw #6C421B;
  box-shadow: inset 0px 0px 0px 1vw #6C421B;
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
