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
              v-model="job.title"
              class="box addTitle"
              placeholder="Please specify Job Title"
            />
          </div>
          <div class="listing">
            <div class="list-item">
              <span class="number-text">Taker Level Recommended</span>
              <input
                v-model="job.level"
                class="number-input"
                placeholder="level"
                type="number"
              />
            </div>
            <div class="list-item">
              <span class="number-text">Duration - How long can you wait?</span>
              <input
                v-model="job.duration"
                class="number-input"
                placeholder="days"
                type="number"
              />
            </div>
            <div class="list-item">
              <span class="number-text">Bonus - Every taker loves bonus</span>
              <input
                v-model="job.bonus"
                class="number-input"
                placeholder="20 DGC"
                type="number"
              />
            </div>
            <div class="list-item">
              <span class="number-text"
                >Difficulty - The harder, the more you pay</span
              >
              <select class="number-input" v-model="job.difficulty">
                <option v-for="i in 5" :key="i">
                  {{ i }}
                </option>
              </select>
            </div>
          </div>
        </span>
        <span class="fields right">
          <textarea
            v-model="job.desc"
            placeholder="Please specify Job Description"
            class="box desc"
          ></textarea>
        </span>
        <div class="assign-field">
          <div class="title assign-ask">
            Do you want to assign to specific user?
          </div>
          <input
            v-model="state.hasAssign"
            class="box checkbox"
            type="checkbox"
          />
          <input
            type="text"
            v-model="job.assignee"
            class="box addTitle"
            placeholder="Please specify taker address"
            :disabled="!state.hasAssign"
          />
        </div>
        <div @click="navigateTo(1)" class="btn next">NEXT</div>
      </div>

      <div class="job background" v-show="state.page === 1">
        <div class="title">
          <i class="fa fa-info-circle"></i
          ><span class="title header">Job Preview</span>
        </div>
        <div class="info">
          <img class="image" /><img />
          <span>
            <div class="text">
              <h4>{{ job.title }}</h4>
            </div>
            <div class="text client">
              <p>client</p>
            </div>
          </span>
          <span class="block difficulty">
            Difficulty:
            {{ '★'.repeat(job.difficulty) + '☆'.repeat(5 - job.difficulty) }}
          </span>
        </div>
        <div class="job-info">
          <div class="preview-block level">
            <div class="icon">
              <i class="fas fa-fire"></i>
            </div>
            <div class="icon value">{{ job.level }}</div>
            <div class="icon label">
              <h5>LEVEL</h5>
            </div>
          </div>
          <div class="preview-block time">
            <div class="icon">
              <i class="fas fa-stopwatch"></i>
            </div>
            <div class="icon value">{{ job.duration }} D</div>
            <div class="icon label">
              <h5>TIME</h5>
            </div>
          </div>
          <div class="preview-block reward">
            <div class="icon">
              <i class="fas fa-hand-holding-usd"></i>
            </div>
            <div class="icon value">
              {{ job.difficulty ** 2 * 100 + job.bonus }}
            </div>
            <div class="icon label">
              <h5>REWARD</h5>
            </div>
          </div>
        </div>
        <div class="assignnee-info" v-if="state.hasAssign">
          <div class="title assignnee-text">
            Assigned to: {{ job.assignee }}
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
          <span @click="changeMode()" class="btn skill">SWITCH INPUT MODE</span>
          <div v-show="!state.custom">
            <span
              ><input
                type="text"
                class="box search-skill"
                v-model="state.skillSearch"
                @keyup.enter="state.fetching ? null : fetchAllSkills()"
                placeholder="Please specify skill name"
            /></span>
            <div class="listing skill" v-if="state.fetching">
              <img src="@/assets/Spinner-1s-200px.svg" />
            </div>
            <div class="listing skill" v-if="!state.fetching">
              <div v-for="skill in state.skills" :key="skill">
                <skill :skill="skill"></skill>
              </div>
              <br />
              <br />
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
        <div class="title skill-added">TAKER'S SKILLS</div>

        <span class="fields right-added">
          <div v-for="skill in state.skillsAdded" :key="skill">
            <skill :skill="skill"></skill>
          </div>
        </span>

        <div @click="closeOverlay()" class="close">X</div>
        <div @click="send()" class="btn next">DONE</div>
        <div @click="navigateTo(1)" class="btn previous">BACK</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent, reactive, computed, ref,
} from 'vue';
import { useStore } from 'vuex';
import Web3 from 'web3';
// import Web3Token from 'web3-token';
import Skill from './Skill.vue';

