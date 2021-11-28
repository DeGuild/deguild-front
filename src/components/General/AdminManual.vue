<template>
  <div class="manual">
    <div class="manual-text">
      <h1>DeGuild Admin Guide</h1>
      <br/>
      <h2>Pattern No.1 - Not talented enough</h2>
      <h4>
        {{ state.manual }}
      </h4>
      <h2>Pattern No.2 - Perma-lock</h2>
      <h4>
        {{ state.manual2 }}
      </h4>
      <h2>Pattern No.3 - Perfectionists</h2>
      <h4>
        {{ state.manual22 }}
      </h4>
      <h2>Pattern No.4 - Abandoning</h2>
      <h4>
        {{ state.manual3 }}
      </h4>
      <h2>Pattern No.5 - Annoying Freelancer</h2>
      <h4>
        {{ state.manual4 }}
      </h4>
      <h2>Pattern No.6 - Annoying Client</h2>
      <h4>
        {{ state.manual5 }}
      </h4>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { defineComponent, reactive, computed } from 'vue';

export default defineComponent({
  name: 'manualueBox',
  setup() {
    const store = useStore();
    const state = reactive({
      manual:
        "If the freelancer submitted the 'uncompleted' job by the deadline,\n then return the amount of money back to the client up to the in-completion of their work with 10% fees.",
      manual2:
        "If the client did not accept the 'completed' job by the deadline,\n then complete the job with 10% fees and ban the client for abandoning the freelancer.",
      manual22:
        'If the stakeholders cannot agree on the completion of the submission,\n then half return the money to each of them (50:50) with 10% fees.',
      manual3:
        'If the job cannot be completed due to special reasons,\n then force cancel the job.',
      manual4:
        'If any freelancer admitted to be a griefer (submitting unrelated files (5+ times), and any other abuse),\n then ban the griefer and revert the job with 5% fees to return the money.',
      manual5:
        'If any client admitted to be a griefer (perma-rejecting (5+ times), and any other abuse),\n then ban the griefer and complete the job with 5% fees to transfer the money.',
      // manual: 'test!est!test!test!test!',
      manualStyle: computed(() => store.state.User.manual.length > 80),
    });

    return {
      state,
    };
  },
});
</script>
<style scoped lang="scss">
.manual {
  position: absolute;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  background: rgb(0, 0, 0, 0.8);
  bottom: 2vh;
  width: 99vw;
  height: 88vh;
  background-size: contain;
  background-repeat: no-repeat;
}
h3 {
  white-space: pre-wrap;
}
.manual-text {
  /* Hi! How can I help you? */

  position: absolute;
  width: 99vw;
  height: 88vh;

  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 1.5vw;
  // line-height: 3vw;
  white-space: pre-wrap;

  // background: red;
  overflow: auto;
  text-overflow: ellipsis;
  color: #ffffff;

  .smaller {
    font-size: 1.2vw;
  }
}
</style>
