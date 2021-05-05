import types from '~/constants/filters/private.js';

const getters = {
  [types.getters.GET_FILTER]: (state) => (filter) => state[filter],
};

export default getters;
