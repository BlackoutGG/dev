// import ns from '~/utilities/ns/private/users.js';
// import snackbar from '~/utilities/ns/public/snackbar.js';
// import roles from '~/utilities/ns/public/roles';
// import filter from '~/utilities/ns/public/filters.js';
// import pickBy from 'lodash/pickBy';
// import isFilterTruthy from '~/utilities/isFilterTruthy';

// const state = () => ({
//   users: [],
//   selected: [],

//   queryParams: {
//     page: 1,
//     limit: 25,
//     total: 0,
//     sortBy: 'id',
//     orderBy: 'ASC',
//   },
// });

// const getters = {
//   [ns.getters.ITEMS]: (state) => state.users,

//   [ns.getters.SELECTED]: (state) => state.selected,

//   [ns.getters.SELECTED_IDS]: (state) => state.selected.map(({ id }) => id),

//   [ns.getters.GET_USER]: (state) => (id) =>
//     state.users.find((user) => user.id === id),

//   [ns.getters.QUERY_PARAMS]: (state) => (key) =>
//     typeof key !== undefined ? state.queryParams[key] : state.queryParams,

//   [ns.getters.FILTERS]: (state, getters, rootState, rootGetters) => {
//     const filters = pickBy(
//       rootGetters[filter.getters.GET_FILTER]('users'),
//       isFilterTruthy
//     );
//     return Object.keys(filters).length ? filters : null;
//   },
// };

// const mutations = {
//   [ns.mutations.SET_USERS](state, users) {
//     state.users = users;
//   },

//   [ns.mutations.SET_SELECTED](state, value) {
//     state.selected = value;
//   },

//   [ns.mutations.SET_PARAM](state, { param, value }) {
//     if (typeof state.queryParams[param] !== undefined) {
//       state.queryParams[param] = value;
//     }
//   },

//   [ns.mutations.ADD_ROLE](state, { userId, role }) {
//     const user = state.users.find((u) => u.id === userId);
//     if (user) user.roles.push(role);
//   },
//   [ns.mutations.REMOVE_ROLE](state, { user_id, role_id }) {
//     const user = state.users.find((u) => u.id === user_id);
//     if (user) {
//       const idx = user.roles.findIndex((role) => role.id === role_id);
//       if (idx !== -1) user.roles.splice(idx, 1);
//     }
//   },
//   [ns.mutations.SET_USERNAME](state, { id, value }) {
//     const user = state.users.find((u) => u.id === id);
//     if (user) user.username = value;
//   },
//   [ns.mutations.SET_EMAIL](state, { id, value }) {
//     const user = state.users.find((u) => u.id === id);
//     if (user) user.email = value;
//   },
//   [ns.mutations.SET_USER](state, user) {
//     const idx = state.users.findIndex(({ id }) => id === user.id);
//     if (idx !== -1) state.users.splice(idx, 1, user);
//   },
// };

// const actions = {
//   async [ns.actions.FETCH]({ state, getters, commit, dispatch }, fetch_roles) {
//     const params = {
//       ...state.queryParams,
//       roles: fetch_roles,
//     };

//     const filters = getters[ns.getters.FILTERS];

//     if (filters) Object.assign(params, { filters });

//     try {
//       const { data } = await this.$axios.get('/admin/users', { params });

//       if (data.roles) {
//         commit(roles.mutations.SET_ROLES, data.roles, { root: true });
//       }

//       commit(ns.mutations.SET_USERS, data.users.results);
//       commit(ns.mutations.SET_PARAM, {
//         param: 'total',
//         value: data.users.total,
//       });
//       // dispatch(
//       //   snackbar.actions.TOGGLE_BAR,
//       //   { text: "Content Loaded." },
//       //   { root: true }
//       // );
//     } catch (err) {
//       dispatch(
//         snackbar.actions.TOGGLE_BAR,
//         { text: err.message },
//         { root: true }
//       );
//     }
//   },

