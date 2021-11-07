<template>
  <div class="background">
    <div class="nav">
      <div
        class="nav nav-select job-list icon"
        v-bind:class="{ selected: state.jobList }"
        @click="selectJobList()"
      >
        <i class="fa fa-book"> </i> Job list
      </div>
      <!-- <div
        class="nav nav-select job-list text"
        v-bind:class="{ selected: state.jobList }"
        @click="selectJobList()"
      >
        Job list
      </div> -->
      <div
        class="nav nav-select my-tasks"
        v-bind:class="{ selected: state.myTasks }"
        @click="selectMyTasks()"
      >
        <i class="fa fa-address-card"> </i> My Tasks
      </div>
      <div
        class="nav nav-select job-history"
        v-bind:class="{ selected: state.jobHistory }"
        @click="selectJobHistory()"
      >
        <i class="fa fa-history"> </i> Job History
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const state = reactive({
      jobList: computed(() => useRoute().name === 'Home'),
      myTasks: computed(() => useRoute().name === 'Task'),
      jobHistory: computed(() => useRoute().name === 'History'),
    });

    console.log(useRoute().name);

    function selectJobList() {
      this.$router.push('/');
    }
    function selectMyTasks() {
      this.$router.push('/task');
    }
    function selectJobHistory() {
      this.$router.push('/history');
    }

    return {
      state,
      selectJobList,
      selectMyTasks,
      selectJobHistory,
    };
  },
});
</script>

<style scoped lang="scss">
.background {
  background: url('../../assets/navigation-frame.webp');
  width: 18.646vw;
  height: 16.563vw;
  left: 6.823vw;
  bottom: 1vw;
  position: absolute;
  overflow: auto;
  background-size: cover;
  background-repeat: no-repeat;
}
.nav {
  left: 1.5vw;
  top: 2.5vw;
  position: relative;
  width: 0vw;
  height: 0vw;

  &.nav-select {
    width: 12vw;
    height: 2vw;
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 1.5vw;
    line-height: 2vw;
    text-align: left;
    padding-left: 0.5vw;
    color: black;
    cursor: pointer;
    border-radius: 4px;

    &.job-list {
      transform: translateY(-50%);
      &.icon {
      }
      &.text {
      }
      &.selected {
        font-weight: 600;
        background: #fdf1e3;
        color: #6c421b;
      }
    }

    &.my-tasks {
      &.selected {
        font-weight: 600;
        background: #fdf1e3;
        color: #6c421b;
      }
    }

    &.job-history {
      transform: translateY(50%);
      &.selected {
        font-weight: 600;
        background: #fdf1e3;
        color: #6c421b;
      }
    }
  }
  &.nav-select:hover {
    background: rgba(253, 241, 227, 0.6);
  }
}
</style>
