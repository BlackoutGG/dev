export default {
  getters: {
    GET_ITEMS: 'table/getItems',
    TYPE: 'table/type',
    SELECTED: 'table/selected',
    SELECT_IDS: 'table/selectedIds',
    QUERY_PARAMS: 'table/queryParams',
  },
  mutations: {
    SET_LIST: 'table/setTableData',
    SET_TYPE: 'table/setType',
    SET_SELECTED: 'table/setSelected',
    SET_PARAM: 'table/setParam',
    RESET_PARAMS: 'table/resetParams',
    UPDATE_ITEM: 'table/updateItem',
  },
  actions: {
    FETCH: 'table/fetch',
    CLEAR_LIST: 'table/clear',
    REMOVE_ITEMS: 'table/removeItems',
    ADD_ITEM: 'table/addItem',
    EDIT_ITEM: 'table/editItem',
  },
};
