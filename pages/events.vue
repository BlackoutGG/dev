<template>
  <section id="events">
    <parallax-banner :title="title"></parallax-banner>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-btn text fab small color="grey darken-2" @click="prev">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <span class="text-h6 white--text" v-if="$refs.calendar">{{
            $refs.calendar.title
          }}</span>
          <span class="text-h6 white--text" v-else-if="$refs.upcoming">{{
            $refs.upcoming.title
          }}</span>
          <v-btn text fab small color="grey darken-2" @click="next">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <div class="d-flex align-center">
            <v-spacer></v-spacer>
            <event-dialog
              ref="dialog"
              v-if="$auth.hasScope(['add:events']) && $refs.calendar"
              :start="startOfCalendarView"
              :end="endOfCalendarView"
            ></event-dialog>
            <v-btn-toggle>
              <v-btn small outlined @click="view = 'monthGrid'">
                <span>Month</span>
              </v-btn>
              <v-btn small @click="view = 'upcomingEvents'">
                <span>Upcoming</span>
              </v-btn>
            </v-btn-toggle>
          </div>
        </v-col>
      </v-row>
      <month-grid
        :events="events"
        ref="calendar"
        @change="onChange"
        @dayClick="onDayClick"
        @dayDateClick="onDayDateClick"
        v-if="view === 'monthGrid'"
      ></month-grid>
      <upcoming-events
        :events="events"
        :options="options"
        ref="upcoming"
        @change="onChange"
        @changeView="changeView"
        v-else
      ></upcoming-events>
    </v-container>
  </section>
</template>

<script>
import events from '~/utilities/ns/public/events.js';

import MonthGrid from '~/components/calendar/Calendar2.vue';
import UpcomingEvents from '~/components/calendar/CalendarUpcoming2.vue';
import ParallaxBanner from '~/components/core/Parallax.vue';
import lists from '~/utilities/ns/public/lists.js';
export default {
  name: 'Events',
  layout: 'default',

  components: { ParallaxBanner, MonthGrid, UpcomingEvents },

  middleware: [
    'auth',
    ({ $auth, store, redirect }) => {
      if (!$auth.hasScope(['view:events'])) {
        return redirect('/');
      } else {
        store.dispatch(lists.actions.FETCH, 'categories');
      }
    },
  ],

  head() {
    return { title: 'Events' };
  },

  data() {
    return {
      title: 'Events',
      view: 'monthGrid',

      options: {
        start: this.$dayjs(this.start, 'YYYY-MM-DD'),
        type: 'month',
        rangeWidth: 6,
      },
    };
  },

  methods: {
    onChange({ start, end }) {
      this.$store.dispatch(events.actions.FETCH, { start, end });
    },
    onDayClick(date) {
      this.$refs.dialog.openFromDate(date);
    },
    onDayDateClick(date) {
      this.options = {
        start: this.$dayjs(date, 'YYYY-MM-DD'),
        type: 'day',
        rangeWidth: 1,
      };
      this.view = 'upcomingEvents';
    },
    changeView() {
      this.options = {
        start: this.$dayjs('YYYY-MM-DD'),
        type: 'month',
        rangeWidth: 6,
      };
      this.view = 'monthGrid';
    },
    prev() {
      if (this.$refs.calendar) this.$refs.calendar.prev();
      else this.$refs.upcoming.prev();
    },
    next() {
      if (this.$refs.calendar) this.$refs.calendar.next();
      else this.$refs.upcoming.next();
    },
  },

  computed: {
    events() {
      return this.$store.getters[events.getters.ITEMS];
    },
    startOfCalendarView() {
      return this.$refs.calendar.startOfCalendarView;
    },
    endOfCalendarView() {
      return this.$refs.calendar.endOfCalendarView;
    },
  },
};
</script>
