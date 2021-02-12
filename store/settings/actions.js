import types from './types/private.js';
import snakeCase from 'lodash/snakeCase';

const actions = {
  async [types.actions.SAVE_SETTINGS]({ commit }, payload) {
    const settings = Object.entries(payload).reduce((output, [key, item]) => {
      const k = snakeCase(key);
      output[k] = item.value;
      return output;
    }, {});

    try {
      await this.$axios.patch('/settings', settings);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  async [types.actions.FETCH]({ commit }) {
    try {
      const { settings } = (await this.$axios.get('/settings')).data;
      commit(types.mutations.SET_SETTINGS, settings);
    } catch (err) {
      return Promise.reject(err);
    }
  },
};

export default actions;
