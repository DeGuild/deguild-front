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
                min="0"
                oninput="validity.valid||(value='');"
              />
            </div>
            <div class="list-item">
              <span class="number-text">Duration - How long can you wait?</span>
              <input
                v-model="job.duration"
                class="number-input"
                placeholder="days"
                type="number"
                min="1"
                oninput="validity.valid||(value='');"
              />
            </div>
            <div class="list-item">
              <span class="number-text">Bonus - Every taker loves bonus</span>
              <input
                v-model="job.bonus"
                class="number-input"
                placeholder="20 DGC"
                type="number"
                min="0"
                oninput="validity.valid||(value='');"
              />
            </div>
            <div class="list-item">
              <span class="number-text"
                >Difficulty - The harder, the more you pay</span
              >
              <select class="number-input" v-model="job.difficulty">
                <option v-for="i in 5" :key="i" :value="i">
                  {{ i > 4 ? i + ' - Hard' : i === 1 ? i + ' - Easy' : i }}
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
        <button
          @click="navigateTo(1)"
          class="btn next"
          :disabled="
            !job.desc || !job.duration || !job.bonus || !job.level || !job.title
          "
        >
          NEXT
        </button>
      </div>

      <div class="job background" v-show="state.page === 1">
        <div class="title">
          <i class="fa fa-info-circle"></i
          ><span class="title header">Job Preview</span>
        </div>
        <div class="info">
          <img
            class="image"
            :src="
              state.userData.url.slice(0, 125) +
              'thumb_' +
              state.userData.url.slice(125)
            "
          /><img />
          <span>
            <div class="text">
              <h4>{{ job.title }}</h4>
            </div>
            <div class="text client-added">
              <p>{{ state.userData.name }}</p>
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
                v-model="state.skillAdd"
                placeholder="Please specify certificate manager address"
            /></span>
            <span
              ><input
                type="number"
                class="box address-skill"
                v-model="state.skillId"
                oninput="validity.valid||(value='');"
                placeholder="Please specify token id"
            /></span>
            <span
              @click="customAdd()"
              class="btn skill-add"
              v-show="state.skillAdd && state.skillId"
              >Add skill</span
            >
          </div>
        </span>
        <div class="title skill-added">TAKER'S SKILLS</div>

        <span class="fields right-added">
          <div v-for="skill in state.skillsAdded" :key="skill">
            <skill :skill="skill"></skill>
          </div>
        </span>

        <div @click="state.fetching ? null : closeOverlay()" class="close">
          X
        </div>
        <div
          @click="state.fetching ? null : send()"
          class="btn next"
          v-bind:class="{ disabled: state.fetching }"
        >
          DONE
        </div>
        <div
          @click="state.fetching ? null : navigateTo(1)"
          class="btn previous"
          v-bind:class="{ disabled: state.fetching }"
        >
          BACK
        </div>
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
import Web3Token from 'web3-token';
import Skill from '../Display/Skill.vue';

require('dotenv').config();

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

const deGuildABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/DeGuild/V2/IDeGuild+.sol/IDeGuildPlus.json').abi;
const certificateABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/SkillCertificates/V2/ISkillCertificate+.sol/ISkillCertificatePlus.json').abi;

