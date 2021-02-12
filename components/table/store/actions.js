import types from './types/private';
import snacktypes from '~/components/snackbar/store/types/public';
import pluralize from 'pluralize';
import pick from 'lodash/pick';

const actions = {
  async [types.actions.FETCH]({ commit, state }, type) {
    commit(types.mutations.SET_TYPE, type);
    try {
      const { data } = await this.$axios.get(`/${state.type}`, {
        params: { ...state.queryParams },
      });

      commit(types.mutations.SET_LIST, data[state.type].results);
      commit(types.mutations.SET_PARAM, {
        param: 'total',
        value: data[state.type].total,
      });
    } catch (err) {
      console.log(err);
    }
  },

  async [types.actions.ADD_ITEM]({ commit, state }, item) {
    const params = { name: item, ...state.queryParams };
    try {
      const { data } = await this.$axios.post('/categories', params);

      if (data[state.type].results.length) {
        commit(types.mutations.SET_LIST, data[state.type].results);
        commit(types.mutations.SET_PARAM, {
          param: 'total',
          value: data[state.type].total,
        });
      }
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  },

  async [types.actions.REMOVE_ITEMS]({ commit, state, getters }, id) {
    const ids = id ? [id] : getters[types.getters.SELECTED_IDS];
    const params = { ...state.queryParams, ids };
    try {
      const { data } = await this.$axios.delete(`/${state.type}`, { params });

      commit(types.mutations.SET_LIST, data[state.type].results);
      commit(types.mutations.SET_PARAM, {
        param: 'total',
        value: data[state.type].total,
      });
    } catch (err) {
      console.log(err);
    }
  },

  async [types.actions.EDIT_ITEM]({ commit }, { id, route, details }) {
    try {
      const data = await this.$axios.put(`/${route}/${id}`, {
        details,
      }).data;

      commit(
        types.mutations.UPDATE_ITEM,
        pick(data, [pluralize.singular(route)])
      );
    } catch (err) {
      console.log(err);
    }
  },

  [types.actions.CLEAR_LIST]({ commit }) {
    commit(types.mutations.RESET_PARAMS);
    commit(types.mutations.SET_SELECTED, []);
    commit(types.mutations.SET_LIST, []);
    commit(types.mutations.SET_TYPE, '');
  },
};

export default actions;
