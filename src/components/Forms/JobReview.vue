<template>
  <div class="review">
    <div class="job">
      <div class="job background">
        <div class="title">
          <i class="fa fa-eye"></i><span class="title header">Job Review</span>
        </div>
        <div @click="state.fetching ? null : closeOverlay()" class="close">
          X
        </div>

        <div class="info">
          <img class="image" :src="this.job.image" /><img />
          <span>
            <div class="text">
              <h4>{{ this.job.title }}</h4>
            </div>
            <div class="text client-review">
              <p>{{ this.job.client }}</p>
            </div>
          </span>
          <span class="block difficulty">
            Difficulty:
            {{
              '★'.repeat(this.job.difficulty) +
              '☆'.repeat(5 - this.job.difficulty)
            }}
          </span>
        </div>
        <div class="file">
          <i class="fas fa-paperclip"></i>
          <span class="file header">{{ this.job.submission }}</span>
          <span class="file header" v-if="this.job.submission.length === 0">
            NO SUBMISSION</span
          >

          <span
            class="btn"
            @click="generateLink()"
            v-if="this.job.submission.length > 0"
            v-show="!state.fetching && !state.zipUrl"
            >Get Link
          </span>
          <img
            class="btn disabled"
            v-if="this.job.submission.length > 0"
            v-show="state.fetching"
            src="@/assets/Spinner-1s-200px.svg"
          />
          <a
            class="btn"
            v-if="this.job.submission.length > 0"
            v-show="!state.fetching && state.zipUrl"
            :href="state.zipUrl"
            download
            >Download
          </a>
        </div>
        <!-- <div class="file" v-if="state.zipUrl">
          <a class="btn" :href="state.zipUrl" download>Download </a>
        </div> -->
        <div class="decision" v-if="this.job.state === 2">
          <span>
            <textarea
              class="decision comment"
              type="text"
              v-model="state.comment"
              placeholder="Leave your comment to reject or press accept to complete this job"
            />
          </span>

          <button
            v-if="!state.comment"
            class="decision say accept"
            @click="state.fetching ? null : complete()"
          >
            ACCEPT
          </button>
          <button
            v-if="state.comment"
            class="decision say reject"
            @click="state.fetching ? null : rejectSubmission()"
          >
            REJECT
          </button>
        </div>
      </div>
    </div>
  </div>
  <report-job :job="this.job" @submit="emit('submit')"></report-job>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import {
  defineComponent, reactive, computed, ref,
} from 'vue';
import { useStore } from 'vuex';
import Web3 from 'web3';
import Web3Token from 'web3-token';
import ReportJob from '../Buttons/ReportJob.vue';

require('dotenv').config();

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

const deGuildABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/DeGuild/V2/IDeGuild+.sol/IDeGuildPlus.json').abi;

export default defineComponent({
  components: { ReportJob },
  name: 'JobReview',
  props: ['job'],
  emits: ['submit'],
  setup(props, { emit }) {
    const dummy = ref();

    const store = useStore();
    const userAddress = computed(() => store.state.User);
    const isSubmitted = computed(() => props.job.submitted);
    const web3 = new Web3(window.ethereum);
    const deGuild = new web3.eth.Contract(deGuildABI, deGuildAddress);

    const hour = computed(() => (props.job.deadline.getHours() <= 9
      ? `0${props.job.deadline.getHours()}`
      : props.job.deadline.getHours()));
    const minutes = computed(() => (props.job.deadline.getMinutes() <= 9
      ? `0${props.job.deadline.getMinutes()}`
      : props.job.deadline.getMinutes()));
    // console.log(isSubmitted);
    const state = reactive({
      user: userAddress.value.user,
      submitted: isSubmitted.value,
      fetching: computed(() => store.state.User.fetching),

      time: `${hour.value}:${minutes.value}`,
      zipUrl: null,
    });

    async function generateLink() {
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
          method: 'GET',
          // eslint-disable-next-line quote-props
          headers: { Authorization: token },
        };

        const response = await fetch(
          `https://us-central1-deguild-2021.cloudfunctions.net/guild/submission/${deGuildAddress}/${this.job.id}`,
          requestOptions,
        );
        const data = await response.json();
        // console.log(data);
        state.zipUrl = data.result;
      } catch (err) {
        store.dispatch('User/setFetching', false);
      }
      store.dispatch('User/setFetching', false);
    }

    function closeOverlay() {
      store.dispatch('User/setOverlay', false);
      store.dispatch('User/setReviewJob', null);
      emit('submit');
    }

    async function rejectSubmission() {
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
          method: 'PUT',
          // eslint-disable-next-line quote-props
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: deGuildAddress,
            tokenId: this.job.id,
            submission: '',
            note: state.comment,
          }),
        };

        const response = await fetch(
          'https://us-central1-deguild-2021.cloudfunctions.net/guild/submit',
          requestOptions,
        );
        const data = await response.json();
        state.zipUrl = data.result;
        emit('submit');

        closeOverlay();
      } catch (err) {
        store.dispatch('User/setFetching', false);
      }
    }

    async function complete() {
      store.dispatch('User/setFetching', true);

      try {
        store.dispatch(
          'User/setDialog',
          'Please wait! We are processing your transaction.',
        );
        const realAddress = web3.utils.toChecksumAddress(store.state.User.user);
        const caller = await deGuild.methods
          .complete(this.job.id)
          .send({ from: realAddress });
        store.dispatch(
          'User/setDialog',
          'Hope you like our service! Visit us again next time~',
        );
        emit('submit');
        closeOverlay();
      } catch {
        store.dispatch('User/setFetching', false);
      }
    }

    return {
      state,
      userAddress,
      closeOverlay,
      generateLink,
      complete,
      rejectSubmission,
    };
  },
});
</script>

