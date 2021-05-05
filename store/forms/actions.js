import types from '~/constants/forms/private.js';
import ttypes from '~/constants/table/public.js';

const actions = {
  async [types.actions.FETCH]({ commit, getters, state }, categories) {
    const params = {
      ...state.queryParams,
      categories,
    };

    const filters = getters[types.getters.FILTERS];

    if (filters && Object.keys(filters).length) {
      Object.assign(params, { filters });
    }

    try {
      const { forms, categories } = (
        await this.$axios.get('/admin/forms', {
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

  async [types.actions.SET_STATUS]({ commit }, { id, status, category_id }) {
    try {
      const {
        data: { form },
      } = await this.$axios.patch(`/admin/forms/${id}/status`, {
        category_id,
        status,
      });

      commit(types.mutations.UPDATE_FORM_STATUS, form);
    } catch (err) {
      console.log(err);
    }
  },

  async [types.actions.GET_FORM]({ commit }, { id, editable }) {
    try {
      const {
        data: { form },
      } = await this.$axios.get(`/admin/forms/${id}`);

      commit(types.mutations.SET_NAME, form.name);
      commit(types.mutations.SET_DESCRIPTION, form.description);
      commit(types.mutations.SET_CATEGORY, form.category_id);
      commit(
        types.mutations.SET_FIELDS,
        editable
          ? form.fields.map((field) => ({ ...field, cache: [] }))
          : form.fields
      );

      return form;
    } catch (err) {
      console.log(err);
    }
  },

  async [types.actions.CHANGE_FORM_DETAIL]({ commit }, { id, type, value }) {
    const details = { [type]: value };
    try {
      const { form } = (
        await this.$axios.patch(`/admin/forms/${id}`, { details })
      ).data;

      console.log(form);

      commit(types.mutations.UPDATE_FORM, form);
    } catch (err) {}
  },

  async [types.actions.CLEAR_FORM]({ commit }) {
    commit(types.mutations.SET_NAME, '');
    commit(types.mutations.SET_DESCRIPTION, '');
    commit(types.mutations.SET_CATEGORY, 1);
    commit(types.mutations.SET_FIELDS, []);
  },

  async [types.actions.ADD_FORM]({ commit, getters, state }) {
    const params = {
      form: {
        name: state.name,
        description: state.description,
        category_id: state.category_id,
      },
      fields: getters[types.getters.VALID_FIELDS],
      ...state.queryParams,
    };

    const filters = getters[types.getters.FILTERS];

    if (filters) Object.assign(params, { filters });

    try {
      const {
        data: { forms },
      } = await this.$axios.post('/admin/forms', params);

      commit(types.mutations.SET_FORMS, forms.results);
      commit(types.mutations.SET_PARAM, { param: 'total', value: forms.total });
      commit(
        snacktypes.actions.TOGGLE_BAR,
        {
          text: `Form: ${params.name} has been created.`,
          y: 'top',
        },
        { root: true }
      );
    } catch (err) {
      console.log(err);
      commit(snacktypes.actions.ERROR, null, { root: true });
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

      commit(types.mutations.SET_FORMS, forms.results);
      commit(types.mutations.SET_PARAM, { param: 'total', value: forms.total });
    } catch (err) {
      throw err;
    }
  },

  async [types.actions.EDIT_FORM]({ commit }, { id, data }) {
    try {
      const {
        data: { form },
      } = await this.$axios.patch(`/admin/forms/${id}`, data);

      console.log(form);

      commit(types.mutations.UPDATE_FORM, form);
    } catch (err) {
      throw err;
    }
  },
};

export default actions;
