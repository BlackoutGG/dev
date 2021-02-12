import types from './types/private';

const defaultOptions = {
  x: null,
  y: 'bottom',
  mode: null,
  color: '#000',
  timeout: 3000,
};

const mutations = {
  [types.mutations.SET_OPTIONS](state, options) {
    if (options) {
      for (let key in options) {
        if (typeof state.options[key] !== undefined) {
          state.options[key] = options[key];
        }
      }
    }
  },
  [types.mutations.RESET_OPTIONS](state) {
    for (let key in defaultOptions) {
      if (typeof state.options[key] !== undefined) {
        state.options[key] = defaultOptions[key];
      }
    }
  },
  [types.mutations.SET_TEXT](state, text) {
    state.text = text;
  },
};

export default mutations;
