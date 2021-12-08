<template>

  <div v-if="user !== null">
    <job-admin></job-admin>

  </div>
  <no-wallet v-if="user === null" />
</template>

<script>
import { useStore } from 'vuex';
import { computed, reactive } from 'vue';
import { useHead } from '@vueuse/head';
import NoWallet from '../components/General/NoWallet.vue';
import JobAdmin from '../components/Dashboard/JobAdmin.vue';
// @ is an alias to /src

export default {
  name: 'AdminSite',
  components: {
    NoWallet,
    JobAdmin,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.User.user);
    const wallet = computed(() => store.state.User.approval);
    const overlay = computed(() => store.state.User.overlay);
    const reviewJob = computed(() => store.state.User.reviewJob);

    const siteData = reactive({
      title: 'DeGuild - Admin',
      description: 'Freelancer platform for everyone',
    });
    useHead({
      title: computed(() => siteData.title),
      meta: [
        {
          name: 'description',
          content: computed(() => siteData.description),
        },
      ],
    });
    return {
      user,
      wallet,
      overlay,
      reviewJob,
    };
  },
};
</script>
