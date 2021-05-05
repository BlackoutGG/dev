import types from '~/constants/roles/private.js';

const actions = {
  async [types.actions.FETCH]({ commit, dispatch, state }) {
    try {
      const { data } = await this.$axios.get('/admin/roles', {
        params: { ...state.queryParams },
      });

      commit(types.mutations.SET_ROLES, data.roles.results);
      commit(types.mutations.SET_PARAM, {
        param: 'total',
        value: data.roles.total,
      });
      this.$toast.show('Content loaded.', { position: 'bottom-center' });
    } catch (err) {
      console.log(err);
      const text = err.message;
      this.$toast.error(text);
    }
  },

  async [types.actions.ADD_ROLE]({ state, commit, dispatch }, payload) {
    const params = { ...payload, ...state.queryParams };
    try {
      const {
        data: { roles },
      } = await this.$axios.post('/roles', params);

      console.log(roles);

      commit(types.mutations.SET_ROLES, roles.results);
      commit(types.mutations.SET_PARAM, { param: 'total', value: roles.total });
      this.$toast.show(`Added Role: ${params.details.name}`, {
        icon: 'check',
        position: 'top-center',
      });
    } catch (err) {
      console.error(err);
      const text = 'Encountered a problem. Please contact the administrator.';
      this.$toast.error(text);
    }
  },

  async [types.actions.CHANGE_ROLE_DETAIL]({ commit }, { id, type, value }) {
    const details = { [type]: value };
    try {
      const { role } = (
        await this.$axios.put(`/admin/roles/${id}`, { details })
      ).data;

      commit(types.mutations.UPDATE_ROLE, role);
    } catch (err) {
      throw err;
    }
  },

  async [types.actions.EDIT_ROLE]({ commit, dispatch }, { id, payload }) {
    try {
      const { role } = (
        await this.$axios.put(`/admin/roles/${id}`, payload)
      ).data;

      commit(types.mutations.UPDATE_ROLE, role);
      this.$toast.success('Changes saved.', {
        icon: 'check',
        position: 'top center',
      });
    } catch (err) {
      console.log(err);
      const text = 'Encountered a problem. Please contact the administrator.';
      this.$toast.error(text, { position: 'top center' });
      throw err;
    }
  },

  async [types.actions.REMOVE_ITEMS]({ commit, state, getters, dispatch }, id) {
    const ids = id ? [id] : getters[types.getters.SELECTED_IDS];
    const params = { ids, ...state.queryparams };

    try {
      const {
        data: { roles },
      } = await this.$axios.delete('/admin/roles', { params });

      commit(types.mutations.SET_ROLES, roles.results);
      commit(types.mutations.SET_SELECTED, []);
      commit(types.mutations.SET_PARAM, {
        param: 'total',
        value: roles.total,
      });
      const text = `Removed roles with the following ids: ${ids}`;
      this.$toast.success(text, { position: 'top center' });
    } catch (err) {
      const code = parseInt(err.response && err.response.status);
      if (code !== 403) {
        console.log(err);
        const text = err.response;
        this.$toast.error(text);
      }
    }
  },
};

export default actions;
