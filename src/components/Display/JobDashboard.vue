<template>
  <div class="background">
    <div class="search"></div>
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

    const state = reactive({
      jobs: [
        {
          id: 1,
          level: 5,
          time: 365,
          reward: 80000,
          difficulty: 4,
          image: 'https://media.kapowtoys.co.uk/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/s/h/sh-figuarts-chichi-1.jpg',
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
      ],
    });

    return {
      state,
      userAddress,
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
  height: 4vw;
  top: 1vw;
  left: 1vw;
  position: relative;
  background: #997c61;
  // padding-bottom: 1vw;
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
