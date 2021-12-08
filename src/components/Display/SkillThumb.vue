<template>
  <div class="job">
    <div class="job background light" v-bind:class="{ smaller: state.smaller }">
      <img class="image" :src="this.skill.image" />
      <div class="text">
        {{ this.skill.name }}
      </div>
      <div class="text skill-name">
        {{ this.skill.shopName }}
      </div>
    </div>
  </div>
</template>

<script>

import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'SkillDisplay',
  props: ['skill'],
  setup() {
    const store = useStore();
    const userAddress = computed(() => store.state.User);
    const state = reactive({
      smaller: true,
      user: userAddress.value.user,
    });

    return {
      state,
      userAddress,
    };
  },
});
</script>

<style scoped lang="scss">
.image {
  border-radius: 50%;
  height: 3vw;
  width: 3vw;
  top: 1vw;
  left: 1vw;
  position: absolute;
  background: url('../../assets/Spinner-1s-200px.svg') no-repeat center;
}
.job {
  position: relative;
  padding-left: 2vw;
  padding-right: 2vw;
  margin-bottom: 1vh;
  color: #6c421b;

  &.image {
    width: 7.5vw;
    height: 7.5vw;
    position: absolute;
  }
  &.background {
    width: 40vw;
    height: 10vw;
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
      position: relative;

      background: #c57446;
      &.smaller {
        height: 5vw;
      }
    }
  }
}
.text {
  position: absolute;
  width: 35vw;
  height: 2.5vw;
  left: 5vw;
  top: 1.2vw;

  font-family: Roboto;
  font-style: normal;
  font-weight: 900;
  font-size: 1.1vw;
  line-height: 1vw;

  color: #000000;
  align-items: center;
  text-align: left;

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  background-size: cover;
  &.skill-name {
    top: 2.9vw;
    font-size: 0.7vw;
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
  top: 0.5vw;
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
