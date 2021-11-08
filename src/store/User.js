// eslint-disable-next-line import/prefer-default-export
export const UserModule = {
  namespaced: true,
  state: {
    user: null,
    owner: false,
    jobList: null,
    approval: false,
    jobToFetch: null,
    fetching: false,
    dialog: 'Welcome to DeGuild!',
    overlay: true,
    reviewJob: {
      id: 1,
      level: 10,
      time: 365,
      reward: 8000,
      difficulty: 2,
      image: '',
      title: 'Do something!',
      client: 'who?',
      description: 'I have no idea you have to figure this out!',
      skills: ['skilla', 'skillb'],
      state: 2,
      taker: 'just a taker',
      submitted: true,
      deadline: new Date(1555650125 * 1000),
      status: 'No submission',
    },
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_APPROVAL(state, status) {
      state.approval = status;
    },
    SET_OWNER(state, bool) {
      state.owner = bool;
    },
    SET_JOB_LIST(state, list) {
      state.jobList = list;
    },
    SET_JOB_TO_FETCH(state, scroll) {
      state.jobToFetch = scroll;
    },
    SET_DIALOG(state, text) {
      state.dialog = text;
    },
    SET_FETCHING(state, bool) {
      state.fetching = bool;
    },
    SET_OVERLAY(state, bool) {
      state.overlay = bool;
    },
  },
  actions: {
    reset({ commit }) {
      commit('SET_USER', null);
      commit('SET_OWNER', false);
      commit('SET_JOB_LIST', null);
      commit('SET_APPROVAL', false);
      commit('SET_JOB_TO_FETCH', null);
      commit('SET_FETCHING', false);
      commit('SET_DIALOG', 'Welcome to DeGuild!');
    },
    setUser({ commit }, user) {
      commit('SET_USER', user);
    },
    setDialog({ commit }, text) {
      commit('SET_DIALOG', text);
    },
    setApproval({ commit }, status) {
      commit('SET_APPROVAL', status);
    },
    setOwner({ commit }, bool) {
      commit('SET_OWNER', bool);
    },
    setFetching({ commit }, bool) {
      commit('SET_FETCHING', bool);
    },
    setJobs({ commit }, scrolls) {
      commit('SET_JOB_LIST', scrolls);
    },
    setJobToFetch({ commit }, scroll) {
      commit('SET_JOB_TO_FETCH', scroll);
    },
    setOverlay({ commit }, bool) {
      commit('SET_OVERLAY', bool);
    },
  },
  modules: {},
};
