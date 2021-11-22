<template>
  <div class="job">
    <div
      class="job background dark"
      v-bind:class="{
        smaller: state.smaller,
        exclusive: this.job.taker === state.user && this.job.state === 1,
      }"
    >
      <div
        class="job background light"
        @click="extend()"
        v-bind:class="{
          smaller: state.smaller,
          exclusive: this.job.taker === state.user && this.job.state === 1,
        }"
      >
        <div v-if="state.smaller">
          <div class="block id">
            <div class="icon">
              <i class="fa fa-hashtag" aria-hidden="true"></i>
            </div>
            <div class="icon value">{{ this.job.id }}</div>
            <div class="icon label">
              <h5>ID</h5>
            </div>
          </div>

          <div class="block level">
            <div class="icon">
              <i class="fas fa-fire"></i>
            </div>
            <div class="icon value">{{ this.job.level }}</div>
            <div class="icon label">
              <h5>LEVEL</h5>
            </div>
          </div>
          <div class="block time">
            <div class="icon">
              <i class="fas fa-stopwatch"></i>
            </div>
            <div class="icon value">{{ this.job.time }} D</div>
            <div class="icon label">
              <h5>TIME</h5>
            </div>
          </div>
          <div class="block reward">
            <div class="icon">
              <i class="fas fa-hand-holding-usd"></i>
            </div>
            <div class="icon value">{{ this.job.reward }}</div>
            <div class="icon label">
              <h5>REWARD</h5>
            </div>
          </div>
          <div class="block difficulty">
            <p>
              Difficulty:
              {{
                '★'.repeat(this.job.difficulty) +
                '☆'.repeat(5 - this.job.difficulty)
              }}
            </p>
          </div>
          <img class="image" :src="this.job.image" />
          <div class="text">
            <h4>{{ this.job.title }}</h4>
          </div>
          <div class="text client">
            <p>{{ this.job.clientName }}</p>
          </div>
          <h3
            class="btn"
            @click.stop="review()"
            v-if="
              this.job.client === state.user &&
              this.job.state === 2 &&
              this.job.submitted
            "
          >
            REVIEW
          </h3>
          <h3
            class="btn check"
            @click.stop="review()"
            v-if="this.job.client === state.user && this.job.state === 3"
          >
            CHECK
          </h3>
          <h3
            class="btn delete"
            @click.stop="cancel()"
            v-if="this.job.client === state.user && this.job.state === 1"
          >
            CANCEL
          </h3>
          <h3
            class="btn"
            @click.stop="take()"
            v-if="this.job.state === 1 && this.job.client !== state.user"
          >
            TAKE
          </h3>
        </div>
        <div class="text description" v-bind:class="{ smaller: state.smaller }">
          <h1>CLIENT: {{ this.job.client }}</h1>
          <br />

          <h1>JOB TITLE: {{ this.job.title }}</h1>
          <br />
          <h1>JOB DESCRIPTION:</h1>
          <h2 class="job-description">{{ this.job.description }}</h2>
          <br />

          <h1 v-if="this.job.skills ? this.job.skills.length > 0 : false">
            SKILLS REQUIRED:
          </h1>
          <div v-for="skill in this.job.skills" :key="skill">
            <skill :skill="skill"></skill>
          </div>
          <br />
        </div>
      </div>
    </div>
    <div class="badge" v-if="this.job.submitted && this.job.state === 2">
      <!-- <i class="fas fa-clipboard-check"></i> -->
    </div>
    <div
      class="badge correct"
      v-if="this.job.client === state.user && this.job.state === 3"
    >
      <i class="fa fa-check-circle"></i>
    </div>
    <div class="badge wait" v-if="!this.job.submitted && this.job.state === 2">
      <i class="fa fa-user-clock"></i>
    </div>
    <div
      class="badge for-you"
      v-if="
        this.job.taker === state.user && this.job.state === 1 && state.smaller
      "
    >
      <i class="badge for-you label fas fa-smile-wink"></i>
      <span class="badge for-you label for-you-font">FOR YOU</span>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import Skill from './SkillThumb.vue';