<style scoped lang="scss">
.close {
  position: absolute;
  background: unset;
  right: 1vw;
  top: 1vw;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 1vw;
  height: 1vw;
  font-family: Roboto;
  font-style: normal;
  color: #754d28;
  font-size: 2vw;
  font-weight: 500;

  cursor: pointer;
  border-radius: 10%;
}
.title {
  font-family: Roboto;
  font-style: normal;
  font-size: 3vw;
  line-height: 1vw;
  top: 1.5vw;
  position: relative;

  color: #747474;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  &.header {
    font-size: 2.5vw;
    top: unset;
    color: #000000;
    left: 1vw;
  }
}
.review {
  position: absolute;
  left: 30vw;
  top: 12vw;
}
.image {
  border-radius: 50%;
  height: 4vw;
  width: 4vw;
  position: relative;
  background: url('../../assets/Spinner-1s-200px.svg') no-repeat center;
}
.decision {
  position: relative;
  margin-top: 14vw;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Roboto;
  font-style: normal;
  font-size: 0.8vw;
  font-weight: 500;
  &.comment {
    margin-top: unset;

    width: 35vw;
    height: 3vw;
    resize: none;
    font-size: 1vw;
  }
  &.say {
    margin-top: unset;

    margin-left: 2vw;
    width: 8vw;
    height: 3vw;

    cursor: pointer;
    border-radius: 10%;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24);

    &.accept {
      color: #287528;
      background: #e3fdee;
      &:hover {
        background: #b6ffd4;
      }
    }
    &.reject {
      // top: 1vw;
      color: #752828;
      background: #fde3e3;

      &:hover {
        background: rgb(255, 196, 129);
      }
    }
  }
}
.block {
  position: relative;
  font-family: Roboto;
  font-style: normal;
  margin-left: 4vw;
  &.difficulty {
    background: #fdf1e3;
    height: 4vw;
    width: 15vw;
    // top: 2.5vw;
    font-family: Roboto;
    font-style: normal;
    font-size: 1.2vw;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: left;
    color: #6c421b;
  }
}
.job {
  &.background {
    width: 65vw;
    height: 50vh;
    position: static;
    background: #ffffff;
  }
}
.info {
  width: 65vw;
  height: 4vw;
  top: 7vw;
  position: absolute;

  display: flex;
  justify-content: center;
  align-items: center;
}
.text {
  position: relative;
  max-width: 30vw;
  height: 3vw;
  margin-left: 1vw;

  font-family: Roboto;
  font-style: normal;
  font-size: 1.2vw;
  line-height: 0.4vw;

  color: #000000;
  align-items: center;
  text-align: left;

  text-overflow: ellipsis;

  background-size: cover;
  overflow: hidden;
  &.client-review {
    // top: 7.5vw;
    font-size: 1vw;
  }
}
.file {
  font-family: Roboto;
  font-style: normal;
  font-size: 2vw;
  line-height: 1vw;
  top: 10vw;
  position: relative;
  height: 2vw;

  color: #747474;
  display: flex;
  align-items: center;
  justify-content: center;
  &.header {
    font-size: 1vw;
    max-width: 40vw;
    padding-top: 1vw;
    display: unset;
    overflow: hidden;
    white-space: nowrap;
    top: unset;
    color: #000000;
    left: 1vw;
  }
}
.btn {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  left: 2vw;
  width: 5vw;
  height: 2vw;
  font-family: Roboto;
  font-style: normal;
  color: #ffffff;
  background: #754d28;
  font-size: 0.8vw;
  font-weight: 500;
  text-decoration: none;

  cursor: pointer;
  border-radius: 10%;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24);

  &:hover {
    background: #8d5d2f;
  }
  &.disabled {
    cursor: wait;

    &:hover {
      background: #754d28;
    }
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
</style>
