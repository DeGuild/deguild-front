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
            {{ this.job.title }}
          </div>
          <div class="text client-name">
            {{ this.job.clientName }}
          </div>
          <h3 class="btn" @click.stop="judge">JUDGE</h3>
          <h3
            class="btn submission"
            v-show="!state.fetching && !state.notFound"
            v-if="!state.zipUrl"
            @click.stop="adminInvestigate"
          >
            CHECK SUBMISSION
          </h3>

          <a
            class="btn download"
            v-show="!state.fetching && state.zipUrl"
            :href="state.zipUrl"
            @click.stop=""
            download
            >Download
          </a>
          <div
            class="btn no-submission"
            v-show="!state.fetching && state.notFound"
            disabled
          >
            NO SUBMISSION
          </div>
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
  </div>
</template>

<script>
import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import Web3Token from 'web3-token';
import Skill from './SkillThumb.vue';

require('dotenv').config();

const Web3 = require('web3');

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

export default defineComponent({
  name: 'JobReportedDisplay',
  components: { Skill },
  props: ['job'],
  setup(props) {
    const store = useStore();
    const userAddress = computed(() => store.state.User);
    const state = reactive({
      smaller: true,
      user: userAddress.value.user,
      zipUrl: null,
      notFound: null,
    });
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

    /**
    * Extending the reported job component
    */
    function extend() {
      state.smaller = !state.smaller;
    }

    /**
    * Open court component to judge the case according to Admin investigation
    */
    function judge() {
      store.dispatch('User/setReportedJob', this.job);
    }

    /**
    * Fetching the submission file as an evidence
    */
    async function adminInvestigate() {
      store.dispatch('User/setFetching', true);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // getting address from which we will sign message
        const address = (await web3.eth.getAccounts())[0];

        // generating a token with 1 day of expiration time
        const token = await Web3Token.sign(
          (msg) => web3.eth.personal.sign(msg, address),
          '1d',
        );
        const requestOptions = {
          method: 'POST',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            addressTaker: props.job.taker,
            title: props.job.title,
          }),
        };

        const response = await fetch(
          `https://us-central1-deguild-2021.cloudfunctions.net/guild/submission/${deGuildAddress}`,
          requestOptions,
        );
        if (response.status === 200) {
          const data = await response.json();
          state.zipUrl = data.result;
        } else {
          state.notFound = true;
        }
      } catch (err) {
        store.dispatch('User/setFetching', false);
      }
      store.dispatch('User/setFetching', false);
    }

    return {
      state,
      userAddress,
      extend,
      judge,
      adminInvestigate,
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
    left: 30.5vw;
  }
  &.level {
    left: 37vw;
  }
  &.time {
    left: 43.5vw;
  }
  &.reward {
    left: 50vw;
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
    width: 90vw;
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

    &.label {
      position: relative;
      display: unset;
      left: -0.2vw;
      top: -0.35vw;
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
  margin-top: 1vw;
  font-family: Roboto;
  font-weight: 900;
  font-size: 1vw;
  line-height: 1vw;

  color: #000000;
  align-items: center;
  text-align: left;
  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;

  background-size: cover;
  &.client-name {
    top: 1.7vw;
    font-size: 0.7vw;
  }
  &.description {
    width: 90vw;
    height: 26vw;
    top: 1vw;
    left: 0vw;
    padding-left: 2vw;
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
  width: 9vw;
  height: 4vw;
  top: 0vw;
  right: 1vw;
  font-family: Roboto;
  color: #754d28;
  background: #fdf1e3;
  font-size: 1.5vw;
  font-weight: 800;

  cursor: pointer;
  border-radius: 10%;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24);

  &:hover {
    background: #ffd19d;
  }
  &.submission {
    width: 18vw;
    right: 11vw;

    color: #000000;
    background: #ffffff;
  }
  &.no-submission {
    width: 18vw;
    right: 11vw;
    top: 1.5vw;

    color: #ff0000;
    background: #634e4e;

    &:hover {
    background: #634e4e;}
  }
  &.download {
    top: 1.5vw;
    width: 11vw;
    right: 11vw;
    text-decoration: none;

    color: #000000;
    background: #ffffff;
  }
  &.check {
    color: #fdf1e3;
    background: #ca7a30;
  }
}
.icon {
  width: 6vw;
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
  width: 89vw;

  white-space: pre-wrap;
}
</style>
