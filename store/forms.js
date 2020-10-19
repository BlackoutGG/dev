import ns from '~/utilities/ns/private/forms.js';
import filter from '~/utilities/ns/public/filters.js';
import lists from '~/utilities/ns/public/lists.js';
import snackbar from '~/utilities/ns/public/snackbar.js';
import pickBy from 'lodash/pickBy';
import isFilterTruthy from '~/utilities/isFilterTruthy.js';

const state = () => ({
  name: '',
  category_id: 1,
  description: '',

  questions: [],

  forms: [],
  selected: [],

  queryParams: {
    page: 1,
    limit: 25,
    total: 0,
    orderBy: 'DESC',
    sortBy: 'id',
  },
});

const getters = {
  [ns.getters.QUESTIONS]: (state) =>
    state.questions.map((q, idx) => ({ ...q, order: idx })),

  [ns.getters.QUERY_PARAMS]: (state) => (key) =>
    typeof key !== undefined ? state.queryParams[key] : state.queryParams,

  [ns.getters.VALID_FIELDS]: (state, getters) => {
    return getters.questions
      .map((qs, idx) => {
        const { options, cache, ...field } = qs;
        const validOptions =
          options && options.length ? options.filter((o) => !!o) : null;
        return {
          ...field,
          options: validOptions,
        };
      })
      .filter((qs) => !!qs.value);
  },

  [ns.getters.FILTERS]: (state, getters, rootState, rootGetters) => {
    const filters = pickBy(
      rootGetters[filter.getters.GET_FILTER]('forms'),
      isFilterTruthy
    );
    return Object.keys(filters).length ? filters : null;
  },

  [ns.getters.DESCRIPTION]: (state) => state.description,

  [ns.getters.NAME]: (state) => state.name,

  [ns.getters.SELECTED]: (state) => state.selected,

  [ns.getters.SELECTED_IDS]: (state) => state.selected.map(({ id }) => id),

  [ns.getters.FORMS]: (state) => state.forms,

  [ns.getters.CATEGORY]: (state) => state.category_id,
};

const mutations = {
  [ns.mutations.ADD_QUESTION](state) {
    state.questions.push({
      value: '',
      type: 'textfield',
      optional: true,
      options: [],
      cache: [],
    });
  },
  [ns.mutations.ADD_OPTION](state, idx) {
    const q = state.questions[idx];
    if (q) q.options.push('');
  },
  [ns.mutations.CLEAR_OPTIONS](state, idx) {
    const q = state.questions[idx];
    if (q) q.options = [];
  },
  [ns.mutations.CHANGE_QUESTION_VALUE](state, { idx, value }) {
    const q = state.questions[idx];
    if (q) q.value = value;
  },
  [ns.mutations.CHANGE_OPTION_VALUE](state, { question, option, value }) {
    const q = state.questions[question];
    if (q) {
      q.options.splice(option, 1, value);
    }
  },
  [ns.mutations.CHANGE_QUESTION_TYPE](state, { idx, type }) {
    const q = state.questions[idx];
    if (q) q.type = type;
  },
  [ns.mutations.TOGGLE_OPTIONAL](state, { idx, bool }) {
    const q = state.questions[idx];
    q.optional = bool;
  },
  [ns.mutations.REMOVE_QUESTION](state, idx) {
    state.questions.splice(idx, 1);
  },
  [ns.mutations.REMOVE_OPTION](state, { question, option }) {
    const q = state.questions[question];
    if (q && q.options && q.options.length) {
      q.options.splice(option, 1);
    }
  },
  [ns.mutations.SET_PARAM](state, { param, value }) {
    state.queryParams[param] = value;
  },
  [ns.mutations.UPDATE_FORM_STATUS](state, { id, category_id, status }) {
    state.forms.forEach((form) => {
      if (form.category_id === category_id) {
        if (form.id !== id) form.status = false;
        else form.status = status;
      }
    });
  },
  [ns.mutations.UPDATE_FORM_STATUS_DIRECTLY](state, { id, status }) {
    const form = state.forms.find((form) => form.id === id);
    if (form) form.status = status;
  },
  [ns.mutations.SET_DESCRIPTION](state, description) {
    state.description = description;
  },
  [ns.mutations.SET_NAME](state, name) {
    state.name = name;
  },
  [ns.mutations.SET_CATEGORY](state, category) {
    state.category_id = category;
  },
  [ns.mutations.SET_FORMS](state, forms) {
    state.forms = forms;
  },
  [ns.mutations.SET_FIELDS](state, fields) {
    state.questions = fields;
  },
  [ns.mutations.SET_SELECTED](state, selected) {
    state.selected = selected;
  },
  [ns.mutations.SET_OPTIONS](state, { idx, value }) {
    const q = state.questions[idx];
    if (q) q.options = value;
  },
  [ns.mutations.SET_OPTIONS_CACHE](state, { idx, value }) {
    let q = state.questions[idx];
    if (q) q.cache = value;
  },
  [ns.mutations.SET_NAME_IN_LIST](state, { id, name }) {
    const form = state.forms.find((f) => f.id === id);
    if (form) form.name = name;
  },
  [ns.mutations.SET_CATEGORY_IN_LIST](state, { id, category_id, name }) {
    const form = state.forms.find((f) => f.id === id);
    if (form && form.category) {
      form.category.name = name;
      form.category.id = category_id;
    }
  },
  [ns.mutations.UPDATE_FORM](state, form) {
    const idx = state.forms.findIndex(({ id }) => id === form.id);
    if (idx !== -1) state.forms.splice(idx, 1, form);
  },
};

