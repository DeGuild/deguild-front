<template>
  <div class="job">
    <div class="job background" v-bind:class="{ smaller: state.smaller }">
      <div
        class="job background light"
        v-bind:class="{ smaller: state.smaller }"
      >
        <div><h4>level</h4></div>
        <div><h4>id</h4></div>
        <div><h4>time</h4></div>
        <div><h4>reward</h4></div>
        <div><h4>name</h4></div>
        <div><h4>client</h4></div>
        <div><h4>difficulty</h4></div>
        <button>take</button>
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
      styles: [
        {},
        {
          left: '50vw',
          top: '26.406vw',
        },
        {
          left: '61.979vw',
          top: '26.406vw',
        },
        {
          left: '73.958vw',
          top: '26.406vw',
        },
        {
          left: '85.938vw',
          top: '26.406vw',
        },
        {
          left: '50vw',
          top: '38.021vw',
        },
        {
          left: '61.979vw',
          top: '38.021vw',
        },
        {
          left: '73.958vw',
          top: '38.021vw',
        },
        {
          left: '85.938vw',
          top: '38.021vw',
        },
      ],
      stylesFrame: [
        {},
        {
          left: '49.4vw',
          top: '25.9vw',
        },
        {
          left: '61.379vw',
          top: '25.9vw',
        },
        {
          left: '73.358vw',
          top: '25.9vw',
        },
        {
          left: '85.337vw',
          top: '25.9vw',
        },
        {
          left: '49.4vw',
          top: '37.515vw',
        },
        {
          left: '61.379vw',
          top: '37.515vw',
        },
        {
          left: '73.358vw',
          top: '37.515vw',
        },
        {
          left: '85.337vw',
          top: '37.515vw',
        },
      ],
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
      owner,
      previewUrl,
    };
  },
});
</script>

<style scoped lang="scss">
.job {
  position: relative;
  padding-top: 1vw;
  padding-left: 2vw;
  padding-right: 2vw;
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
    height: 24.167vw;
    position: static;
    background: #593a2d;
    padding-left: unset;

    &.light {
      height: 22.167vw;
      position: relative;

      background: #cfb7a1;
      &.smaller {
        height: 8vw;
      }
    }
    &.smaller {
      height: 10vw;
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

  &.text {
    position: absolute;
    width: 20vw;
    height: 6vw;
    left: 13vw;
    top: 4.5vw;

    font-family: Poppins;
    font-weight: bold;
    font-size: 1.302vw;
    line-height: 1.927vw;

    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;

    text-overflow: ellipsis;
    overflow: hidden;
    white-space: normal;

    background: '';
    background-size: cover;
    // background-color: red;
  }
}
</style>
