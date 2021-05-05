import priv from '~/constants/settings/private.js';
import pick from 'lodash/pick';
const getters = {
  [priv.getters.SETTINGS]: (state) => (settings) => {
    return typeof settings !== undefined && Array.isArray(settings)
      ? pick(state, settings)
      : state;
  },
};

export default getters;
