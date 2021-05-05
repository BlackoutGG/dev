import settingsConstants from '~/constants/settings/public.js';
export const actions = {
  async nuxtServerInit({ commit }) {
    try {
      const { settings } = (await this.$axios.get('/settings')).data;
      commit(settingsConstants.mutations.SET_SETTINGS, settings, {
        root: true,
      });
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  },
};
