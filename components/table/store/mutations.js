import types from './types/private';

const defaultQueryParams = {
  page: 1,
  limit: 25,
  total: 0,
  orderBy: 'DESC',
  sortBy: 'id',
};

const mutations = {
  [types.mutations.SET_LIST](state, list) {
    state.items[state.type] = list;
  },
  [types.mutations.SET_SELECTED](state, value) {
    state.selected = value;
  },
  [types.mutations.SET_PARAM](state, { param, value }) {
    state.queryParams[param] = value;
  },
  [types.mutations.UPDATE_ITEM](state, item) {
    const items = state[state.type];
    const idx = items.findIndex(({ id }) => id === item.id);
    if (idx !== -1) items.splice(idx, 1, item);
  },
  [types.mutations.RESET_PARAMS](state) {
    state.queryParams = defaultQueryParams;
  },
  [types.mutations.SET_TYPE](state, type) {
    state.type = type;
  },
};

export default mutations;
