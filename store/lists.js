import ns from '~/utilities/ns/private/lists.js';
import snackbar from '~/utilities/ns/public/snackbar.js';
import pluralize from 'pluralize';
import pick from 'lodash/pick';

const defaultQueryParams = {
  page: 1,
  limit: 25,
  total: 0,
  orderBy: 'DESC',
  sortBy: 'id',
};

const state = () => ({
  items: {
    categories: [],
    tags: [],
  },

  type: '',

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
  [ns.getters.GET_ITEMS]: (state) => (type) => state.items[type],
  [ns.getters.SELECTED]: (state) => state.selected,
  [ns.getters.TYPE]: (state) => state.type,
  [ns.getters.SELECTED_IDS]: (state) => state.selected.map(({ id }) => id),
  [ns.getters.QUERY_PARAMS]: (state) => (key) =>
    typeof key !== undefined ? state.queryParams[key] : state.queryParams,
};

const mutations = {
  [ns.mutations.SET_LIST](state, list) {
    state.items[state.type] = list;
  },
  [ns.mutations.SET_SELECTED](state, value) {
    state.selected = value;
  },
  [ns.mutations.SET_PARAM](state, { param, value }) {
    state.queryParams[param] = value;
  },
  [ns.mutations.UPDATE_ITEM](state, item) {
    const items = state[state.type];
    const idx = items.findIndex(({ id }) => id === item.id);
    if (idx !== -1) items.splice(idx, 1, item);
  },
  [ns.mutations.RESET_PARAMS](state) {
    state.queryParams = defaultQueryParams;
  },
  [ns.mutations.SET_TYPE](state, type) {
    state.type = type;
  },
};

const actions = {
  async [ns.actions.FETCH]({ commit, state }, type) {
    commit(ns.mutations.SET_TYPE, type);
    try {
      const { data } = await this.$axios.get(`/${state.type}`, {
        params: { ...state.queryParams },
      });

      commit(ns.mutations.SET_LIST, data[state.type].results);
      commit(ns.mutations.SET_PARAM, {
        param: 'total',
        value: data[state.type].total,
      });
    } catch (err) {
      console.log(err);
    }
  },

  async [ns.actions.ADD_ITEM]({ commit, state }, item) {
    const params = { name: item, ...state.queryParams };
    try {
      const { data } = await this.$axios.post('/categories', params);

      if (data[state.type].results.length) {
        commit(ns.mutations.SET_LIST, data[state.type].results);
        commit(ns.mutations.SET_PARAM, {
          param: 'total',
          value: data[state.type].total,
        });
      }
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  },

  async [ns.actions.REMOVE_ITEMS]({ commit, state, getters }, id) {
    const ids = id ? [id] : getters[ns.getters.SELECTED_IDS];
    const params = { ...state.queryParams, ids };
    try {
      const { data } = await this.$axios.delete(`/${state.type}`, { params });

      commit(ns.mutations.SET_LIST, data[state.type].results);
      commit(ns.mutations.SET_PARAM, {
        param: 'total',
        value: data[state.type].total,
      });
    } catch (err) {
      console.log(err);
    }
  },

  async [ns.actions.EDIT_ITEM]({ commit }, { id, route, details }) {
    try {
      const data = await this.$axios.put(`/${route}/${id}`, {
        details,
      }).data;

      commit(ns.mutations.UPDATE_ITEM, pick(data, [pluralize.singular(route)]));
    } catch (err) {
      console.log(err);
    }
  },

  [ns.actions.CLEAR_LIST]({ commit }) {
    commit(ns.mutations.RESET_PARAMS);
    commit(ns.mutations.SET_SELECTED, []);
    commit(ns.mutations.SET_LIST, []);
    commit(ns.mutations.SET_TYPE, '');
  },
};

export default { state, getters, mutations, actions };
