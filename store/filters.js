import ns from '~/utilities/ns/private/filters.js';

const state = () => ({
  users: {
    id: [],
  },
  events: {
    category_id: [],
  },
  recruitment: {
    category_id: [],
    status: '',
  },
  forms: {
    category_id: [],
    status: false,
  },
});

const getters = {
  [ns.getters.GET_FILTER]: (state) => (filter) => state[filter],
};

const mutations = {
  [ns.mutations.SET_FILTER](state, { name, type, value }) {
    console.log(name, type, value);
    const filter = state[name];
    filter[type] = value;
  },
  [ns.mutations.RESET_FILTER](state, name) {
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
  [ns.mutations.CLEAR_FILTERS](state) {
    Object.keys(state).forEach((key) =>
      Object.values(state[key]).forEach((v) => (v = []))
    );
  },
};

export default { state, getters, mutations };
