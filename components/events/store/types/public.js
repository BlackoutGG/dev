export default {
  getters: {
    ITEMS: 'events/events',
    EVENT_COLORS: 'events/eventColors',
    GET_EVENT: 'events/getEvent',
    FILTERS: 'events/filters',
  },
  mutations: {
    SET_EVENTS: 'events/setEvents',
    SET_USER_EVENT_STATUS: 'events/setUserEventStatus',
    EDIT_EVENT_CATEGORY: 'events/eventCategory',
    ADD_EVENT: 'events/addEvent',
    EDIT_EVENT: 'events/editEvent',
    REMOVE_EVENT: 'events/removeEvent',
    UPDATE_EVENT: 'events/updateEvent',
  },
  actions: {
    FETCH: 'events/fetch',
    ADD_EVENT: 'events/add',
    EDIT_EVENT: 'events/edit',
    REMOVE_EVENT: 'events/remove',
    TOGGLE_JOIN: 'events/toggleJoin',
  },
};
