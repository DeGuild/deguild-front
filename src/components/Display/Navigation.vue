<template>
  <div class="background">
    <div class="nav">
      <div
        class="nav nav-select job-list"
        v-bind:class="{ selected: state.jobList }"
        @click="selectJobList()"
      >
      <i class="fa fa-book">
        Job list
      </i>
      </div>
      <div
        class="nav nav-select my-tasks"
        v-bind:class="{ selected: state.myTasks }"
        @click="selectMyTasks()"
      >
      <i class="fa fa-address-card">
      My Tasks
      </i>
      </div>
      <div
        class="nav nav-select job-history"
        v-bind:class="{ selected: state.jobHistory }"
        @click="selectJobHistory()"
      >
      <i class="fa fa-history">
      Job History
      </i>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  setup() {
    const state = reactive({
      jobList: true,
      myTasks: false,
      jobHistory: false,
    });

    function selectJobList() {
      state.jobList = true;
      state.myTasks = false;
      state.jobHistory = false;
    }
    function selectMyTasks() {
      state.jobList = false;
      state.myTasks = true;
      state.jobHistory = false;
    }
    function selectJobHistory() {
      state.jobList = false;
      state.myTasks = false;
      state.jobHistory = true;
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
  top: 35vw;
  position: absolute;
  overflow: auto;
  background-size: cover;
  background-repeat: no-repeat;
}
.nav {
  left: 1.5vw;
  top: 2.5vw;
  position:relative;

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
      &.selected {
      font-weight: 600;
      background: #FDF1E3;
      color: #6C421B;
      }
    }

    &.my-tasks{
      &.selected{
        font-weight: 600;
        background: #FDF1E3;
        color: #6C421B;
      }
    }

    &.job-history{
      transform: translateY(50%);
      &.selected{
        font-weight: 600;
        background: #FDF1E3;
        color: #6C421B;
      }
    }
  }
  &.nav-select:hover {
    background: rgba(253, 241, 227, 0.6);
  }
}

</style>
