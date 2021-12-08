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
      <h3 v-if="this.skill.added" @click="remove()" class="btn">REMOVE</h3>
      <h3 v-if="!this.skill.added" @click="add()" class="btn">ADD</h3>
    </div>
  </div>
</template>

<script>

import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'SkillDisplay',
  props: ['skill'],
  setup(props) {
    const store = useStore();
    const userAddress = computed(() => store.state.User);
    const state = reactive({
      smaller: true,
      user: userAddress.value.user,
    });

    /**
    * add this skill to the skill list when adding a job
    */
    function add() {
      const current = store.state.User.selectedSkills;
      const added = {
        name: props.skill.name,
        image: props.skill.image,
        address: props.skill.address,
        tokenId: props.skill.tokenId,
        shopName: props.skill.shopName,
        added: !props.skill.added,
      };
      let found = false;
      current.forEach((skill) => {
        if (
          skill.address === props.skill.address
          && skill.tokenId === props.skill.tokenId
        ) {
          found = true;
        }
      });
      if (!found) current.add(added);

      store.dispatch('User/setChosenSkills', current);
    }

    /**
    * remove this skill to the skill list when adding a job
    */
    function remove() {
      const current = store.state.User.selectedSkills;
      current.forEach((skill) => {
        if (
          skill.address === props.skill.address
          && skill.tokenId === props.skill.tokenId
        ) {
          current.delete(skill);
        }
      });
      store.dispatch('User/setChosenSkills', current);
    }

    return {
      state,
      userAddress,
      add,
      remove,
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
    width: 25vw;
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
      height: 15vw;
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
  width: 16vw;
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
