import types from './types/private';
import ftypes from '~/components/filters/store/types/public';
import isFilterTruthy from '~/utilities/isFilterTruthy';
import pickBy from 'lodash/pickBy';

const getters = {
  [types.getters.QUERY_PARAMS]: (state) => (key) =>
    typeof key !== undefined ? state.queryParams[key] : state.queryParams,

  [types.getters.FILTERS]: (state, getters, rootState, rootGetters) => {
    const filters = pickBy(
      rootGetters[ftypes.getters.GET_FILTER]('recruitment'),
      isFilterTruthy
    );
    return Object.keys(filters).length ? filters : null;
  },

  [types.getters.SELECTED]: (state) => state.selected,

  [types.getters.SELECTED_IDS]: (state) => state.selected.map(({ id }) => id),

  [types.getters.ITEMS]: (state) => state.forms,
};

export default getters;
