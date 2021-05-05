import types from '~/constants/users/private.js';

const mutations = {
  [types.mutations.SET_USERS](state, users) {
    state.users = users;
  },

  [types.mutations.SET_SELECTED](state, value) {
    state.selected = value;
  },

  [types.mutations.SET_PARAM](state, { param, value }) {
    if (typeof state.queryParams[param] !== undefined) {
      state.queryParams[param] = value;
    }
  },

  [types.mutations.ADD_ROLE](state, { userId, role }) {
    const user = state.users.find((u) => u.id === userId);
    if (user) user.roles.push(role);
  },
  [types.mutations.REMOVE_ROLE](state, { user_id, role_id }) {
    const user = state.users.find((u) => u.id === user_id);
    if (user) {
      const idx = user.roles.findIndex((role) => role.id === role_id);
      if (idx !== -1) user.roles.splice(idx, 1);
    }
  },
  [types.mutations.SET_USERNAME](state, { id, value }) {
    const user = state.users.find((u) => u.id === id);
    if (user) user.username = value;
  },
  [types.mutations.SET_EMAIL](state, { id, value }) {
    const user = state.users.find((u) => u.id === id);
    if (user) user.email = value;
  },
  [types.mutations.SET_USER](state, user) {
    const idx = state.users.findIndex(({ id }) => id === user.id);
    if (idx !== -1) state.users.splice(idx, 1, user);
  },
};

export default mutations;
