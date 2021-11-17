<template>
  <div class="review">
    <div class="job">
      <div class="job background" v-show="state.page === 0">
        <div class="title">
          <i class="fa fa-info-circle"></i
          ><span class="title header">Basic Job Description</span>
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
              <input class="number-input" placeholder="level" type="number" />
            </div>
            <div class="list-item">
              <span class="number-text">Duration - How long can you wait?</span>
              <input class="number-input" placeholder="days" type="number" />
            </div>
            <div class="list-item">
              <span class="number-text">Bonus - Every taker loves bonus</span>
              <input class="number-input" placeholder="20 DGC" type="number" />
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
          ><span class="title header">Job Preview</span>
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
        <div class="job-info">
          <div class="preview-block level">
            <div class="icon">
              <i class="fas fa-fire"></i>
            </div>
            <div class="icon value">5</div>
            <div class="icon label">
              <h5>LEVEL</h5>
            </div>
          </div>
          <div class="preview-block time">
            <div class="icon">
              <i class="fas fa-stopwatch"></i>
            </div>
            <div class="icon value">5 D</div>
            <div class="icon label">
              <h5>TIME</h5>
            </div>
          </div>
          <div class="preview-block reward">
            <div class="icon">
              <i class="fas fa-hand-holding-usd"></i>
            </div>
            <div class="icon value">5</div>
            <div class="icon label">
              <h5>REWARD</h5>
            </div>
          </div>
        </div>

        <div @click="closeOverlay()" class="close">X</div>
        <div @click="navigateTo(2)" class="btn next">NEXT</div>
        <div @click="navigateTo(0)" class="btn previous">BACK</div>
      </div>
      <div class="job background" v-show="state.page === 2">
        <div class="title">
          <i class="fas fa-project-diagram"></i>

          <span class="title header">Job Requirement</span>
        </div>
        <span class="fields left">
          <span @click="changeMode()" class="btn skill"
            >SWITCH TO CUSTOM MODE</span
          >
          <div v-show="!state.custom">
            <span
              ><input
                type="text"
                class="box search-skill"
                placeholder="Please specify skill name"
            /></span>
            <div class="listing skill">
              <div v-for="skill in state.skills" :key="skill">
                <skill :skill="skill"></skill>
              </div>
            </div>
          </div>
          <div v-show="state.custom">
            <span
              ><input
                type="text"
                class="box address-skill"
                placeholder="Please specify certificate manager address"
            /></span>
            <span
              ><input
                type="number"
                class="box address-skill"
                placeholder="Please specify token id"
            /></span>
            <span class="btn skill-add">Add skill</span>
          </div>
        </span>
        <span class="fields right-added">
          <div v-for="skill in state.skillsAdded" :key="skill">
            <skill :skill="skill"></skill>
          </div>
        </span>

        <div @click="closeOverlay()" class="close">X</div>
        <div class="btn next">DONE</div>
        <div @click="navigateTo(1)" class="btn previous">BACK</div>
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
import Skill from './Skill.vue';

require('dotenv').config();

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

const deGuildABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/DeGuild/V2/IDeGuild+.sol/IDeGuildPlus.json').abi;

export default defineComponent({
  components: { Skill },
  name: 'JobToAdd',
  setup() {
    const store = useStore();
    const userAddress = computed(() => store.state.User);
    const web3 = new Web3(window.ethereum);
    const deGuild = new web3.eth.Contract(deGuildABI, deGuildAddress);
    const mockSkills = [
      {
        name: 'abc',
        image:
          'https://firebasestorage.googleapis.com/v0/b/deguild-2021.appspot.com/o/images%2F30.png?alt=media',
        address: '123',
        tokenId: '12',
        shopName: 'shop',
      },
      {
        name: 'abc',
        image:
          'https://firebasestorage.googleapis.com/v0/b/deguild-2021.appspot.com/o/images%2F30.png?alt=media',
        address: '123',
        tokenId: '12',
        shopName: 'shop',
      },
      {
        name: 'abc',
        image:
          'https://firebasestorage.googleapis.com/v0/b/deguild-2021.appspot.com/o/images%2F30.png?alt=media',
        address: '123',
        tokenId: '12',
        shopName: 'shop',
      },
      {
        name: 'abc',
        image:
          'https://firebasestorage.googleapis.com/v0/b/deguild-2021.appspot.com/o/images%2F30.png?alt=media',
        address: '123',
        tokenId: '12',
        shopName: 'shop',
      },
      {
        name: 'abc',
        image:
          'https://firebasestorage.googleapis.com/v0/b/deguild-2021.appspot.com/o/images%2F30.png?alt=media',
        address: '123',
        tokenId: '12',
        shopName: 'shop',
      },
      {
        name: 'abc',
        image:
          'https://firebasestorage.googleapis.com/v0/b/deguild-2021.appspot.com/o/images%2F30.png?alt=media',
        address: '123',
        tokenId: '12',
        shopName: 'shop',
      },
    ];

    const state = reactive({
      skills: mockSkills,
      skillsAdded: mockSkills,
      user: userAddress.value.user,
      page: 0,
      custom: false,
    });

    function navigateTo(pageIdx) {
      state.page = pageIdx;
    }
    function changeMode() {
      state.custom = !state.custom;
    }
    function closeOverlay() {
      store.dispatch('User/setOverlay', false);
      store.dispatch('User/setReviewJob', null);
    }

    return {
      state,
      userAddress,
      navigateTo,
      closeOverlay,
      changeMode,
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
  top: 0vw;
  position: relative;
  background: #ffe7ba;
  line-height: 0.4vw;
  color: #919191;
  font-family: Roboto;
  font-style: normal;
  margin-left: 1vw;
}
.job {
  &.background {
    width: 65vw;
    height: 60vh;
    position: static;
    background: #ffffff;
  }
}
.info {
  width: 65vw;
  height: 10vh;
  top: 15vh;
  position: absolute;

  display: flex;
  justify-content: center;
  align-items: center;
}
.job-info {
  height: 4vw;
  top: 30vh;
  position: absolute;
  width: 65vw;

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
  &.skill {
    left: 7.5vw;
    margin-bottom: 2vh;
    width: 15vw;
  }
  &.skill-add {
    left: 11vw;
    margin-bottom: 2vh;
    width: 8vw;
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
  height: 38vh;
  margin-left: 1.5vw;
  &.left {
    left: 0vw;
    height: 38vh;
    overflow: hidden;

    // background: black;
  }
  &.right {
    left: 31vw;
    // background: red;
  }
  &.right-added {
    left: 31vw;
    overflow: auto;

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
  &.search-skill {
    position: relative;
    left: 0vw;
    width: 25vw;
    height: 3vh;
  }
  &.address-skill {
    position: relative;
    left: 0vw;
    margin-bottom: 2vh;
    width: 25vw;
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
  &.skill {
    padding-top: 1vh;
    margin-top: 1vh;
    height: 23vh;
    overflow: auto;
    padding-bottom: 1vh;
  }
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
