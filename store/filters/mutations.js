import types from '~/constants/filters/private.js';

const mutations = {
  [types.mutations.SET_FILTER](state, { name, type, value }) {
    console.log(name, type, value);
    const filter = state[name];
    filter[type] = value;
  },
  [types.mutations.RESET_FILTER](state, name) {
    const filter = state[name];
    Object.keys(filter).forEach((key) => {
      let f = filter[key];
      let result;
      if (Array.isArray(f)) result = [];
      if (typeof f === 'boolean') result = false;
      if (typeof f === 'string') result = '';
      else f = 0;
      f = result;
    });
  },
  [types.mutations.CLEAR_FILTERS](state) {
    Object.keys(state).forEach((key) =>
      Object.values(state[key]).forEach((v) => (v = []))
    );
  },
};

export default mutations;
