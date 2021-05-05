import types from '~/constants/roles/private.js';

const mutations = {
  [types.mutations.SET_ROLES](state, payload) {
    state.roles = payload;
  },

  [types.mutations.UPDATE_ROLE](state, role) {
    const idx = state.roles.findIndex(({ id }) => id === role.id);
    if (idx !== -1) state.roles.splice(idx, 1, role);
  },

  [types.mutations.SET_SELECTED](state, selected) {
    state.selected = selected;
  },

  [types.mutations.SET_PARAM](state, { param, value }) {
    state.queryParams[param] = value;
  },
};

export default mutations;
