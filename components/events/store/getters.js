import types from './types/private';
// import filterTypes from '~/components/filters/store/types/private';
import filterTypes from '~/utilities/ns/public/filters.js';
import isFilterTruthy from '~/utilities/isFilterTruthy.js';

const getters = {
  [types.getters.ITEMS]: (state, getters) => {
    const filters = getters[filterTypes.getters.FILTERS];
    if (filters && Object.keys(filters).length) {
      return state.events.filter((event) =>
        filters.category_id.includes(event.extendedProps.category_id)
      );
    } else {
      return state.events;
    }
  },

  [types.getters.EVENT_COLORS]: (state) => state.colors,

  [types.getters.GET_EVENT]: (state) => (id) =>
    state.events.find((evt) => evt.id === id),

  [types.getters.FILTERS]: (state, getters, rootState, rootGetters) => {
    const filters = pickBy(
      rootGetters[filter.getters.GET_FILTER]('events'),
      isFilterTruthy
    );

    return Object.keys(filters).length ? filters : null;
  },
};

export default getters;
