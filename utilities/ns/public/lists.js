export default {
  getters: {
    GET_ITEMS: 'lists/getItems',
    TYPE: 'lists/type',
    SELECTED: 'lists/selected',
    SELECT_IDS: 'lists/selectedIds',
    QUERY_PARAMS: 'lists/queryParams',
  },
  mutations: {
    SET_LIST: 'lists/setList',
    SET_TYPE: 'lists/setType',
    SET_SELECTED: 'lists/setSelected',
    SET_PARAM: 'lists/setParam',
    RESET_PARAMS: 'lists/resetParams',
    UPDATE_ITEM: 'lists/updateItem',
  },
  actions: {
    FETCH: 'lists/fetchList',
    CLEAR_LIST: 'lists/clearList',
    REMOVE_ITEMS: 'lists/removeItems',
    ADD_ITEM: 'lists/addItem',
    EDIT_ITEM: 'lists/editItem',
  },
};
