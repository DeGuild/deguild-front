<template>
  <div class="job">
    <div class="job background dark" v-bind:class="{ smaller: state.smaller }">
      <div
        class="job background light"
        @click="dummy()"
        v-bind:class="{ smaller: state.smaller }"
      >
        <div class="block id">
          <div class="icon">
            <i class="fa fa-hashtag" aria-hidden="true"></i>
          </div>
          <div class="icon value">5</div>
          <div class="icon label">
            <h5>ID</h5>
          </div>
        </div>

        <div class="block level">
          <div class="icon">
            <i class="fas fa-fire"></i>
          </div>
          <div class="icon value">5</div>
          <div class="icon label">
            <h5>LEVEL</h5>
          </div>
        </div>
        <div class="block time">
          <div class="icon">
            <i class="fas fa-stopwatch"></i>
          </div>
          <div class="icon value">365 D</div>
          <div class="icon label">
            <h5>TIME</h5>
          </div>
        </div>
        <div class="block reward">
          <div class="icon">
            <i class="fas fa-hand-holding-usd"></i>
          </div>
          <div class="icon value">50000000</div>
          <div class="icon label">
            <h5>REWARD</h5>
          </div>
        </div>
        <div class="block difficulty"><p>Difficulty: ★★☆☆☆</p></div>
        <img class="image" :src="state.noUrl" />
        <div class="text">
          <h4>Do something!Do something!Do something!Do something!</h4>
        </div>
        <div class="text client"><p>who?who?who?who?who?who?who?</p></div>
        <h3 class="btn" @click="dummy()">CHECK</h3>
        <div class="text description" v-bind:class="{ smaller: state.smaller }">
          <h4>Lrolasjdklfjassdfousdifouasdoifuasoipfuasoifuio</h4>
          <h4>Lrolasjdklfjassdfousdifouasdoifuasoipfuasoifuio</h4>
          <h4>Lrolasjdklfjassdfousdifouasdoifuasoipfuasoifuio</h4>
          <h4>Lrolasjdklfjassdfousdifouasdoifuasoipfuasoifuio</h4>
          <h4>Lrolasjdklfjassdfousdifouasdoifuasoipfuasoifuio</h4>
          <h4>Lrolasjdklfjassdfousdifouasdoifuasoipfuasoifuio</h4>
          <h4>Lrolasjdklfjassdfousdifouasdoifuasoipfuasoifuio</h4>
          <h4>Lrolasjdklfjassdfousdifouasdoifuasoipfuasoifuio</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';

const Web3 = require('web3');

const shopAddress = '0x1B362371f11cAA26B1A993f7Ffd711c0B9966f70';
const magicScrollABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/MagicShop/IMagicScrolls.sol/IMagicScrolls.json').abi;
const skillCertificateABI = require('../../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/SkillCertificates/ISkillCertificate.sol/ISkillCertificate.json').abi;
const noUrl = require('@/assets/no-url.jpg');

