export default {
  getters: {
    ITEMS: 'recruitment/items',
    FILTERS: 'recruitment/filters',
    QUERY_PARAMS: 'recruitment/queryParams',
    SELECTED: 'recruitment/selected',
    SELECTED_IDS: 'users/selectedIds',
  },
  mutations: {
    SET_SELECTED: 'recruitment/setSelected',
    SET_FORMS: 'recruitment/setForms',
    SET_PARAM: 'recruitment/setParam',
    UPDATE_FORM: 'recruitment/updateForm',
  },
  actions: {
    REMOVE_ITEMS: 'recruitment/removeItems',
    SET_STATUS: 'recruitment/setStatus',
    FETCH: 'recruitment/fetchForms',
    CHANGE_FORM_DETAIL: 'recruitment/changeFormDetail',
  },
};