const actions = {
  async [ns.actions.FETCH]({ commit, getters, state }, categories) {
    const params = {
      ...state.queryParams,
      categories,
    };

    const filters = getters[ns.getters.FILTERS];

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
        commit(lists.mutations.SET_TYPE, 'categories', { root: true });
        commit(lists.mutations.SET_LIST, categories, { root: true });
      }

      commit(ns.mutations.SET_FORMS, forms.results);
      commit(ns.mutations.SET_PARAM, { param: 'total', value: forms.total });
    } catch (err) {
      console.log(err);
    }
  },

  async [ns.actions.SET_STATUS]({ commit }, { id, status, category_id }) {
    try {
      const {
        data: { form },
      } = await this.$axios.patch(`/admin/forms/${id}/status`, {
        category_id,
        status,
      });

      commit(ns.mutations.UPDATE_FORM_STATUS, form);
    } catch (err) {
      console.log(err);
    }
  },

  async [ns.actions.GET_FORM]({ commit }, { id, editable }) {
    try {
      const {
        data: { form },
      } = await this.$axios.get(`/admin/forms/${id}`);

      commit(ns.mutations.SET_NAME, form.name);
      commit(ns.mutations.SET_DESCRIPTION, form.description);
      commit(ns.mutations.SET_CATEGORY, form.category_id);
      commit(
        ns.mutations.SET_FIELDS,
        editable
          ? form.fields.map((field) => ({ ...field, cache: [] }))
          : form.fields
      );

      return form;
    } catch (err) {
      console.log(err);
    }
  },

  async [ns.actions.CHANGE_FORM_DETAIL]({ commit }, { id, type, value }) {
    const details = { [type]: value };
    try {
      const { form } = (
        await this.$axios.patch(`/admin/forms/${id}`, { details })
      ).data;

      console.log(form);

      commit(ns.mutations.UPDATE_FORM, form);
    } catch (err) {}
  },

  async [ns.actions.CLEAR_FORM]({ commit }) {
    commit(ns.mutations.SET_NAME, '');
    commit(ns.mutations.SET_DESCRIPTION, '');
    commit(ns.mutations.SET_CATEGORY, 1);
    commit(ns.mutations.SET_FIELDS, []);
  },

  async [ns.actions.ADD_FORM]({ commit, getters, state }) {
    const params = {
      form: {
        name: state.name,
        description: state.description,
        category_id: state.category_id,
      },
      fields: getters[ns.getters.VALID_FIELDS],
      ...state.queryParams,
    };

    const filters = getters[ns.getters.FILTERS];

    if (filters) Object.assign(params, { filters });

    try {
      const {
        data: { forms },
      } = await this.$axios.post('/admin/forms', params);

      commit(ns.mutations.SET_FORMS, forms.results);
      commit(ns.mutations.SET_PARAM, { param: 'total', value: forms.total });
      commit(
        snackbar.actions.TOGGLE_BAR,
        {
          text: `Form: ${params.name} has been created.`,
          y: 'top',
        },
        { root: true }
      );
    } catch (err) {
      console.log(err);
      commit(snackbar.actions.ERROR, null, { root: true });
    }
  },

  async [ns.actions.REMOVE_ITEMS]({ state, getters, commit }, id) {
    const ids = id ? [id] : getters[ns.getters.SELECTED_IDS];
    const params = { ...state.queryParams, ids };

    const filters = getters[ns.getters.FILTERS];

    if (filters && Object.keys(filters).length) {
      Object.assign(params, { filters });
    }

    try {
      const {
        data: { forms },
      } = await this.$axios.delete(`/admin/forms`, { params });

      commit(ns.mutations.SET_FORMS, forms.results);
      commit(ns.mutations.SET_PARAM, { param: 'total', value: forms.total });
    } catch (err) {
      throw err;
    }
  },

  async [ns.actions.EDIT_FORM]({ commit }, { id, data }) {
    try {
      const {
        data: { form },
      } = await this.$axios.patch(`/admin/forms/${id}`, data);

      console.log(form);

      commit(ns.mutations.UPDATE_FORM, form);
    } catch (err) {
      throw err;
    }
  },
};

export default { state, getters, mutations, actions };