export default defineComponent({
  name: 'JobDisplay',
  setup() {
    const store = useStore();
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
    const owner = computed(() => store.state.User.owner);

    const state = reactive({
      smaller: true,
      primary: 'BUY',
      primary2: 'ADD',
      primary3: 'Require prerequisite',
      noUrl,
      addScroll: false,
      showBoth: false,
      showExam: false,
      showAll: false,
      nextPage: false,
      addURL: null,
      addName: null,
      addID: null,
      addPrice: null,
      addHasPrereq: false,
      addPrereq: null,
      addDesc: null,
      addHasLesson: false,
      buying: false,
      adding: false,
      scrollSelected: computed(() => (store.state.User.selectedScroll ? store.state.User.selectedScroll : null)),
      loading: computed(() => store.state.User.fetching),
      pageIdx: 0,
      images: computed(() => (store.state.User.scrollList ? store.state.User.scrollList : [])),
      own: 0,
    });

    function validURL(str) {
      const pattern = new RegExp(
        '^(https?:\\/\\/)?' // protocol
          + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
          + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
          + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
          + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
          + '(\\#[-a-z\\d_]*)?$',
        'i',
      ); // fragment locator
      return !!pattern.test(str);
    }

    const previewUrl = computed(() => (validURL(state.addURL) ? state.addURL : noUrl));

    /**
     * Returns name of the address.
     *
     * @param {address} address The address of any contract using the interface given
     * @return {string} name of the contract.
     */
    async function getName(address) {
      const certificateManager = new web3.eth.Contract(
        skillCertificateABI,
        address,
      );
      const caller = await certificateManager.methods.name().call();
      return caller;
    }

    /**
     * Returns name of the address.
     *
     * @param {address} address The address of any contract using the interface given
     * @return {string} name of the contract.
     */
    async function getTokenType(address) {
      const certificateManager = new web3.eth.Contract(
        skillCertificateABI,
        address,
      );
      const caller = await certificateManager.methods.typeAccepted().call();
      return caller;
    }

    /**
     * Returns whether user is the owner of this shop
     *
     * @param {address} address ethereum address
     * @return {bool} ownership.
     */
    async function getBalanceOf(imageSelected) {
      const magicShop = new web3.eth.Contract(magicScrollABI, shopAddress);
      const realAddress = web3.utils.toChecksumAddress(store.state.User.user);

      try {
        const caller = await magicShop.methods
          .balanceOfOne(realAddress, imageSelected.tokenId)
          .call();
        // console.log(caller);
        return caller;
      } catch (error) {
        // console.error('Not purchasable');
        return {};
      }
    }

    /**
     * Returns name of the address.
     *
     * @param {address} address The address of any contract using the interface given
     * @return {string} name of the contract.
     */
    async function isShopOwnPrerequisite(address) {
      const certificateManager = new web3.eth.Contract(
        skillCertificateABI,
        address,
      );
      const caller = await certificateManager.methods.shop().call();
      return caller === shopAddress;
    }

    /**
     * Returns whether user is the owner of this shop
     *
     * @param {address} address ethereum address
     * @return {bool} ownership.
     */
    async function choosing(imageIdx) {
      state.imageSelected = state.images[imageIdx];
      // console.log(state.imageSelected);
      store.dispatch(
        'User/setDialog',
        'Counting your owned scrolls for this one...',
      );
      state.own = '...';
      state.own = await getBalanceOf(state.imageSelected);

      if (state.imageSelected.purchasable) {
        store.dispatch('User/setDialog', 'Would you like to buy more?');
      } else {
        const prerequisite = await getName(state.imageSelected.prerequisite);
        store.dispatch(
          'User/setDialog',
          `You need to earn ${prerequisite} certificate first!`,
        );
      }
    }

    /**
     * Returns whether user is the owner of this shop
     *
     * @param {address} address ethereum address
     * @return {bool} ownership.
     */
    async function moreInfo() {
      const { prerequisite } = state.imageSelected;
      const confirm = await isShopOwnPrerequisite(prerequisite);
      const type = await getTokenType(prerequisite);
      // console.log(confirm, type, prerequisite);
      if (confirm) {
        await choosing(type);
        store.dispatch(
          'User/setDialog',
          `Please earn the certificate of this scroll, ${state.images[type].name}.`,
        );
      } else {
        store.dispatch(
          'User/setDialog',
          `You are not verified by ${prerequisite}`,
        );
      }
    }

    /**
     * Returns whether user is the owner of this shop
     *
     * @param {address} address ethereum address
     * @return {bool} ownership.
     */
    async function buy() {
      state.primary = "<i class='fas fa-spinner fa-spin'></i>";
      state.buying = true;
      store.dispatch(
        'User/setDialog',
        'We are processing your transaction! It will take a while.',
      );

      const magicShop = new web3.eth.Contract(magicScrollABI, shopAddress);
      const realAddress = web3.utils.toChecksumAddress(store.state.User.user);
      const { tokenId } = state.imageSelected;
      try {
        const caller = await magicShop.methods
          .buyScroll(tokenId)
          .send({ from: realAddress });
        state.primary = 'Buy';
        await choosing(tokenId);
        store.dispatch(
          'User/setDialog',
          'Transaction completed! Thank you for doing business with us~',
        );
        state.buying = false;

        return caller;
      } catch (error) {
        state.primary = 'Buy';
        state.buying = false;

        store.dispatch(
          'User/setDialog',
          'Transaction rejected! Have you changed your mind?',
        );

        return false;
      }
    }

    function addScrollToggle() {
      state.addScroll = true;
      state.imageSelected = null;
      store.dispatch(
        'User/setDialog',
        'What kind of scroll would you like to add?',
      );
    }
    function selectExam() {
      state.addHasLesson = false;
    }
    function selectBoth() {
      state.addHasLesson = true;
    }
    function selectHasPrereq() {
      state.addHasPrereq = !state.addHasPrereq;
    }
    function goNext() {
      state.nextPage = true;
    }
    function goBack() {
      state.nextPage = false;
    }
    function showNext() {
      state.pageIdx += 1;
    }
    function showPrevious() {
      state.pageIdx -= 1;
    }
    function cancelAdd() {
      if (!state.adding) {
        store.dispatch('User/setDialog', 'Cancelled! No scroll will be added!');
      }
      state.addURL = null;
      state.addName = null;
      state.addID = null;
      state.addPrice = null;
      state.addPrereq = null;
      state.addDesc = null;
      state.addScroll = false;
      state.nextPage = false;
    }

    /**
     * Returns whether user is the owner of this shop
     *
     * @param {address} address ethereum address
     * @return {bool} ownership.
     */
    async function addScroll() {
      state.primary2 = "<i class='fas fa-spinner fa-spin'></i>";
      state.adding = true;
      /**
       * TODO: Validate data properly before sending to rinkeby
       * * My suggestion is that we should use vee-validate later
       */
      store.dispatch(
        'User/setDialog',
        'We are processing your transaction! It will take a while.',
      );

      const preRequisite = web3.utils.isAddress(state.addPrereq)
        ? state.addPrereq
        : '0x0000000000000000000000000000000000000000';
      const price = web3.utils.toWei(state.addPrice, 'ether');
      const hasPrerequisite = state.addHasPrereq;
      const hasLesson = state.addHasLesson;

      const magicShop = new web3.eth.Contract(magicScrollABI, shopAddress);
      const realAddress = web3.utils.toChecksumAddress(store.state.User.user);

      try {
        const caller = await magicShop.methods
          .addScroll(preRequisite, hasLesson, hasPrerequisite, price)
          .send({ from: realAddress });
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: state.addURL,
            address: shopAddress,
            tokenId: caller.events.ScrollAdded.returnValues.scrollID,
            name: state.addName,
            courseId: state.addID,
            description: state.addDesc,
          }),
        };
        await fetch(
          'https://us-central1-deguild-2021.cloudfunctions.net/shop/addMagicScroll',
          requestOptions,
        );

        cancelAdd();
        store.dispatch(
          'User/setDialog',
          'Transaction completed! I will tell the customers about it!',
        );
        state.primary2 = 'Add';
        state.adding = false;

        return caller;
      } catch (error) {
        state.primary2 = 'Add';
        state.adding = false;

        store.dispatch(
          'User/setDialog',
          'Transaction rejected! Have you changed your mind?',
        );
        return false;
      }
    }

    function showAll() {
      state.showAll = true;
      state.showExam = false;
      state.showBoth = false;
      state.pageIdx = 0;

      state.images = computed(() => (store.state.User.scrollList ? store.state.User.scrollList : []));
      store.dispatch('User/setDialog', 'All scrolls are shown.');
    }
    function showBoth() {
      state.showBoth = true;
      state.showExam = false;
      state.showAll = false;
      state.pageIdx = 0;

      state.images = computed(() => (store.state.User.scrollList
        ? store.state.User.scrollList.filter((obj) => obj.hasLesson)
        : []));
      store.dispatch(
        'User/setDialog',
        'These scrolls will teach you skills and let you earn certificate.',
      );
    }
    function showExam() {
      state.showExam = true;
      state.showBoth = false;
      state.showAll = false;
      state.pageIdx = 0;

      state.images = computed(() => (store.state.User.scrollList
        ? store.state.User.scrollList.filter((obj) => !obj.hasLesson)
        : []));
      store.dispatch(
        'User/setDialog',
        'These scrolls let you earn certificate, but you do not get to learn the lessons',
      );
    }
    function dummy() {
      console.log('Tested!');
      state.smaller = !state.smaller;
    }

    return {
      state,
      choosing,
      showAll,
      showBoth,
      showExam,
      moreInfo,
      buy,
      addScrollToggle,
      cancelAdd,
      goNext,
      goBack,
      addScroll,
      selectExam,
      selectBoth,
      selectHasPrereq,
      showNext,
      showPrevious,
      dummy,
      owner,
      previewUrl,
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
    height: 24vw;
    position: static;
    background: #593a2d;
    padding-left: unset;
    &.dark {
      &.smaller {
        height: 9vw;
      }
    }
    &.light {
      top: 1vw;
      height: 22vw;
      position: relative;
      cursor: pointer;

      background: #cfb7a1;
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
.text {
  position: absolute;
  width: 20vw;
  height: 2vw;
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
    opacity: 60%;
  }
  &.description {
    width: 54vw;
    height: 13vw;
    top: 8vw;
    left: 1vw;
    padding-left: 1vw;
    overflow: auto;
    background-color: #bba693;
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
</style>
