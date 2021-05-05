import types from '~/constants/table/private.js';
import { defaultQueryParams } from './state.js';

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
    state.queryParams = defaultQueryParams();
  },
  [types.mutations.SET_TYPE](state, type) {
    state.type = type;
  },
};

export default mutations;
