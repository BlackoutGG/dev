import ns from '~/utilities/ns/private/roles.js';
import snackbar from '~/utilities/ns/public/snackbar.js';

const state = () => ({
  roles: [],
  selected: [],

  queryParams: {
    page: 1,
    limit: 25,
    total: 0,
    orderBy: 'DESC',
    sortBy: 'id',
  },
});

const getters = {
  [ns.getters.ROLES]: (state) => state.roles,
  [ns.getters.SELECTED]: (state) => state.selected,
  [ns.getters.SELECTED_IDS]: (state, getters) =>
    getters[ns.getters.SELECTED].map(({ id }) => id),
  [ns.getters.GET_ROLE]: (state) => (id) =>
    state.roles.find((role) => role.id === id),
  [ns.getters.QUERY_PARAMS]: (state) => (key) =>
    typeof key !== undefined ? state.queryParams[key] : state.queryParams,
};

const mutations = {
  [ns.mutations.SET_ROLES](state, payload) {
    state.roles = payload;
  },

  [ns.mutations.UPDATE_ROLE](state, role) {
    const idx = state.roles.findIndex(({ id }) => id === role.id);
    if (idx !== -1) state.roles.splice(idx, 1, role);
  },

  [ns.mutations.SET_SELECTED](state, selected) {
    state.selected = selected;
  },

  [ns.mutations.SET_PARAM](state, { param, value }) {
    state.queryParams[param] = value;
  },
};

const actions = {
  async [ns.actions.FETCH]({ commit, dispatch, state }) {
    try {
      const { data } = await this.$axios.get('/roles', {
        params: { ...state.queryParams },
      });

      commit(ns.mutations.SET_ROLES, data.roles.results);
      commit(ns.mutations.SET_PARAM, {
        param: 'total',
        value: data.roles.total,
      });
    } catch (err) {
      console.log(err);
      const text = err.message;
      dispatch(snackbar.actions.TOGGLE_BAR, { text }, { root: true });
    }
  },

  async [ns.actions.ADD_ROLE]({ state, commit, dispatch }, payload) {
    const params = { ...payload, ...state.queryParams };
    try {
      const {
        data: { roles },
      } = await this.$axios.post('/roles', params);

      const text = `Added Role: ${params.details.name}`;

      console.log(roles);

      commit(ns.mutations.SET_ROLES, roles.results);
      commit(ns.mutations.SET_PARAM, { param: 'total', value: roles.total });
      dispatch(snackbar.actions.TOGGLE_BAR, { text }, { root: true });
    } catch (err) {
      console.error(err);
      const text = 'Encountered a problem. Please contact the administrator.';
      dispatch(snackbar.actions.TOGGLE_BAR, { text }, { root: true });
    }
  },

  async [ns.actions.CHANGE_ROLE_DETAIL]({ commit }, { id, type, value }) {
    const details = { [type]: value };
    try {
      const { role } = (
        await this.$axios.put(`/roles/${id}`, { details })
      ).data;

      commit(ns.mutations.UPDATE_ROLE, role);
    } catch (err) {}
  },

  async [ns.actions.EDIT_ROLE]({ commit, dispatch }, { id, payload }) {
    try {
      const { role } = (await this.$axios.put(`/roles/${id}`, payload)).data;

      commit(ns.mutations.UPDATE_ROLE, role);
      const text = 'Your changes have been saved.';
      dispatch(snackbar.actions.TOGGLE_BAR, { text }, { root: true });

      return Promise.resolve();
    } catch (err) {
      console.log(err);
      const text = 'Encountered a problem. Please contact the administrator.';
      dispatch(snackbar.actions.TOGGLE_BAR, { text }, { root: true });
      return Promise.reject();
    }
  },

  async [ns.actions.REMOVE_ITEMS]({ commit, state, getters, dispatch }, id) {
    const ids = [id] || getters[ns.getters.SELECTED_IDS];
    const params = { ids, ...state.queryparams };
    try {
      const {
        data: { roles },
      } = await this.$axios.delete('/roles', { params });

      console.log(roles);

      commit(ns.mutations.SET_ROLES, roles.results);
      commit(ns.mutations.SET_PARAM, {
        param: 'total',
        value: roles.total,
      });
      const text = `Removed roles with the following ids: ${ids}`;
      dispatch(snackbar.actions.TOGGLE_BAR, { text }, { root: true });
    } catch (err) {
      const code = parseInt(err.response && err.response.status);
      if (code !== 403) {
        console.log(err);
        const text = err.response;
        dispatch(snackbar.actions.TOGGLE_BAR, { text }, { root: true });
      }
    }
  },
};

export default { state, getters, mutations, actions };