require('dotenv').config();

const Web3 = require('web3');

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

const deGuildABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/DeGuild/V2/IDeGuild+.sol/IDeGuildPlus.json').abi;

export default defineComponent({
  name: 'JobDisplay',
  components: { Skill },
  props: ['job'],
  emits: ['cancel'],
  setup(_, { emit }) {
    const store = useStore();
    const userAddress = computed(() => store.state.User);
    const state = reactive({
      smaller: true,
      user: userAddress.value.user,
    });
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
    const deGuild = new web3.eth.Contract(deGuildABI, deGuildAddress);

    async function take() {
      store.dispatch(
        'User/setDialog',
        'Please wait and I will tell the client that you will be taking this job!',
      );
      store.dispatch('User/setFetching', true);

      const realAddress = web3.utils.toChecksumAddress(store.state.User.user);

      const caller = await deGuild.methods
        .take(this.job.id)
        .send({ from: realAddress });

      store.dispatch(
        'User/setDialog',
        'Done! Please start working on your job early and contact your client as soon as possible',
      );
      store.dispatch('User/setFetching', false);

      this.$router.push('/task');
    }

    async function cancel() {
      store.dispatch('User/setDialog', 'Please wait, we are cancelling this!');
      store.dispatch('User/setFetching', true);

      const realAddress = web3.utils.toChecksumAddress(store.state.User.user);

      const caller = await deGuild.methods
        .cancel(this.job.id)
        .send({ from: realAddress });

      store.dispatch(
        'User/setDialog',
        'Done! Please think twice before posting any job because it will cost you some gas fees.',
      );
      setTimeout(() => {
        emit('cancel');
      }, 1000);
    }

    function extend() {
      state.smaller = !state.smaller;
      // console.log(this.job.client);
    }

    function review() {
      store.dispatch(
        'User/setDialog',
        'Would you like to accept this submission?',
      );
      // console.log(this.job);
      store.dispatch('User/setReviewJob', this.job);
      store.dispatch('User/setOverlay', true);
    }

    return {
      state,
      userAddress,
      take,
      extend,
      review,
      cancel,
    };
  },
});
</script>

