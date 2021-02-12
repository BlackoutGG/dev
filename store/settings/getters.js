import types from './types/private.js';
import pick from 'lodash/pick';
const getters = {
  [types.getters.SETTINGS]: (state) => (settings) => {
    return typeof settings !== undefined && Array.isArray(settings)
      ? pick(state.settings, settings)
      : state.settings;
  },
};

export default getters;
