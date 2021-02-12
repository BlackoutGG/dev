import types from './types/private';

const mutations = {
  [types.mutations.SET_PARAM](state, { param, value }) {
    state.queryParams[param] = value;
  },

  [types.mutations.SET_SELECTED](state, selected) {
    state.selected = selected;
  },

  [types.mutations.SET_FORMS](state, forms) {
    state.forms = forms;
  },

  [types.mutations.UPDATE_FORM](state, form) {
    const idx = state.forms.findIndex(({ id }) => id === form.id);
    if (idx !== -1) state.forms.splice(idx, 1, form);
  },
};

export default mutations;
