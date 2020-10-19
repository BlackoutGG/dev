import CalendarEvent from '~/components/events/CalendarEvent.js';
import pickBy from 'lodash/pickBy';
import snackbar from '~/utilities/ns/public/snackbar.js';
import isFilterTruthy from '~/utilities/isFilterTruthy.js';
import ns from '~/utilities/ns/private/events.js';
import filter from '~/utilities/ns/public/filters.js';

const props = [
  'name',
  'color',
  'start_time',
  'start_date',
  'end_time',
  'end_date',
  'description',
  'rvsp',
];

const state = () => ({
  events: [],
  colors: ['#FF9AA2', '#FFB7B2', '#FFDAC1', 'E2F0CB', '#B5EAD7', 'C7CEEA'],
});

const getters = {
  [ns.getters.EVENTS]: (state) => state.events,

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

  [ns.mutations.ADD_EVENT](state, event) {
    const idx = state.events.findIndex((evt) => evt.id === event.id);
    if (idx === -1) state.events.push(event);
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

  [ns.mutations.UPDATE_EVENT](state, event) {
    const idx = state.events.findIndex(({ id }) => event.id);
    if (idx !== -1) state.events.splice(idx, 1, event);
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

    const filters = getters[ns.getters.FILTERS];

    if (filters) {
      Object.assign(params, { filters });
    }

    try {
      const {
        data: { events },
      } = await this.$axios.get('/events', { params });

      commit(
        ns.mutations.SET_EVENTS,
        events.map((event) => new CalendarEvent(event))
      );
    } catch (err) {
      console.log(err);
      const text = 'Encountered an error. Please contact the administrator';
      dispatch(snackbar.actions.TOGGLE_BAR, { text }, { root: true });
    }
  },

  async [ns.actions.ADD_EVENT]({ commit, dispatch, getters }, params) {
    const filters = getters[ns.getters.FILTERS];

    if (filters && Object.keys(filters).length) {
      Object.assign(params, { filters });
    }

    try {
      const { event } = (await this.$axios.post('/events', params)).data;
      const text = `Saved Event: ${event.name}`;

      commit(ns.mutations.ADD_EVENT, new CalendarEvent(event));
      dispatch(snackbar.actions.TOGGLE_BAR, { text }, { root: true });

      return event;
    } catch (err) {
      console.log(err);
      const text = 'Encounterd an error. Please contact administration.';
      dispatch(snackbar.actions.TOGGLE_BAR, text, { root: true });
    }
  },

  async [ns.actions.EDIT_EVENT]({ commit, dispatch, state }, data) {
    const { id, ...body } = data;
    try {
      const { event } = (await this.$axios.put(`/events/${id}`, body)).data;

      // const events = cloneDeep(state.events);

      const events = state.events.map((e) => {
        if (e.id === event.id) return new CalendarEvent(event);
        else return e;
      });

      // let match = events.find((e) => e.id === event.id);
      // if (match) match = new CalendarEvent(event);

      commit(ns.mutations.SET_EVENTS, []);

      setTimeout(() => commit(ns.mutations.SET_EVENTS, events), 50);

      // commit(ns.mutations.UPDATE_EVENT, new CalendarEvent(event));

      dispatch(snackbar.actions.SUCCESS, null, { root: true });

      return event;
    } catch (err) {
      dispatch(snackbar.actions.ERROR, null, { root: true });
      return Promise.reject(err);
    }
  },
};

export default { state, getters, mutations, actions };
