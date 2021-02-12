import types from './types/private';

const mutations = {
  [types.mutations.SET_EVENTS](state, events) {
    state.events = events;
  },

  [types.mutations.ADD_EVENT](state, data) {
    // const idx = state.events.findIndex((evt) => evt.id === event.id);
    // if (idx === -1) state.events.push(event);

    if (Array.isArray(data)) state.events.push(...data);
    else state.events.push(data);
  },

  [types.mutations.EDIT_EVENT](state, { id, event }) {
    let e = state.events.find((evt) => evt.id === id);
    Object.keys(event).forEach((key) => {
      if (typeof e[key] !== undefined) {
        e[key] = event[key];
      }
    });
  },

  [types.mutations.EDIT_EVENT_CATEGORY](state, { id, category }) {
    let event = state.events.find((event) => event.id === id);
    if (event && event.category) event.category = category;
  },

  [types.mutations.SET_USER_EVENT_STATUS](state, { id, join }) {
    console.log(id, join);
    let event = state.events.find((event) => event.id === id);

    if (event) {
      event.extendedProps.joined = join;
      if (join) event.extendedProps.participants++;
      else event.extendedProps.participants--;
    }
  },

  [types.mutations.UPDATE_EVENT](state, details) {
    let event = state.events.find(({ id }) => id === details.id);
    if (event) {
      Object.keys(details).forEach((key) => {
        if (typeof event[key] !== undefined) {
          event[key] = details[key];
        }
      });
    }
  },

  [types.mutations.REMOVE_EVENT](state, event) {
    const idx = state.events.findIndex((evt) => evt.id === event.id);
    if (idx !== -1) state.events.splice(idx, 1);
  },
};

export default mutations;
