import types from './types/private';
import ftypes from '~/components/filters/store/types/public';
import isFilterTruthy from '~/utilities/isFilterTruthy';
import pickBy from 'lodash/pickBy';

const getters = {
  [types.getters.ITEMS]: (state) => state.users,

  [types.getters.SELECTED]: (state) => state.selected,

  [types.getters.SELECTED_IDS]: (state) => state.selected.map(({ id }) => id),

  [types.getters.GET_USER]: (state) => (id) =>
    state.users.find((user) => user.id === id),

  [types.getters.QUERY_PARAMS]: (state) => (key) =>
    typeof key !== undefined ? state.queryParams[key] : state.queryParams,

  [types.getters.FILTERS]: (state, getters, rootState, rootGetters) => {
    const filters = pickBy(
      rootGetters[ftypes.getters.GET_FILTER]('users'),
      isFilterTruthy
    );
    return Object.keys(filters).length ? filters : null;
  },
};

export default getters;
