import types from '~/constants/settings/private.js';

const actions = {
  async [types.actions.SAVE_SETTINGS]({ commit }, payload) {
    try {
      await this.$axios.patch('/settings', settings);
      this.$toast.success('Settings saved.', {
        icon: 'check',
        position: 'top center',
      });
    } catch (err) {
      return Promise.reject(err);
    }
  },
  async [types.actions.FETCH]({ commit }) {
    try {
      const settings = (await this.$axios.get('/settings')).data;
      console.log(settings);
      commit(priv.mutations.SET_SETTINGS, settings);
    } catch (err) {
      return Promise.reject(err);
    }
  },
};

export default actions;
