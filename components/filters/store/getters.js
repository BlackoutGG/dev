import types from './types/private';

const getters = {
  [types.getters.GET_FILTER]: (state) => (filter) => state[filter],
};

export default getters;
