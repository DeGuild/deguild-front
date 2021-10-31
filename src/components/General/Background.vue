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
.dialog {
  position: absolute;
  width: 68vw;
  height: 13.1vw;
  left: 27.24vw;
  top: 4vw;

  background: url('../../assets/dialog.webp');
  background-size: cover;
}
.desk {
  position: absolute;
  width: 35vw;
  height: 20vw;
  left: -2vw;
  top: 32vw;

  background: url('../../assets/counter.webp');
  background-size: cover;
}
.dialog-text {
  /* Share your certificate and show your skill! */
  position: absolute;
  width: 60vw;
  height: 3vw;
  left: 5vw;
  top: 5.5vw;
  font-family: Secular One;
  font-style: normal;
  font-weight: normal;
  font-size: 2.25vw;
  line-height: 3vw;
  color: #ffffff;
  background: '';
  background-size: cover;
  overflow: hidden;
  text-overflow: ellipsis;
  &.smaller {
    font-size: 1.4vw;
  }
}
.npc {
  position: absolute;
  width: 30vw;
  height: 30vw;
  left: 2vw;
  top: 11.563vw;

  background: url('../../assets/npc.webp');
  background-size: cover;
}
</style>
