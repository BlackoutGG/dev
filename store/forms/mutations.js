import types from '~/constants/forms/private.js';

const mutations = {
  [types.mutations.ADD_QUESTION](state) {
    state.questions.push({
      value: '',
      type: 'textfield',
      optional: true,
      options: [],
      cache: [],
    });
  },
  [types.mutations.ADD_OPTION](state, idx) {
    const q = state.questions[idx];
    if (q) q.options.push('');
  },
  [types.mutations.CLEAR_OPTIONS](state, idx) {
    const q = state.questions[idx];
    if (q) q.options = [];
  },
  [types.mutations.CHANGE_QUESTION_VALUE](state, { idx, value }) {
    const q = state.questions[idx];
    if (q) q.value = value;
  },
  [types.mutations.CHANGE_OPTION_VALUE](state, { question, option, value }) {
    const q = state.questions[question];
    if (q) {
      q.options.splice(option, 1, value);
    }
  },
  [types.mutations.CHANGE_QUESTION_TYPE](state, { idx, type }) {
    const q = state.questions[idx];
    if (q) q.type = type;
  },
  [types.mutations.TOGGLE_OPTIONAL](state, { idx, bool }) {
    const q = state.questions[idx];
    q.optional = bool;
  },
  [types.mutations.REMOVE_QUESTION](state, idx) {
    state.questions.splice(idx, 1);
  },
  [types.mutations.REMOVE_OPTION](state, { question, option }) {
    const q = state.questions[question];
    if (q && q.options && q.options.length) {
      q.options.splice(option, 1);
    }
  },
  [types.mutations.SET_PARAM](state, { param, value }) {
    state.queryParams[param] = value;
  },
  [types.mutations.UPDATE_FORM_STATUS](state, { id, category_id, status }) {
    state.forms.forEach((form) => {
      if (form.category_id === category_id) {
        if (form.id !== id) form.status = false;
        else form.status = status;
      }
    });
  },
  [types.mutations.UPDATE_FORM_STATUS_DIRECTLY](state, { id, status }) {
    const form = state.forms.find((form) => form.id === id);
    if (form) form.status = status;
  },
  [types.mutations.SET_DESCRIPTION](state, description) {
    state.description = description;
  },
  [types.mutations.SET_NAME](state, name) {
    state.name = name;
  },
  [types.mutations.SET_CATEGORY](state, category) {
    state.category_id = category;
  },
  [types.mutations.SET_FORMS](state, forms) {
    state.forms = forms;
  },
  [types.mutations.SET_FIELDS](state, fields) {
    state.questions = fields;
  },
  [types.mutations.SET_SELECTED](state, selected) {
    state.selected = selected;
  },
  [types.mutations.SET_OPTIONS](state, { idx, value }) {
    const q = state.questions[idx];
    if (q) q.options = value;
  },
  [types.mutations.SET_OPTIONS_CACHE](state, { idx, value }) {
    let q = state.questions[idx];
    if (q) q.cache = value;
  },
  [types.mutations.SET_NAME_IN_LIST](state, { id, name }) {
    const form = state.forms.find((f) => f.id === id);
    if (form) form.name = name;
  },
  [types.mutations.SET_CATEGORY_IN_LIST](state, { id, category_id, name }) {
    const form = state.forms.find((f) => f.id === id);
    if (form && form.category) {
      form.category.name = name;
      form.category.id = category_id;
    }
  },
  [types.mutations.UPDATE_FORM](state, form) {
    const idx = state.forms.findIndex(({ id }) => id === form.id);
    if (idx !== -1) state.forms.splice(idx, 1, form);
  },
};

export default mutations;
