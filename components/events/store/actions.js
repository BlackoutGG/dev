import types from './types/private';
import snackbarTypes from '~/components/snackbar/store/types/private';
import CalendarEvent from '~/components/events/CalendarEvent.js';

const actions = {
  async [types.actions.FETCH]({ commit, dispatch, getters }, { start, end }) {
    const params = {
      start,
      end,
    };

    try {
      const {
        data: { events },
      } = await this.$axios.get('/events', { params });

      commit(
        types.mutations.SET_EVENTS,
        events.map((event) => new CalendarEvent(event))
      );

      return events;
    } catch (err) {
      console.log(err);
      const text = 'Encountered an error. Please contact the administrator';
      dispatch(snackbarTypes.actions.TOGGLE_BAR, { text }, { root: true });
    }
  },

  async [types.actions.ADD_EVENT]({ commit, dispatch, getters }, params) {
    console.log(params);

    try {
      let data = (await this.$axios.post('/events', params)).data;
      let text;

      console.log(data);

      if (Array.isArray(data)) {
        text = `Added event: ${data[0].title}`;
        commit(
          types.mutations.ADD_EVENT,
          data.map((event) => new CalendarEvent(event))
        );
      } else {
        text = `Added event: ${data.title}`;
        commit(ns.mutations.ADD_EVENT, new CalendarEvent(data));
      }

      dispatch(
        snackbarTypes.actions.TOGGLE_BAR,
        { text, y: 'top' },
        { root: true }
      );
    } catch (err) {
      console.log(err);
      const text = 'Encounterd an error. Please contact administration.';
      dispatch(snackbarTypes.actions.TOGGLE_BAR, text, { root: true });
    }
  },

  async [types.actions.TOGGLE_JOIN]({ commit }, params) {
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

  async [types.actions.EDIT_EVENT]({ commit, dispatch, state }, data) {
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

      dispatch(snackbarTypes.actions.SUCCESS, null, { root: true });
    } catch (err) {
      dispatch(snackbarTypes.actions.ERROR, null, { root: true });
      return Promise.reject(err);
    }
  },
};

export default actions;
