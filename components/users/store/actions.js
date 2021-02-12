import types from './types/private';
import snacktypes from '~/components/snackbar/store/types/public';
import roletypes from '~/components/roles/store/types/public';

const actions = {
  async [types.actions.FETCH](
    { state, getters, commit, dispatch },
    fetch_roles
  ) {
    const params = {
      ...state.queryParams,
      roles: fetch_roles,
    };

    const filters = getters[types.getters.FILTERS];

    if (filters) Object.assign(params, { filters });

    try {
      const { data } = await this.$axios.get('/admin/users', { params });

      if (data.roles) {
        commit(roletypes.mutations.SET_ROLES, data.roles, { root: true });
      }

      commit(types.mutations.SET_USERS, data.users.results);
      commit(types.mutations.SET_PARAM, {
        param: 'total',
        value: data.users.total,
      });
      // dispatch(
      //   snackbar.actions.TOGGLE_BAR,
      //   { text: "Content Loaded." },
      //   { root: true }
      // );
    } catch (err) {
      dispatch(
        snacktypes.actions.TOGGLE_BAR,
        { text: err.message },
        { root: true }
      );
    }
  },

  async [types.actions.ADD_ROLE]({ commit, dispatch }, { userId, roleId }) {
    try {
      const { data } = await this.$axios.put(`/admin/users/${userId}/role`, {
        roleId,
      });
      commit(types.mutations.ADD_ROLE, {
        userId: data.user.id,
        role: data.user.role,
      });
    } catch (err) {
      dispatch(
        snacktypes.actions.TOGGLE_BAR,
        { text: err.message },
        { root: true }
      );
    }
  },

  async [types.actions.REMOVE_ROLE]({ commit }, { userId, roleId }) {
    try {
      const { data } = await this.$axios.delete(`/admin/users/${userId}/role`, {
        params: { roleId },
      });

      commit(types.mutations.REMOVE_ROLE, data.user);
    } catch (err) {}
  },

  async [types.actions.CHANGE_USER_INFO](
    { commit, dispatch },
    { id, type, value }
  ) {
    const details = { [type]: value };

    try {
      const { user } = (
        await this.$axios.put(`/admin/users/${id}`, {
          details,
        })
      ).data;

      commit(types.mutations.SET_USER, user);
    } catch (err) {
      dispatch(
        snacktypes.actions.TOGGLE_BAR,
        { text: err.message },
        { root: true }
      );
    }
  },

  async [types.actions.RESET_PASSWORD]({ commit, dispatch }, id) {},

  async [types.actions.ADD_USER](
    { state, commit, getters, dispatch },
    payload
  ) {
    const params = {
      ...payload,
      ...state.queryParams,
    };

    const filters = getters[types.getters.FILTERS];

    if (filters && Object.keys(filters).length) {
      Object.assign(params, { filters });
    }

    try {
      const { username, users } = (
        await this.$axios.post('/admin/users', params)
      ).data;
      const text = `Created user: ${username}`;

      dispatch(snackbar.actions.TOGGLE_BAR, { text }, { root: true });

      commit(types.mutations.SET_PARAM, {
        param: 'total',
        value: users.total,
      });
      commit(types.mutations.SET_USERS, users.results);

      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  },

  async [types.actions.REMOVE_ITEMS]({ state, commit, getters }, id) {
    const ids = id ? [id] : getters[types.getters.SELECTED_IDS];
    const params = { ...state.queryParams, ids };
    const filters = getters[types.getters.FILTERS];

    if (filters && Object.keys(filters).length) {
      Object.assign(params, { filters });
    }

    const isEmpty = state.users.every((user) => ids.includes(user.id));

    console.log(isEmpty);

    if (isEmpty && state.queryParams.page > 1) {
      const total = Math.ceil(
        (state.queryParams.total - ids.length) / state.queryParams.limit
      );

      console.log('total', total);

      // const pageToSend = state.queryParams.page - total;

      // console.log('pageToSend', pageToSend);

      params.page = total;
      // commit(types.mutations.SET_PARAM, { type: 'page', value: pageToSend });
    }

    try {
      const {
        data: { users },
      } = await this.$axios.delete('/admin/users', { params });

      commit(types.mutations.SET_USERS, users.results);

      commit(types.mutations.SET_PARAM, { param: 'total', value: users.total });
      commit(types.mutations.SET_SELECTED, []);
    } catch (err) {}
  },

  async [types.actions.EDIT_USER]({ commit, dispatch }, { id, payload }) {
    console.log(payload);

    try {
      const {
        data: { user },
      } = await this.$axios.patch(`/admin/users/${id}`, payload);

      commit(types.mutations.SET_USER, user);

      const text = 'Your changes have saved.';

      dispatch(snackbar.actions.TOGGLE_BAR, { text }, { root: true });

      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  },
};

export default actions;
