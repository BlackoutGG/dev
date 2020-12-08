import page from '~/utilities/ns/private/page.js';

const state = () => ({
  title: '',
  mobile: false,
  accountChange: false,
  adminPanel: true,
});

const getters = {
  [page.getters.TITLE]: (state) => state.title,
  [page.getters.MOBILE]: (state) => state.mobile,
  [page.getters.ACPANEL]: (state) => state.adminPanel,
  [page.getters.ACCOUNT_CHANGE]: (state) => state.accountChange,
};

const mutations = {
  [page.mutations.SET_TITLE](state, title) {
    state.title = title;
  },
  [page.mutations.SET_MOBILE](state, mobile) {
    state.mobile = mobile;
  },
  [page.mutations.TOGGLE_ACPANEL](state, bool) {
    state.adminPanel = bool;
  },
  [page.mutations.TOGGLE_ACCOUNT_CHANGE_DIALOG](state, bool) {
    state.accountChange = bool;
  },
};

export { state, getters, mutations };
