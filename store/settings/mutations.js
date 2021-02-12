import types from './types/private.js';
import camelCase from 'lodash/camelCase';

const mutations = {
  [types.mutations.SET_SETTING](state, { key, value }) {
    state[key] = value;
  },
  [types.mutations.SET_SETTINGS](state, settings) {
    Object.keys(settings).forEach((key) => {
      const k = camelCase(key);
      if (typeof state.settings[k] !== undefined) {
        state.settings[k].value = settings[key];
      }
    });
  },
};

export default mutations;