require('dotenv').config();

// const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

// const deGuildABI = require('../../../../DeGuild-
// MG-CS-Token-contracts/artifacts/contracts/DeGuild/V2/IDeGuild+.sol/IDeGuildPlus.json').abi;
const certificateABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/SkillCertificates/V2/ISkillCertificate+.sol/ISkillCertificatePlus.json').abi;

export default defineComponent({
  components: { Skill },
  name: 'JobToAdd',
  setup() {
    // magic dummy, don't delete :P
    const dummy = ref();
    const store = useStore();
    const userAddress = computed(() => store.state.User);
    const web3 = new Web3(window.ethereum);

    const state = reactive({
      skills: [],
      skillsAdded: [],
      skillSearch: null,
      user: userAddress.value.user,
      page: 0,
      custom: false,
      hasAssign: false,
    });

    const job = reactive({
      title: null,
      desc: null,
      level: null,
      duration: null,
      bonus: null,
      difficulty: null,
      assignee: null,
    });

    function changeMode() {
      state.custom = !state.custom;
    }
    function closeOverlay() {
      store.dispatch('User/setOverlay', false);
      store.dispatch('User/setReviewJob', null);
    }
    function send() {
      store.dispatch('User/setOverlay', false);
      store.dispatch('User/setReviewJob', null);
    }

    async function fetchAllSkills() {
      store.dispatch('User/setFetching', true);

      const response = await fetch(
        'https://us-central1-deguild-2021.cloudfunctions.net/app/allCertificates',
        { mode: 'cors' },
      );
      const infoOffChain = await response.json();
      store.dispatch('User/setFetching', false);

      console.log(infoOffChain, state.skillSearch);
      const skills = [];
      infoOffChain.forEach((doc) => {
        doc.forEach((element) => {
          console.log(element.title);
          if (element.title.toLowerCase().startsWith(state.skillSearch ? state.skillSearch.toLowerCase() : '')) {
            skills.push(element);
          }
        });
      });

      state.skills = await Promise.all(
        skills.map(async (ele) => {
          const manager = new web3.eth.Contract(certificateABI, ele.address);
          const caller = await manager.methods.shop().call();
          const shop = new web3.eth.Contract(certificateABI, caller);
          const shopCaller = await shop.methods.name().call();
          return {
            name: ele.title,
            image: ele.url,
            address: ele.address,
            tokenId: ele.tokenId,
            shopName: shopCaller,
            added: false,
          };
        }),
      );
      return skills;
    }

    async function navigateTo(pageIdx) {
      state.page = pageIdx;
      if (pageIdx === 2) {
        console.log('yo');
        await fetchAllSkills();
      }
    }

    return {
      state,
      job,
      userAddress,
      navigateTo,
      closeOverlay,
      changeMode,
      send,
      dummy,
      fetchAllSkills,
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
.assign-field {
  position: absolute;
  bottom: 5vh;
  left: 1vw;
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
  &.skill-added {
    position: absolute;
    font-weight: 900;
    top: 13vh;
    right: 11vw;
    font-size: 1.5vw;
    color: #754d28;
    margin-bottom: 2vh;
  }

  &.assignnee-text {
    position: absolute;
    font-size: 1.2vw;
    top: 4vh;

    color: #754d28;
    margin-bottom: 2vh;
  }
  &.assign-ask {
    top: unset;
    left: -3vw;
    font-size: 1.5vw;
    color: #754d28;
    margin-bottom: 2vh;
  }
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
.assignnee-info {
  height: 4vw;
  top: 40vh;
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
  height: 4vh;
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
    overflow: auto;

    // background: black;
  }
  &.right {
    left: 31vw;
    // background: red;
  }
  &.right-added {
    left: 31vw;
    top: 16vh;
    height: 33vh;

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

  &.checkbox {
    position: relative;
    top: 1vh;
    width: 3vw;
    height: 3vh;
  }

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
    margin-bottom: 1vh;
    height: 22.5vh;
    overflow: auto;
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