//   async [ns.actions.ADD_ROLE]({ commit, dispatch }, { userId, roleId }) {
//     try {
//       const { data } = await this.$axios.put(`/admin/users/${userId}/role`, {
//         roleId,
//       });
//       commit(ns.mutations.ADD_ROLE, {
//         userId: data.user.id,
//         role: data.user.role,
//       });
//     } catch (err) {
//       dispatch(
//         snackbar.actions.TOGGLE_BAR,
//         { text: err.message },
//         { root: true }
//       );
//     }
//   },

//   async [ns.actions.REMOVE_ROLE]({ commit }, { userId, roleId }) {
//     try {
//       const { data } = await this.$axios.delete(`/admin/users/${userId}/role`, {
//         params: { roleId },
//       });

//       commit(ns.mutations.REMOVE_ROLE, data.user);
//     } catch (err) {}
//   },

//   async [ns.actions.CHANGE_USER_INFO](
//     { commit, dispatch },
//     { id, type, value }
//   ) {
//     const details = { [type]: value };

//     try {
//       const { user } = (
//         await this.$axios.put(`/admin/users/${id}`, {
//           details,
//         })
//       ).data;

//       commit(ns.mutations.SET_USER, user);
//     } catch (err) {
//       dispatch(
//         snackbar.actions.TOGGLE_BAR,
//         { text: err.message },
//         { root: true }
//       );
//     }
//   },

//   async [ns.actions.RESET_PASSWORD]({ commit, dispatch }, id) {},

//   async [ns.actions.ADD_USER]({ state, commit, getters, dispatch }, payload) {
//     const params = {
//       ...payload,
//       ...state.queryParams,
//     };

//     const filters = getters[ns.getters.FILTERS];

//     if (filters && Object.keys(filters).length) {
//       Object.assign(params, { filters });
//     }

//     try {
//       const { username, users } = (
//         await this.$axios.post('/admin/users', params)
//       ).data;
//       const text = `Created user: ${username}`;

//       dispatch(snackbar.actions.TOGGLE_BAR, { text }, { root: true });

//       commit(ns.mutations.SET_PARAM, {
//         param: 'total',
//         value: users.total,
//       });
//       commit(ns.mutations.SET_USERS, users.results);

//       return Promise.resolve();
//     } catch (err) {
//       return Promise.reject(err);
//     }
//   },

//   async [ns.actions.REMOVE_ITEMS]({ state, commit, getters }, id) {
//     const ids = id ? [id] : getters[ns.getters.SELECTED_IDS];
//     const params = { ...state.queryParams, ids };
//     const filters = getters[ns.getters.FILTERS];

//     if (filters && Object.keys(filters).length) {
//       Object.assign(params, { filters });
//     }

//     const isEmpty = state.users.every((user) => ids.includes(user.id));

//     console.log(isEmpty);

//     if (isEmpty && state.queryParams.page > 1) {
//       const total = Math.ceil(
//         (state.queryParams.total - ids.length) / state.queryParams.limit
//       );

//       console.log('total', total);

//       // const pageToSend = state.queryParams.page - total;

//       // console.log('pageToSend', pageToSend);

//       params.page = total;
//       // commit(ns.mutations.SET_PARAM, { type: 'page', value: pageToSend });
//     }

//     try {
//       const {
//         data: { users },
//       } = await this.$axios.delete('/admin/users', { params });

//       commit(ns.mutations.SET_USERS, users.results);

//       commit(ns.mutations.SET_PARAM, { param: 'total', value: users.total });
//       commit(ns.mutations.SET_SELECTED, []);
//     } catch (err) {}
//   },

//   async [ns.actions.EDIT_USER]({ commit, dispatch }, { id, payload }) {
//     console.log(payload);

//     try {
//       const {
//         data: { user },
//       } = await this.$axios.patch(`/admin/users/${id}`, payload);

//       commit(ns.mutations.SET_USER, user);

//       const text = 'Your changes have saved.';

//       dispatch(snackbar.actions.TOGGLE_BAR, { text }, { root: true });

//       return Promise.resolve();
//     } catch (err) {
//       return Promise.reject(err);
//     }
//   },
// };

// export default { state, getters, mutations, actions };

import state from '~/components/users/store/state';
import getters from '~/components/users/store/getters';
import mutations from '~/components/users/store/mutations';
import actions from '~/components/users/store/actions';

export default { state, getters, mutations, actions };
