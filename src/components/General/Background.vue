<template>
  <div class="npc"></div>
  <div class="desk"></div>
</template>

<script>
import { useStore } from 'vuex';
import { defineComponent, reactive, computed } from 'vue';

export default defineComponent({
  name: 'Dialog',
  setup() {
    const store = useStore();
    const state = reactive({
      dialog: computed(() => store.state.User.dialog),
      dialogStyle: computed(() => store.state.User.dialog.length > 45),
    });

    return {
      state,
    };
  },
});
</script>
<style scoped lang="scss">
.desk {
  position: absolute;
  width: 35vw;
  height: 19vw;
  left: -2vw;
  bottom: 0vw;

  background: url('../../assets/counter.png');
  background-size: cover;
}
.npc {
  position: absolute;
  width: 25vw;
  height: 25vw;
  left: 2vw;
  bottom: 14vw;

  background: url('../../assets/npc.webp');
  background-size: cover;
}
</style>
