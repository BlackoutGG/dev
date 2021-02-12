import types from './types/private';
import snack from '~/components/snackbar/store/types/public';

const actions = {
  async [types.actions.FETCH]({ commit, dispatch, state }) {
    try {
      const { data } = await this.$axios.get('/roles', {
        params: { ...state.queryParams },
      });

      commit(types.mutations.SET_ROLES, data.roles.results);
      commit(types.mutations.SET_PARAM, {
        param: 'total',
        value: data.roles.total,
      });
    } catch (err) {
      console.log(err);
      const text = err.message;
      dispatch(snack.actions.TOGGLE_BAR, { text }, { root: true });
    }
  },

  async [types.actions.ADD_ROLE]({ state, commit, dispatch }, payload) {
    const params = { ...payload, ...state.queryParams };
    try {
      const {
        data: { roles },
      } = await this.$axios.post('/roles', params);

      const text = `Added Role: ${params.details.name}`;

      console.log(roles);

      commit(types.mutations.SET_ROLES, roles.results);
      commit(types.mutations.SET_PARAM, { param: 'total', value: roles.total });
      dispatch(snack.actions.TOGGLE_BAR, { text }, { root: true });
    } catch (err) {
      console.error(err);
      const text = 'Encountered a problem. Please contact the administrator.';
      dispatch(snack.actions.TOGGLE_BAR, { text }, { root: true });
    }
  },

  async [types.actions.CHANGE_ROLE_DETAIL]({ commit }, { id, type, value }) {
    const details = { [type]: value };
    try {
      const { role } = (
        await this.$axios.put(`/roles/${id}`, { details })
      ).data;

      commit(types.mutations.UPDATE_ROLE, role);
    } catch (err) {
      throw err;
    }
  },

  async [types.actions.EDIT_ROLE]({ commit, dispatch }, { id, payload }) {
    try {
      const { role } = (await this.$axios.put(`/roles/${id}`, payload)).data;

      commit(types.mutations.UPDATE_ROLE, role);
      const text = 'Your changes have been saved.';
      dispatch(snack.actions.TOGGLE_BAR, { text }, { root: true });
    } catch (err) {
      console.log(err);
      const text = 'Encountered a problem. Please contact the administrator.';
      dispatch(snack.actions.TOGGLE_BAR, { text }, { root: true });
      throw err;
    }
  },

  async [types.actions.REMOVE_ITEMS]({ commit, state, getters, dispatch }, id) {
    const ids = id ? [id] : getters[types.getters.SELECTED_IDS];
    const params = { ids, ...state.queryparams };

    try {
      const {
        data: { roles },
      } = await this.$axios.delete('/roles', { params });

      commit(types.mutations.SET_ROLES, roles.results);
      commit(types.mutations.SET_SELECTED, []);
      commit(types.mutations.SET_PARAM, {
        param: 'total',
        value: roles.total,
      });
      const text = `Removed roles with the following ids: ${ids}`;
      dispatch(snack.actions.TOGGLE_BAR, { text }, { root: true });
    } catch (err) {
      const code = parseInt(err.response && err.response.status);
      if (code !== 403) {
        console.log(err);
        const text = err.response;
        dispatch(snack.actions.TOGGLE_BAR, { text }, { root: true });
      }
    }
  },
};

export default actions;