export default defineComponent({
  components: { Skill },
  name: 'JobToAdd',
  emits: ['submit'],
  setup(_, { emit }) {
    // magic dummy, it makes emit works
    const dummy = ref();
    const store = useStore();
    const userAddress = computed(() => store.state.User);
    const web3 = new Web3(window.ethereum);

    const state = reactive({
      userData: computed(() => store.state.User.userProfile),
      skills: [],
      skillsAdded: computed(() => store.state.User.selectedSkills),
      skillSearch: null,
      skillAdd: null,
      skillId: null,
      user: userAddress.value.user,
      page: 0,
      custom: false,
      hasAssign: false,
      fetching: computed(() => store.state.User.fetching),
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

    /**
    * Change the input mode to custom
    */
    function changeMode() {
      state.custom = !state.custom;
    }

    /**
    * Close the job adding overlay
    */
    function closeOverlay() {
      store.dispatch('User/setOverlay', false);
      store.dispatch('User/setReviewJob', null);
    }

    /**
    * Send transaction to add job and store other data in the off-chain storage
    */
    async function send() {
      store.dispatch('User/setFetching', true);
      try {
        const current = store.state.User.selectedSkills;
        const certificateSet = new Set();
        current.forEach((ele) => certificateSet.add(ele.address));
        const certificateArr = Array.from(certificateSet);
        let skillSet = certificateArr.map((ele) => Array.from(current)
          .filter((skill) => skill.address === ele)
          .map((answer) => answer.tokenId));
        if (skillSet.length === 1) {
          skillSet = [skillSet];
        }
        const address = (await web3.eth.getAccounts())[0];
        const deGuild = new web3.eth.Contract(deGuildABI, deGuildAddress);
        const count = await deGuild.methods.jobsCount().call();
        const token = await Web3Token.sign(
          (msg) => web3.eth.personal.sign(msg, address),
          '1d',
        );
        const tokenId = parseInt(count, 10) + 1;
        const requestOptions = {
          method: 'POST',
          headers: { Authorization: token, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: job.title,
            address: deGuildAddress,
            level: job.level,
            tokenId: tokenId.toString(),
            description: job.desc,
            name: 'Parm',
            time: job.duration,
          }),
        };

        await fetch(
          'https://us-central1-deguild-2021.cloudfunctions.net/guild/addJob',
          requestOptions,
        );

        const realAddress = web3.utils.toChecksumAddress(store.state.User.user);
        const taker = web3.utils.isAddress(job.assignee)
          ? web3.utils.toChecksumAddress(job.assignee)
          : '0x0000000000000000000000000000000000000000';

        await deGuild.methods
          .addJob(job.bonus, taker, certificateArr, skillSet, job.difficulty)
          .send({ from: realAddress });

        store.dispatch('User/setOverlay', false);
        store.dispatch('User/setReviewJob', null);
        store.dispatch('User/setFetching', false);
        emit('submit');
      } catch (err) {
        store.dispatch('User/setFetching', false);
      }
    }

    /**
    * When choosing custom skill, this will display a skill to be added to skill list.
    */
    async function customAdd() {
      if (!state.skillAdd || !state.skillId) return;
      try {
        const manager = new web3.eth.Contract(certificateABI, state.skillAdd);
        const URI = await manager.methods.tokenURI(state.skillId).call();
        const response = await fetch(URI, { mode: 'cors' });
        const infoOffChain = await response.json();
        const caller = await manager.methods.shop().call();
        const shop = new web3.eth.Contract(certificateABI, caller);
        const shopCaller = await shop.methods.name().call();
        const toAdd = {
          name: infoOffChain.title,
          image: infoOffChain.url,
          address: infoOffChain.address,
          tokenId: infoOffChain.tokenId,
          shopName: shopCaller,
          added: true,
        };

        const current = store.state.User.selectedSkills;
        let found = false;
        current.forEach((skill) => {
          if (
            skill.address === toAdd.skill.address
            && skill.tokenId === toAdd.skill.tokenId
          ) {
            found = true;
          }
        });
        if (!found) current.add(toAdd);

        store.dispatch('User/setChosenSkills', current);
      } catch (err) {
        store.dispatch(
          'User/setDialog',
          'Seems like that skill does not exist...',
        );
      }
    }

    /**
    * Fetching every skill known in DeGuild from off-chain database
    */
    async function fetchAllSkills() {
      const response = await fetch(
        `https://us-central1-deguild-2021.cloudfunctions.net/app/guildCertificates/${
          state.skillSearch ? state.skillSearch : ''
        }`,
        { mode: 'cors' },
      );
      const result = await response.json();

      state.skills = result;
      store.dispatch('User/setFetching', false);

      return result;
    }

    /**
    * Navigate to page index of `pageIdx`
    *
    *  @param {int} pageIdx page index
    */
    async function navigateTo(pageIdx) {
      state.page = pageIdx;
      if (pageIdx === 2) {
        store.dispatch('User/setFetching', true);

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
      customAdd,
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
  &.client-added {
    font-size: 1vw;
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
  &.disabled {
    cursor: progress;
    color: black;
    background: #d8d8d8;
    &:hover {
      background: #d8d8d8;
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

  }
  &.right {
    left: 31vw;
  }
  &.right-added {
    left: 31vw;
    top: 16vh;
    height: 33vh;

    overflow: auto;

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
