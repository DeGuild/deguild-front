<template>
  <h1 class="text" @click="fetching ? null : showUpdate()">
    <i class="fa fa-cog" aria-hidden="true"></i>
  </h1>
</template>

<script>
import { useStore } from 'vuex';

import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'Profile',
  setup() {
    const store = useStore();

    const user = computed(() => store.state.User.user);
    const current = computed(() => store.state.User.update);
    const fetching = computed(() => store.state.User.fetching);

    /**
     * Brings up the update profile component
     */
    function showUpdate() {
      store.dispatch('User/setUpdateProfile', !current.value);
    }

    return {
      user,
      current,
      fetching,
      showUpdate,
    };
  },
});
</script>
<style scoped lang="scss">
.text {
  color: #ffffff;
  position: absolute;
  right: 2vw;
  font-size: 5vw;
  top: -1.5vw;
  :hover {
    cursor: pointer;
  }
}
</style>
