import types from './types/private';
import ftypes from '~/components/filters/store/types/public';
import isFilterTruthy from '~/utilities/isFilterTruthy';
import pickBy from 'lodash/pickBy';

const getters = {
  [types.getters.QUESTIONS]: (state) =>
    state.questions.map((q, idx) => ({ ...q, order: idx })),

  [types.getters.QUERY_PARAMS]: (state) => (key) =>
    typeof key !== undefined ? state.queryParams[key] : state.queryParams,

  [types.getters.VALID_FIELDS]: (state, getters) => {
    return getters.questions
      .map((qs, idx) => {
        const { options, cache, ...field } = qs;
        const validOptions =
          options && options.length ? options.filter((o) => !!o) : null;
        return {
          ...field,
          options: validOptions,
        };
      })
      .filter((qs) => !!qs.value);
  },

  [types.getters.FILTERS]: (state, getters, rootState, rootGetters) => {
    const filters = pickBy(
      rootGetters[ftypes.getters.GET_FILTER]('forms'),
      isFilterTruthy
    );
    return Object.keys(filters).length ? filters : null;
  },

  [types.getters.DESCRIPTION]: (state) => state.description,

  [types.getters.NAME]: (state) => state.name,

  [types.getters.SELECTED]: (state) => state.selected,

  [types.getters.SELECTED_IDS]: (state) => state.selected.map(({ id }) => id),

  [types.getters.ITEMS]: (state) => state.forms,

  [types.getters.CATEGORY]: (state) => state.category_id,
};

export default getters;
