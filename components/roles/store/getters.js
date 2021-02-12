import types from './types/private';
import isFilterTruthy from '~/utilities/isFilterTruthy';
import pickBy from 'lodash/pickBy';
import ftypes from '~/components/filters/store/types/public';

const getters = {
  [types.getters.ITEMS]: (state) => state.roles,

  [types.getters.SELECTED]: (state) => state.selected,

  [types.getters.SELECTED_IDS]: (state, getters) =>
    getters[types.getters.SELECTED].map(({ id }) => id),

  [types.getters.GET_ROLE]: (state) => (id) =>
    state.roles.find((role) => role.id === id),

  [types.getters.QUERY_PARAMS]: (state) => (key) =>
    typeof key !== undefined ? state.queryParams[key] : state.queryParams,

  [types.getters.FILTERS]: (state, getters, rootState, rootGetters) => {
    const filters = pickBy(
      rootGetters[ftypes.getters.GET_FILTER]('roles'),
      isFilterTruthy
    );
    return Object.keys(filters).length ? filters : null;
  },
};

export default getters;
