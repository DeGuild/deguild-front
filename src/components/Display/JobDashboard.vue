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
      <select class="sorter box-1" name="cars" id="cars">
        <option value="volvo">ID</option>
        <option value="saab">REWARD</option>
        <option value="opel">DIFFICULTY</option>
        <option value="audi">LEVEL</option>
      </select>
      <select class="sorter box-2" name="cars" id="cars">
        <option value="volvo">Ascending</option>
        <option value="saab">Descending</option>
      </select>
      <div class="sorter text"><h2>Sort By</h2></div>

      <div class="searcher icon">
        <p><i class="fa fa-search" aria-hidden="true"></i></p>
      </div>
      <input class="searcher" placeholder="Search job title" />
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
        id: 1,
        level: 5,
        time: 365,
        reward: 80000,
        difficulty: 4,
        image:
          'https://media.kapowtoys.co.uk/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/s/h/sh-figuarts-chichi-1.jpg',
        title: 'Do something!',
        client: 'who?',
        description:
          'I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!I have no idea you have to figure this out!',
        skills: ['skilla', 'skillb'],
      },
      {
        id: 1,
        level: 5,
        time: 365,
        reward: 80000,
        difficulty: 4,
        image: '',
        title: 'Do something!',
        client: 'who?',
        description: 'I have no idea you have to figure this out!',
        skills: ['skilla', 'skillb'],
      },
      {
        id: 1,
        level: 5,
        time: 365,
        reward: 80000,
        difficulty: 4,
        image: '',
        title: 'Do something!',
        client: 'who?',
        description: 'I have no idea you have to figure this out!',
        skills: ['skilla', 'skillb'],
      },
    ];

    function sortJobs() {
      return mockJobs;
    }
    const state = reactive({
      jobs: computed(() => sortJobs()),
      recommend: false,
      available: true,
      posted: false,
    });

    function selectAvailable() {
      state.recommend = false;
      state.available = true;
      state.posted = false;
    }
    function selectRecommend() {
      state.recommend = true;
      state.available = false;
      state.posted = false;
    }
    function selectPosted() {
      state.recommend = false;
      state.available = false;
      state.posted = true;
    }

    return {
      state,
      userAddress,
      selectAvailable,
      selectPosted,
      selectRecommend,
    };
  },
});
</script>

<style scoped lang="scss">
.background {
  width: 63vw;
  height: 42vw;
  position: absolute;
  background: url('../../assets/dashboard-bg.webp');
  left: 35vw;
  top: 9vw;
  overflow: auto;
  background-size: cover;
  background-repeat: no-repeat;
}
.display {
  width: 61vw;
  height: 37vw;
  position: absolute;
  left: 1vw;
  top: 5vw;
  overflow: auto;
}
.search {
  width: 61vw;
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
    height: 3.1vw;
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
    height: 16px;

    right: 35.5vw;
    top: 0.5vw;
    /* Roboto / OVERLINE */
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 10px;
    line-height: 16px;
    /* identical to box height, or 160% */
    display: flex;
    align-items: center;
    letter-spacing: 1.5px;
    text-transform: uppercase;

    /* Gray / 50 */
    color: #787885;

    /* White 100% */
    text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff,
      1px 1px 0 #fff;
  }
}
</style>