<style scoped lang="scss">
.image {
  border-radius: 50%;
  height: 3vw;
  width: 3vw;
  top: 0.4vw;
  left: 1vw;
  position: absolute;
  background: url('../../assets/Spinner-1s-200px.svg') no-repeat center;
}
.block {
  height: 7vw;
  width: 6vw;
  top: 0vw;
  position: absolute;
  background: #eed9d2;
  line-height: 0.4vw;
  color: #919191;
  font-family: Roboto;
  font-style: normal;
  &.id {
    left: 25.5vw;
  }
  &.level {
    left: 32vw;
  }
  &.time {
    left: 38.5vw;
  }
  &.reward {
    left: 45vw;
  }
  &.difficulty {
    background: #fdf1e3;

    height: 2vw;
    width: 10vw;
    left: 1vw;
    top: 4vw;
    padding-left: 1vw;
    font-family: Roboto;
    font-style: normal;
    font-size: 0.8vw;
    justify-content: center;
    align-content: center;
    text-align: left;
    color: #6c421b;
  }
}
.job {
  position: relative;
  // padding-top: 1vw;
  padding-left: 2vw;
  padding-right: 2vw;
  margin-bottom: 1vw;
  color: #6c421b;

  &.selection {
    top: 3.5vw;
    left: -2vw;
    position: absolute;
    &.item {
      top: 0vw;
      left: -3vw;
    }
  }
  &.image {
    width: 7.5vw;
    height: 7.5vw;
    position: absolute;

    &.display {
      position: static;
    }

    &.click {
      cursor: pointer;
      &:hover {
        opacity: 0.9;
      }
    }

    &.selected {
      width: 7.1vw;
      height: 7.1vw;
      left: 4.2vw;
      top: 4.5vw;
    }
  }
  &.background {
    width: 55vw;
    height: 30vw;
    position: static;
    background: #593a2d;
    padding-left: unset;
    &.dark {
      &.exclusive {
        background: #c59d52;
      }
      &.smaller {
        height: 9vw;
      }
    }
    &.light {
      top: 1vw;
      height: 28vw;
      position: relative;
      cursor: pointer;

      background: #cfb7a1;
      &.exclusive {
        background: #ffd381;
      }
      &.smaller {
        height: 7vw;
      }
    }
  }
  &.Button {
    display: flex;
    cursor: pointer;

    width: 5.171vw;
    height: 2.727vw;
    left: 90.292vw;

    top: 49.635vw;
    position: absolute;

    background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.25) 0%,
        rgba(255, 255, 255, 0) 100%
      ),
      #9002ff;
    background-blend-mode: soft-light, normal;
    border-radius: 1.25vw;

    font-family: Poppins;
    font-style: normal;
    font-weight: 900;
    font-size: 1.302vw;
    line-height: 1.927vw;

    align-items: center;
    text-align: center;
    justify-content: center;

    letter-spacing: -0.015em;
    color: #ffffff;

    text-shadow: 0px 2px 4px rgba(91, 26, 26, 0.14),
      0px 3px 4px rgba(123, 12, 12, 0.12), 0px 1px 5px rgba(136, 13, 13, 0.2);
  }
}
.badge {
  position: absolute;
  background: red;
  width: 2vw;
  height: 2vw;
  border-radius: 50%;
  left: 1vw;
  top: -0.5vw;
  font-size: 1.5vw;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  &.correct {
    background: white;

    color: green;
  }
  &.wait {
    background: white;

    color: brown;
    font-size: 1.1vw;
  }
  &.for-you {
    border-left: 2vw;
    display: unset;
    border-radius: unset;
    height: 2vw;
    width: 8vw;
    background: rgb(158, 116, 0);
    color: gold;
    font-size: 1.9vw;
    left: 14.5vw;
    top: 5vw;

    // margin: 0.2vw 0.2vw 0.2vw 0.2vw;
    &.label {
      position: relative;
      display: unset;
      left: -0.2vw;
      top: -0.35vw;
      // margin: 0.2vw 0.2vw 0.2vw 0.2vw;
      background: unset;
      font-size: 1.2vw;
      margin-left: 0.4vw;
      &.for-you-font {
        font-family: Poppins;
        font-style: normal;
        font-weight: 900;
      }
    }
  }
}
.text {
  position: absolute;
  width: 20vw;
  height: 2.5vw;
  left: 5vw;
  top: 0vw;

  font-family: Roboto;
  font-style: normal;
  font-size: 0.9vw;
  line-height: 1vw;

  color: #000000;
  align-items: center;
  text-align: left;

  text-overflow: ellipsis;

  background-size: cover;
  overflow: hidden;
  &.client {
    top: 1.7vw;
    font-size: 0.7vw;
    opacity: 100%;
  }
  &.description {
    width: 54vw;
    height: 26vw;
    top: 1vw;
    left: 1vw;
    padding-left: 1vw;
    overflow: auto;
    &.smaller {
      height: 0vw;
    }
  }
}
.btn {
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 4vw;
  height: 2vw;
  top: 1.4vw;
  right: 1vw;
  font-family: Roboto;
  font-style: normal;
  color: #754d28;
  background: #fdf1e3;
  font-size: 0.8vw;
  font-weight: 500;

  cursor: pointer;
  border-radius: 10%;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24);

  &.delete {
    color: #fdf1e3;
    background: #754d28;
  }
  &.check {
    color: #fdf1e3;
    background: #ca7a30;
  }
  &:hover {
    background: #ffd19d;
  }
}
.icon {
  // background-color: red;
  width: 6vw;
  // height:
  // overflow: hidden;
  text-overflow: ellipsis;
  font-size: 2.5vw;
  margin-top: 1vw;
  &.value {
    font-size: 0.9vw;
  }
  &.label {
    font-size: 0.75vw;
  }
}
.job-description {
  font-family: Roboto;
  font-style: normal;
  font-weight: 100;
  font-size: 1.7vw;
  line-height: 2.2vw;
  white-space: pre-wrap;
}
</style>
