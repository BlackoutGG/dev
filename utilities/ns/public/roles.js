export default {
  getters: {
    ROLES: 'roles/roles',
    SELECTED: 'roles/selected',
    SELECTED_IDS: 'roles/selectedIds',
    GET_ROLE: 'roles/getRole',
    QUERY_PARAMS: 'roles/queryParams',
  },
  mutations: {
    SET_ROLES: 'roles/setRoles',
    UPDATE_ROLE: 'roles/setRole',
    SET_DETAIL: 'roles/setName',
    SET_SELECTED: 'roles/setSelected',
    SET_PARAM: 'roles/setParam',
    SET_STATUS: 'roles/setStatus',
  },
  actions: {
    FETCH: 'roles/fetchRoles',
    ADD_ROLE: 'roles/addRole',
    EDIT_ROLE: 'roles/editRole',
    REMOVE_ITEMS: 'roles/removeItems',
    CHANGE_ROLE_DETAIL: 'roles/changeRoleDetail',
  },
};
