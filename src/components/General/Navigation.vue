<template>
  <div class="background" v-if="!state.owner || !state.admin">
    <div class="nav">
      <div
        class="nav nav-select job-list icon"
        v-bind:class="{ selected: state.jobList }"
        @click="selectJobList()"
      >
        <i class="fa fa-book"> </i> <span class="nav nav-select text">Job List</span>
      </div>
      <div
        class="nav nav-select my-tasks"
        v-bind:class="{ selected: state.myTasks }"
        @click="selectMyTasks()"
      >
        <i class="fa fa-address-card"> </i> <span class="nav nav-select text">My Task</span>
      </div>
      <div
        class="nav nav-select job-history"
        v-bind:class="{ selected: state.jobHistory }"
        @click="selectJobHistory()"
      >
        <i class="fa fa-history"> </i> <span class="nav nav-select text">Job History</span>
      </div>
    </div>
  </div>

  <ul v-if="state.owner && state.admin">
    <li>
      <a :class="state.adminClass" @click="this.$router.push('/admin')"
        >Admin Page</a
      >
    </li>
    <li>
      <a :class="state.instructionClass" @click="this.$router.push('/admin/instructions')"
        >Instructions</a
      >
    </li>
    <li><a @click="this.$router.push('/')">Back to DeGuild</a></li>
  </ul>
</template>

<script>
import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const store = useStore();

    const state = reactive({
      jobList: computed(() => useRoute().name === 'Home'),
      myTasks: computed(() => useRoute().name === 'Task'),
      jobHistory: computed(() => useRoute().name === 'History'),
      adminClass: computed(() => (useRoute().name === 'Admin' ? 'active' : null)),
      instructionClass: computed(() => (useRoute().name === 'Instructions' ? 'active' : null)),
      owner: computed(() => store.state.User.owner),
      admin: computed(() => useRoute().name === 'Admin' || useRoute().name === 'Instructions'),
    });

    // console.log(useRoute().name);

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
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}

li {
  float: left;
  & > a {
    display: block;
    color: white;
    text-align: center;
    font-family: Secular One;
    font-style: normal;
    font-weight: normal;
    font-size: 1vw;
    padding: 1.5vw 1.5vw;
    text-decoration: none;
  }
  &:hover:not(.active) {
    background-color: #111;
  }
}

.active {
  background-color: #aa7e04;
}
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

    &.text {
      position: absolute;
      width: 9vw;
      left: 3vw;
      top: 0vw;

      &:hover {
        background: unset;
      }
    }
  }
  &.nav-select:hover {
    background: rgba(253, 241, 227, 0.6);
  }
}
</style>
