import ns from '~/utilities/ns/private/users.js';
import snackbar from '~/utilities/ns/public/snackbar.js';
import roles from '~/utilities/ns/public/roles';

import filter from '~/utilities/ns/public/filters.js';
import pickBy from 'lodash/pickBy';

const state = () => ({
  users: [],
  selected: [],

  queryParams: {
    page: 1,
    limit: 25,
    total: 0,
    sortBy: 'id',
    orderBy: 'ASC',
  },
});

const getters = {
  [ns.getters.USERS]: (state) => state.users,

  [ns.getters.SELECTED]: (state) => state.selected,

  [ns.getters.SELECTED_IDS]: (state) => state.selected.map(({ id }) => id),

  [ns.getters.GET_USER]: (state) => (id) =>
    state.users.find((user) => user.id === id),

  [ns.getters.QUERY_PARAMS]: (state) => (key) =>
    typeof key !== undefined ? state.queryParams[key] : state.queryParams,

  [ns.getters.FILTERS]: (state, getters, rootState, rootGetters) => {
    const filters = rootGetters[filter.getters.GET_FILTER]('users');
    const picked = pickBy(filters, (value, key) => {
      if (Array.isArray(value) && value.length) return true;
      if (typeof value === 'boolean' && value) return true;
    });
    return Object.keys(picked).length ? picked : null;
  },
};

const mutations = {
  [ns.mutations.SET_USERS](state, users) {
    state.users = users;
  },
  [ns.mutations.SET_ROLE_LIST](state, roles) {
    state.roles = roles;
  },
  [ns.mutations.SET_SELECTED](state, value) {
    state.selected = value;
  },
  [ns.mutations.SET_PARAM](state, { param, value }) {
    if (typeof state.queryParams[param] !== undefined) {
      state.queryParams[param] = value;
    }
  },
  [ns.mutations.ADD_ROLE](state, { userId, role }) {
    const user = state.users.find((u) => u.id === userId);
    if (user) user.roles.push(role);
  },
  [ns.mutations.REMOVE_ROLE](state, { user_id, role_id }) {
    const user = state.users.find((u) => u.id === user_id);
    if (user) {
      const idx = user.roles.findIndex((role) => role.id === role_id);
      if (idx !== -1) user.roles.splice(idx, 1);
    }
  },
  [ns.mutations.SET_USERNAME](state, { id, value }) {
    const user = state.users.find((u) => u.id === id);
    if (user) user.username = value;
  },
  [ns.mutations.SET_EMAIL](state, { id, value }) {
    const user = state.users.find((u) => u.id === id);
    if (user) user.email = value;
  },
};

const actions = {
  async [ns.actions.FETCH]({ state, getters, commit, dispatch }) {
    const params = {
      ...state.queryParams,
    };

    const filters = getters[ns.getters.FILTERS];

    if (filters) Object.assign(params, { filters });

    try {
      const { data } = await this.$axios.get('/admin/users', { params });

      if (data.roles) {
        commit(roles.mutations.SET_ROLES, data.roles, { root: true });
      }

      commit(ns.mutations.SET_USERS, data.users.results);
      commit(ns.mutations.SET_PARAM, {
        param: 'total',
        value: data.users.total,
      });
      // dispatch(
      //   snackbar.actions.TOGGLE_BAR,
      //   { text: "Content Loaded." },
      //   { root: true }
      // );
    } catch (err) {
      dispatch(
        snackbar.actions.TOGGLE_BAR,
        { text: err.message },
        { root: true }
      );
    }
  },

  async [ns.actions.ADD_ROLE]({ commit, dispatch }, { userId, roleId }) {
    try {
      const { data } = await this.$axios.put(`/users/${userId}/role`, {
        roleId,
      });
      commit(ns.mutations.ADD_ROLE, {
        userId: data.user.id,
        role: data.user.role,
      });
    } catch (err) {
      dispatch(
        snackbar.actions.TOGGLE_BAR,
        { text: err.message },
        { root: true }
      );
    }
  },

  async [ns.actions.REMOVE_ROLE]({ commit }, { userId, roleId }) {
    const url = `/users/${userId}/role`;
    try {
      const { data } = await this.$axios.delete(url, {
        params: { roleId },
      });

      commit(ns.mutations.REMOVE_ROLE, data.user);
    } catch (err) {}
  },

  async [ns.actions.CHANGE_USER_INFO](
    { commit, dispatch },
    { id, type, value }
  ) {
    try {
      const { data } = await this.$axios.put(`/users/${id}/edit`, {
        [type]: value,
        type,
      });

      const mutation = 'SET_' + data.user.type.toUpperCase();

      commit(ns.mutations[mutation], {
        id: data.user.id,
        value: data.user.value,
      });
    } catch (err) {
      dispatch(
        snackbar.actions.TOGGLE_BAR,
        { text: err.message },
        { root: true }
      );
    }
  },

  async [ns.actions.RESET_PASSWORD]({ commit, dispatch }, id) {},

  async [ns.actions.ADD_USER]({ state, commit, dispatch }, payload) {
    const params = {
      ...payload,
      ...state.queryParams,
    };
    try {
      const { username, users } = (
        await this.$axios.post('/admin/users', params)
      ).data;
      const text = `Created user: ${username}`;

      dispatch(snackbar.actions.TOGGLE_BAR, { text }, { root: true });

      commit(ns.mutations.SET_PARAM, {
        param: 'total',
        value: users.total,
      });
      commit(ns.mutations.SET_USERS, users.results);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  async [ns.actions.REMOVE_ITEMS]({ state, commit, getters }, id) {
    const ids = id ? [id] : getters[ns.getters.SELECTED_IDS];
    const params = { ...state.queryParams, ids };
    try {
      const {
        data: { users },
      } = await this.$axios.delete('/users/delete', { params });

      commit(ns.mutations.SET_USERS, users.results);
      commit(ns.mutations.SET_PARAM, { param: 'total', value: users.total });
      commit(ns.mutations.SET_SELECTED, []);
    } catch (err) {}
  },

  async [ns.actions.EDIT_USER]({ commit, dispatch }, payload) {
    try {
      const url = `/admin/users/${payload.id}/edit`;
      const {
        data: { user },
      } = await this.$axios.put(url, payload.data);

      if (user.inputs && Object.keys(user.inputs).length) {
        Object.keys(user.inputs).forEach((key) => {
          commit(ns.mutations[`SET_${key.toUpperCase()}`], {
            id: user.id,
            value: user.inputs[key],
          });
        });
      }

      if (user.saved && user.saved.length) {
        user.saved.forEach((role) =>
          commit(ns.mutations.ADD_ROLE, {
            userId: user.id,
            role: role,
          })
        );
      }

      if (user.deleted && user.deleted.length) {
        user.deleted.forEach(({ role_id }) =>
          commit(ns.mutations.REMOVE_ROLE, {
            user_id: user.id,
            role_id,
          })
        );
      }

      const text = 'Your changes have saved.';

      dispatch(snackbar.actions.TOGGLE_BAR, { text }, { root: true });
    } catch (err) {
      console.log(err);
      const text =
        'Encountered an error. Please try again or contact the admin.';
      dispatch(snackbar.actions.TOGGLE_BAR, { text }, { root: true });
    }
  },
};

export default { state, getters, mutations, actions };
