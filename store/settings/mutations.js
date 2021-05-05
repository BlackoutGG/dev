import priv from '~/constants/settings/private.js';
import camelCase from 'lodash/camelCase';

const mutations = {
  // [types.mutations.SET_SETTING](state, { key, value }) {
  //   state.settings[key].value = value;
  // },
  [priv.mutations.SET_SETTINGS](state, settings) {
    console.log(settings);

    Object.keys(settings).forEach((key) => {
      const k = camelCase(key);

      if (state[k] && typeof state[k] !== undefined) {
        state[k].value = settings[key];
      }
    });
  },
};

export default mutations;
