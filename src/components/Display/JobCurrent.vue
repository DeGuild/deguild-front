<template>
  <div class="background">
    <div class="display">
      <br />
      <job :job="state.job"></job>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import Job from './JobAssigned.vue';

export default defineComponent({
  components: { Job },
  name: 'MyTask',
  setup() {
    const store = useStore();
    const userAddress = computed(() => store.state.User);
    const mockJob = {
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
      state: 2,
      taker: '',
    };
    const state = reactive({
      job: mockJob,
      recommend: false,
      available: true,
      posted: false,
      selectedOrder: 'asc',
      selectedSort: 'id',
      searchTitle: null,
      level: 5,
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
