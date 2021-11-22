// eslint-disable-next-line import/prefer-default-export
export const UserModule = {
  namespaced: true,
  state: {
    user: null,
    userProfile: null,
    occupied: false,
    owner: false,
    jobList: null,
    approval: false,
    jobToFetch: null,
    fetching: false,
    dialog: 'Welcome to DeGuild!',
    overlay: false,
    reviewJob: null,
    selectedSkills: new Set(),
    registered: false,
    update: false,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_USER_PROFILE(state, user) {
      state.userProfile = user;
    },
    SET_APPROVAL(state, status) {
      state.approval = status;
    },
    SET_REGISTRATION(state, status) {
      state.registered = status;
    },
    SET_UPDATE_USER_PROFILE(state, status) {
      state.update = status;
    },
    SET_OWNER(state, bool) {
      state.owner = bool;
    },
    SET_OCCUPIED(state, bool) {
      state.occupied = bool;
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
    SET_REVIEW_JOB(state, job) {
      state.reviewJob = job;
    },
    SET_SELECTED_SKILL(state, array) {
      state.selectedSkills = array;
    },
  },
  actions: {
    reset({ commit }) {
      commit('SET_USER', null);
      commit('SET_OWNER', false);
      commit('SET_OCCUPIED', false);
      commit('SET_JOB_LIST', null);
      commit('SET_APPROVAL', false);
      commit('SET_OVERLAY', false);
      commit('SET_JOB_TO_FETCH', null);
      commit('SET_FETCHING', false);
      commit('SET_DIALOG', 'Welcome to DeGuild!');
      commit('SET_REVIEW_JOB', null);
      commit('SET_REGISTRATION', false);
      commit('SET_USER_PROFILE', null);
      commit('SET_UPDATE_USER_PROFILE', false);
    },
    setUser({ commit }, user) {
      commit('SET_USER', user);
    },
    setUserProfile({ commit }, user) {
      commit('SET_USER_PROFILE', user);
    },
    setDialog({ commit }, text) {
      commit('SET_DIALOG', text);
    },
    setApproval({ commit }, status) {
      commit('SET_APPROVAL', status);
    },
    setOccupied({ commit }, status) {
      commit('SET_OCCUPIED', status);
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
    setReviewJob({ commit }, job) {
      commit('SET_REVIEW_JOB', job);
    },
    setChosenSkills({ commit }, skills) {
      commit('SET_SELECTED_SKILL', skills);
    },
    setRegistration({ commit }, bool) {
      commit('SET_REGISTRATION', bool);
    },
    setUpdateProfile({ commit }, bool) {
      commit('SET_UPDATE_USER_PROFILE', bool);
    },
  },
  modules: {},
};
