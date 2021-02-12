import types from './types/private';

const getters = {
  [types.getters.TEXT]: (state) => state.text,
  [types.getters.DISPLAY]: (state) => !!state.text,
  [types.getters.OPTIONS]: (state) => state.options,
};

export default getters;
