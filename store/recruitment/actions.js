import types from '~/constants/recruitment/private.js';
import ttypes from '~/constants/table/public.js';

const actions = {
  async [types.actions.FETCH]({ commit, getters, state }, categories, where) {
    const params = {
      ...state.queryParams,
      categories,
    };

    const filters = getters[types.getters.FILTERS];

    if (filters) Object.assign(params, { filters });

    if (where && Object.keys(where).length) {
      Object.assign(params, { where });
    }

    try {
      const { forms, categories } = (
        await this.$axios.get('/admin/recruitment', {
          params,
        })
      ).data;

      if (categories && categories.length) {
        commit(ttypes.mutations.SET_TYPE, 'categories', { root: true });
        commit(ttypes.mutations.SET_LIST, categories, { root: true });
      }

      commit(types.mutations.SET_FORMS, forms.results);
      commit(types.mutations.SET_PARAM, { param: 'total', value: forms.total });
    } catch (err) {
      console.log(err);
    }
  },

  async [types.actions.EDIT_FORM]({ commit }, { id, details }) {
    try {
      const { form } = (
        await this.$axios.patch(`/admin/recruitment/${id}`, details)
      ).data;

      console.log(form);

      commit(types.mutations.UPDATE_FORM, form);
    } catch (err) {}
  },

  async [types.actions.CHANGE_FORM_DETAIL]({ commit }, { id, type, value }) {
    const details = { [type]: value };
    try {
      const { form } = (
        await this.$axios.patch(`/admin/recruitment/${id}`, { details })
      ).data;

      console.log(form);

      commit(types.mutations.UPDATE_FORM, form);
    } catch (err) {
      console.log(err);
    }
  },

  async [types.actions.REMOVE_ITEMS]({ state, getters, commit }, id) {
    const ids = id ? [id] : getters[types.getters.SELECTED_IDS];
    const params = { ...state.queryParams, ids };

    const filters = getters[types.getters.FILTERS];

    if (filters && Object.keys(filters).length) {
      Object.assign(params, { filters });
    }

    try {
      const {
        data: { forms },
      } = await this.$axios.delete(`/admin/forms`, { params });

      commit(types.mutations.UPDATE_FORMS, forms.results);
      commit(types.mutations.SET_PARAM, { param: 'total', value: forms.total });
    } catch (err) {
      console.log(err);
    }
  },
};

export default actions;
