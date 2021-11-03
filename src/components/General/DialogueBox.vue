<template>
  <div class="dialog"></div>
  <div class="dialog-text">
    <p v-bind:class="{ smaller: state.dialogStyle }">{{ state.dialog }}</p>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { defineComponent, reactive, computed } from 'vue';

export default defineComponent({
  name: 'DialogueBox',
  setup() {
    const store = useStore();
    const state = reactive({
      dialog: computed(() => store.state.User.dialog),
      // dialog: 'test!est!test!test!test!',
      dialogStyle: computed(() => store.state.User.dialog.length > 80),
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
  background: url('../../assets/dialog.webp');
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

  width: 58vw;
  height: 10vw;
  background-size: contain;
  background-repeat: no-repeat;
}
.dialog-text {
  /* Hi! How can I help you? */

  position: absolute;
  width: 52vw;
  height: 8vw;
  left: 3.5vw;

  font-family: Secular One;
  font-style: normal;
  font-weight: normal;
  font-size: 1.5vw;
  // line-height: 3vw;
  display: flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  // background: red;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #ffffff;

  .smaller {
    font-size: 1.2vw;
  }
}
</style>
