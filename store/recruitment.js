// import ns from '~/utilities/ns/private/forms.js';
// import filter from '~/utilities/ns/public/filters.js';
// import lists from '~/utilities/ns/public/lists.js';
// import snackbar from '~/utilities/ns/public/snackbar.js';
// import pickBy from 'lodash/pickBy';

// const state = () => ({
//   forms: [],
//   selected: [],

//   queryParams: {
//     page: 1,
//     limit: 25,
//     total: 0,
//     orderBy: 'DESC',
//     sortBy: 'id',
//   },
// });

// const getters = {
//   [ns.getters.QUERY_PARAMS]: (state) => (key) =>
//     typeof key !== undefined ? state.queryParams[key] : state.queryParams,

//   [ns.getters.FILTERS]: (state, getters, rootState, rootGetters) => {
//     const filters = rootGetters[filter.getters.GET_FILTER]('forms');
//     const picked = pickBy(filters, (value, key) => {
//       if (Array.isArray(value) && value.length) return true;
//       if (typeof value === 'boolean' && value) return true;
//     });
//     return Object.keys(picked).length ? picked : null;
//   },

//   [ns.getters.SELECTED]: (state) => state.selected,

//   [ns.getters.SELECTED_IDS]: (state) => state.selected.map(({ id }) => id),

//   [ns.getters.FORMS]: (state) => state.forms,
// };

// const mutations = {
//   [ns.mutations.SET_PARAM](state, { param, value }) {
//     state.queryParams[param] = value;
//   },

//   [ns.mutations.SET_SELECTED](state, selected) {
//     state.selected = selected;
//   },

//   [ns.mutations.SET_FORMS](state, forms) {
//     state.forms = forms;
//   },

//   [ns.mutations.UPDATE_FORM](state, form) {
//     const idx = state.forms.findIndex(({ id }) => id === form.id);
//     if (idx !== -1) state.forms.splice(idx, 1, form);
//   },
// };

// const actions = {
//   async [ns.actions.FETCH]({ commit, getters, state }, categories, where) {
//     const params = {
//       ...state.queryParams,
//       categories,
//     };

//     const filters = getters[ns.getters.FILTERS];

//     if (filters) Object.assign(params, { filters });

//     if (where && Object.keys(where).length) {
//       Object.assign(params, { where });
//     }

//     try {
//       const { forms, categories } = (
//         await this.$axios.get('/admin/recruitment', {
//           params,
//         })
//       ).data;

//       if (categories && categories.length) {
//         commit(lists.mutations.SET_TYPE, 'categories', { root: true });
//         commit(lists.mutations.SET_LIST, categories, { root: true });
//       }

//       commit(ns.mutations.SET_FORMS, forms.results);
//       commit(ns.mutations.SET_PARAM, { param: 'total', value: forms.total });
//     } catch (err) {
//       console.log(err);
//     }
//   },

//   async [ns.actions.EDIT_FORM]({ commit }, { id, details }) {
//     try {
//       const { form } = (
//         await this.$axios.patch(`/admin/recruitment/${id}`, details)
//       ).data;

//       console.log(form);

//       commit(ns.mutations.UPDATE_FORM, form);
//     } catch (err) {}
//   },

//   async [ns.actions.CHANGE_FORM_DETAIL]({ commit }, { id, type, value }) {
//     const details = { [type]: value };
//     try {
//       const { form } = (
//         await this.$axios.patch(`/admin/recruitment/${id}`, { details })
//       ).data;

//       console.log(form);

//       commit(ns.mutations.UPDATE_FORM, form);
//     } catch (err) {
//       console.log(err);
//     }
//   },

//   async [ns.actions.REMOVE_ITEMS]({ state, getters, commit }, id) {
//     const ids = id ? [id] : getters[ns.getters.SELECTED_IDS];
//     const params = { ...state.queryParams, ids };

//     const filters = getters[ns.getters.FILTERS];

//     if (filters && Object.keys(filters).length) {
//       Object.assign(params, { filters });
//     }

//     try {
//       const {
//         data: { forms },
//       } = await this.$axios.delete(`/admin/forms`, { params });

//       commit(ns.mutations.UPDATE_FORMS, forms.results);
//       commit(ns.mutations.SET_PARAM, { param: 'total', value: forms.total });
//     } catch (err) {
//       console.log(err);
//     }
//   },
// };

import state from '~/components/recruitment/store/state';
import getters from '~/components/recruitment/store/getters';
import mutations from '~/components/recruitment/store/mutations';
import actions from '~/components/recruitment/store/actions';

export default { state, getters, mutations, actions };
