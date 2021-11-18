<template>
  <div class="addJob" @click="add">
    <span class="text">
      <i class="fa fa-plus-circle" aria-hidden="true"></i>
    </span>
    <span class="text desc">Add Job</span>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'AddJob',
  setup() {
    const store = useStore();
    const userAddress = computed(() => store.state.User);
    const state = reactive({
      smaller: true,
      user: userAddress.value.user,
    });
    function add() {
      store.dispatch(
        'User/setDialog',
        'What can I do for you today?',
      );
      store.dispatch('User/setOverlay', true);
    }

    return {
      state,
      userAddress,
      add,
    };
  },
});
</script>
<style scoped lang="scss">
.addJob {
  background: #ffffff;
  /* Shadow Blue · 16dp */
  width: 15vw;
  height: 4vw;
  box-shadow:
    0.0vw 0.5vw 0.5vw rgba(0, 0, 0, 0.4);
  border-radius: 2vw;
  position: absolute;
  font-size: 2vw;
  left: 9vw;
  bottom: 18vw;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  :hover {
    cursor: pointer;
  }
}
.text {
        padding-left: 1.5vw;

  font-family: Secular One;
  font-style: normal;
  font-weight: normal;
  font-size: 1.5vw;
  line-height: 3vw;
  color: #6c421b;
}
</style>
