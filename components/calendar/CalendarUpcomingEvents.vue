<template>
  <v-container>
    <template v-for="(day, idx) in days">
      <v-row :key="idx" v-if="day.events.length">
        <v-col cols="12">
          <v-sheet class="pa-4 mb-2" :min-width="'100%'">
            <div class="upcoming-list-date-header">
              <span class="text-h6 outline">{{ day.headerDate }}</span>
            </div>

            <upcoming-event
              v-for="(event, i) in day.events"
              :key="i"
              :event="event"
              :date="day.date"
            ></upcoming-event>
          </v-sheet>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import events from '~/utilities/ns/public/events.js';
import UpcomingEvent from './UpcomingEvent.vue';
import EventTime from './upcoming/EventTime.vue';
import EventJoinButton from './upcoming/EventJoinButton.vue';
import cloneDeep from 'lodash/cloneDeep';

const sortByTime = (a, b) => {
  const startA = new Date(a.start);
  const startB = new Date(b.start);
  return startA - startB;
};

export default {
  name: 'EventUpcomingList',

  components: { UpcomingEvent, EventTime, EventJoinButton },

  props: {
    selectedDate: {
      type: String,
    },
  },

  data() {
    return {
      startDate: this.$dayjs().format('YYYY-MM-DD'),

      headers: [
        { text: '', align: 'start', sortable: false, value: 'time' },
        { text: '', align: 'start', sortable: false, value: 'title' },
        { text: '', align: 'end', sortable: false, value: 'rvsp' },
      ],
    };
  },

  computed: {
    startMonth() {
      return this.$dayjs().format('MMMM YYYY');
    },

    endMonth() {
      return this.startDate.add(6, 'month').format('MMMM YYYY');
    },

    daysInMonth() {
      // return this.$dayjs(this.selectedDate).daysInMonth();
      return this.selectedDate.daysInMonth();
    },

    days() {
      return [...Array(this.daysInMonth)].map((day, index) => {
        const dateStr = `${this.year}-${this.month}-${index + 1}`;
        const date = this.$dayjs(dateStr);

        const headerDate = this.$dayjs(date).format('dddd, MMMM D, YYYY');
        const events = this.events.sort(sortByTime).filter((event) => {
          const start = event.extendedProps.start_date;
          const end = event.extendedProps.end_date;

          return this.$dayjs(date).isBetween(start, end, null, '[]');
        });

        return { date: dateStr, headerDate, events };
      });
    },

    events() {
      return cloneDeep(this.$store.getters[events.getters.EVENTS]);
    },
  },
};
</script>
