<template>
  <div class="overlay"></div>
  <div class="npc"></div>
</template>

<script>
import { useStore } from 'vuex';
import { defineComponent, reactive, computed } from 'vue';

export default defineComponent({
  name: 'Overlay',
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
.npc {
  position: absolute;
  width: 30vw;
  height: 41vw;
  left: 0vw;
  bottom: 0vw;

  background: url('../../assets/npc.webp');
  background-size: cover;
}
.overlay {
  position: absolute;
  top: 0vw;
  left: 0vw;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}
</style>
