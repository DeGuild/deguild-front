<template>
  <div class="review">
    <div class="job">
      <div class="job background" v-show="state.page === 0">
        <div class="title">
          <i class="fa fa-info-circle"></i
          ><span class="title header">Job Description</span>
        </div>
        <div @click="closeOverlay()" class="close">X</div>
        <span class="fields left">
          <div>
            <input
              type="text"
              class="box addTitle"
              placeholder="Please specify Job Title"
            />
          </div>
          <div class="listing">
            <div class="list-item">
              <span class="number-text">Taker Level Recommended</span>
              <input class="number-input" type="number" />
            </div>
            <div class="list-item">
              <span class="number-text">Duration - How long can you wait?</span>
              <input class="number-input" type="number" />
            </div>
            <div class="list-item">
              <span class="number-text">Bonus - Every taker loves bonus</span>
              <input class="number-input" type="number" />
            </div>
            <div class="list-item">
              <span class="number-text"
                >Difficulty - The harder, the more you pay</span
              >
              <select class="number-input">
                <option v-for="i in 5" :key="i">
                  {{ i }}
                </option>
              </select>
            </div>
          </div>
        </span>
        <span class="fields right">
          <textarea
            placeholder="Please specify Job Description"
            class="box desc"
          ></textarea>
        </span>
        <div @click="navigateTo(1)" class="btn next">NEXT</div>
      </div>

      <div class="job background" v-show="state.page === 1">
        <!-- <div class="title">
          <i class="fas fa-project-diagram"></i>

          <span class="title header">Job Requirement</span>
        </div> -->
        <div class="title">
          <i class="fa fa-info-circle"></i
          ><span class="title header">Job Description</span>
        </div>
        <div class="info">
          <img class="image" /><img />
          <span>
            <div class="text">
              <h4>title</h4>
            </div>
            <div class="text client">
              <p>client</p>
            </div>
          </span>
          <span class="block difficulty">
            Difficulty:
            {{ '★'.repeat(0) + '☆'.repeat(5) }}
          </span>
        </div>
        <div class="preview-block difficulty">
          Difficulty:
          {{ '★'.repeat(0) + '☆'.repeat(5) }}
        </div>
        <div @click="closeOverlay()" class="close">X</div>
        <div @click="navigateTo(2)" class="btn next">NEXT</div>
        <div @click="navigateTo(0)" class="btn previous">BACK</div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import Web3 from 'web3';
import Web3Token from 'web3-token';

require('dotenv').config();

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

const deGuildABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/DeGuild/V2/IDeGuild+.sol/IDeGuildPlus.json').abi;

export default defineComponent({
  name: 'JobToAdd',
  setup() {
    const store = useStore();
    const userAddress = computed(() => store.state.User);
    const web3 = new Web3(window.ethereum);
    const deGuild = new web3.eth.Contract(deGuildABI, deGuildAddress);

    const state = reactive({
      user: userAddress.value.user,
      page: 0,
    });

    function navigateTo(pageIdx) {
      state.page = pageIdx;
    }

    return {
      state,
      userAddress,
      navigateTo,
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

.preview-block {
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
  &.client {
    // top: 7.5vw;
    font-size: 1vw;
    opacity: 60%;
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
  color: #754d28;
  background: #fdf1e3;
  font-size: 0.8vw;
  font-weight: 500;
  text-decoration: none;

  cursor: pointer;
  border-radius: 10%;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24);

  &:hover {
    background: #ffd19d;
  }
  &.next {
    position: absolute;
    right: 2vw;
    left: unset;
    bottom: 2vw;
  }
  &.previous {
    position: absolute;
    bottom: 2vw;
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
.fields {
  position: absolute;
  top: 6vw;
  width: 31vw;
  height: 20vw;
  margin-left: 1.5vw;
  &.left {
    left: 0vw;
    // background: black;
  }
  &.right {
    left: 31vw;
    // background: red;
  }
}
.box {
  resize: none;

  font-family: Roboto;
  font-style: normal;
  font-size: 1vw;
  font-weight: 500;
  padding: 0.5vw 0.5vw 0.5vw 0.5vw;

  &.addTitle {
    width: 29.5vw;
    height: 3vh;
  }
  &.desc {
    right: 1vw;
    width: 29vw;
    height: 27vh;
  }
}
.listing {
  display: flexbox;
  padding-top: 1vw;
  margin-top: 1vw;
  height: 20vh;
  background: #eed9d2;
}
.list-item {
  position: relative;

  height: 5vh;
}
.number-input {
  position: absolute;
  margin-left: 3vw;
  right: 1vw;
  width: 5vw;
  height: 2.5vh;
}
.number-text {
  position: absolute;
  margin-left: 1vw;
  height: 3vh;
  width: 22vw;

  font-family: Roboto;
  font-style: normal;
  font-size: 1vw;
  font-weight: 500;
  position: absolute;
  left: 0vw;
  background: #814f21;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
