import CalendarEvent from '~/components/events/CalendarEvent.js';
import pickBy from 'lodash/pickBy';
import snackbar from '~/utilities/ns/public/snackbar.js';
import isFilterTruthy from '~/utilities/isFilterTruthy.js';
import ns from '~/utilities/ns/private/events.js';
import filter from '~/utilities/ns/public/filters.js';

const state = () => ({
  events: [],
  colors: ['#FF9AA2', '#FFB7B2', '#FFDAC1', 'E2F0CB', '#B5EAD7', 'C7CEEA'],
});

const getters = {
  [ns.getters.ITEMS]: (state, getters) => {
    const filters = getters[ns.getters.FILTERS];
    if (filters && Object.keys(filters).length) {
      return state.events.filter((event) =>
        filters.category_id.includes(event.extendedProps.category_id)
      );
    } else {
      return state.events;
    }
  },

  [ns.getters.EVENT_COLORS]: (state) => state.colors,

  [ns.getters.GET_EVENT]: (state) => (id) =>
    state.events.find((evt) => evt.id === id),

  [ns.getters.FILTERS]: (state, getters, rootState, rootGetters) => {
    const filters = pickBy(
      rootGetters[filter.getters.GET_FILTER]('events'),
      isFilterTruthy
    );

    return Object.keys(filters).length ? filters : null;
  },
};

const mutations = {
  [ns.mutations.SET_EVENTS](state, events) {
    state.events = events;
  },

  [ns.mutations.ADD_EVENT](state, data) {
    // const idx = state.events.findIndex((evt) => evt.id === event.id);
    // if (idx === -1) state.events.push(event);

    if (Array.isArray(data)) state.events.push(...data);
    else state.events.push(data);
  },

  [ns.mutations.EDIT_EVENT](state, { id, event }) {
    let e = state.events.find((evt) => evt.id === id);
    Object.keys(event).forEach((key) => {
      if (typeof e[key] !== undefined) {
        e[key] = event[key];
      }
    });
  },

  [ns.mutations.EDIT_EVENT_CATEGORY](state, { id, category }) {
    let event = state.events.find((event) => event.id === id);
    if (event && event.category) event.category = category;
  },

  [ns.mutations.SET_USER_EVENT_STATUS](state, { id, join }) {
    console.log(id, join);
    let event = state.events.find((event) => event.id === id);

    if (event) {
      event.extendedProps.joined = join;
      if (join) event.extendedProps.participants++;
      else event.extendedProps.participants--;
    }
  },

  [ns.mutations.UPDATE_EVENT](state, details) {
    let event = state.events.find(({ id }) => id === details.id);
    if (event) {
      Object.keys(details).forEach((key) => {
        if (typeof event[key] !== undefined) {
          event[key] = details[key];
        }
      });
    }
  },

  [ns.mutations.REMOVE_EVENT](state, event) {
    const idx = state.events.findIndex((evt) => evt.id === event.id);
    if (idx !== -1) state.events.splice(idx, 1);
  },
};

const actions = {
  async [ns.actions.FETCH]({ commit, dispatch, getters }, { start, end }) {
    const params = {
      start,
      end,
    };

    try {
      const {
        data: { events },
      } = await this.$axios.get('/events', { params });

      commit(
        ns.mutations.SET_EVENTS,
        events.map((event) => new CalendarEvent(event))
      );

      return events;
    } catch (err) {
      console.log(err);
      const text = 'Encountered an error. Please contact the administrator';
      dispatch(snackbar.actions.TOGGLE_BAR, { text }, { root: true });
    }
  },

  async [ns.actions.ADD_EVENT]({ commit, dispatch, getters }, params) {
    console.log(params);

    try {
      let data = (await this.$axios.post('/events', params)).data;
      let text;

      console.log(data);

      if (Array.isArray(data)) {
        text = `Added event: ${data[0].title}`;
        commit(
          ns.mutations.ADD_EVENT,
          data.map((event) => new CalendarEvent(event))
        );
      } else {
        text = `Added event: ${data.title}`;
        commit(ns.mutations.ADD_EVENT, new CalendarEvent(data));
      }

      dispatch(snackbar.actions.TOGGLE_BAR, { text, y: 'top' }, { root: true });
    } catch (err) {
      console.log(err);
      const text = 'Encounterd an error. Please contact administration.';
      dispatch(snackbar.actions.TOGGLE_BAR, text, { root: true });
    }
  },

  async [ns.actions.TOGGLE_JOIN]({ commit }, params) {
    try {
      const result = (
        await this.$axios.post(
          params.joined ? '/events/leave' : '/events/join',
          params
        )
      ).data;

      console.log(result);

      commit(ns.mutations.SET_USER_EVENT_STATUS, result);
    } catch (err) {}
  },

  async [ns.actions.EDIT_EVENT]({ commit, dispatch, state }, data) {
    const { event_id, ...body } = data;
    try {
      const { event } = (
        await this.$axios.put(`/events/${event_id}`, body)
      ).data;

      // const events = state.events.map((e) => {
      //   if (e.id === event.id) return new CalendarEvent(event);
      //   else return e;
      // });

      // commit(ns.mutations.SET_EVENTS, []);

      // setTimeout(() => commit(ns.mutations.SET_EVENTS, events), 50);

      // commit(ns.mutations.SET_EVENTS, events);

      commit(ns.mutations.UPDATE_EVENT, new CalendarEvent(event));

      dispatch(snackbar.actions.SUCCESS, null, { root: true });
    } catch (err) {
      dispatch(snackbar.actions.ERROR, null, { root: true });
      return Promise.reject(err);
    }
  },
};

export default { state, getters, mutations, actions };
