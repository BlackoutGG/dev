<template>
  <section id="upcoming">
    <template v-for="(day, idx) in days">
      <v-lazy :key="idx" :min-height="minHeight" :options="options">
        <v-row>
          <v-col cols="12">
            <v-sheet class="pa-4 mb-2" :min-width="'100%'">
              <div :class="headerDateClasses">
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
      </v-lazy>
    </template>
  </section>
</template>

<script>
import events from '~/utilities/ns/public/events.js';
import cloneDeep from 'lodash/cloneDeep';
import UpcomingEvent from './CalendarUpcomingEvent.vue';

const sortByTime = (a, b) => {
  const startA = new Date(a.start);
  const startB = new Date(b.start);
  return startA - startB;
};

export default {
  name: 'EventUpcomingList',

  components: { UpcomingEvent },

  props: {
    events: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      // startDate: this.$dayjs()
      //   .startOf('month')
      //   .subtract(1, 'month')
      //   .format('YYYY-MM-DD'),

      startDate: this.$dayjs(this.startDate, 'YYYY-MM-DD'),

      headers: [
        { text: '', align: 'start', sortable: false, value: 'time' },
        { text: '', align: 'start', sortable: false, value: 'title' },
        { text: '', align: 'end', sortable: false, value: 'rvsp' },
      ],
      minHeight: 116,
      options: {
        threshold: 0.5,
      },
    };
  },

  mounted() {
    this.$emit('change', {
      start: this.start,
      end: this.end,
    });
  },

  methods: {
    prev() {
      this.startDate = this.$dayjs(this.startDate).subtract(6, 'month');
      this.$emit('change', {
        start: this.start,
        end: this.end,
      });
    },
    next() {
      this.startDate = this.$dayjs(this.startDate).add(6, 'month');
      this.$emit('change', {
        start: this.start,
        end: this.end,
      });
    },
  },

  computed: {
    startMonth() {
      return this.$dayjs(this.startDate).format('MMMM YYYY');
    },

    start() {
      return this.$dayjs(this.startDate).startOf('month').format('YYYY-MM-DD');
    },

    end() {
      return this.$dayjs(this.start).add(6, 'month').format('YYYY-MM-DD');
    },

    endMonth() {
      return this.$dayjs(this.startDate).add(6, 'month').format('MMMM YYYY');
    },

    title() {
      return `${this.startMonth} - ${this.endMonth}`;
    },

    headerDateClasses() {
      return [
        'upcoming-list-date-header',
        { 'text-center': this.$vuetify.breakpoint.smAndDown },
      ];
    },

    daysInMonth() {
      // return this.$dayjs(this.selectedDate).daysInMonth();
      return this.selectedDate.daysInMonth();
    },

    days() {
      // return [...Array(this.daysInMonth)].map((day, index) => {
      //   const dateStr = `${this.year}-${this.month}-${index + 1}`;
      //   const date = this.$dayjs(dateStr);

      //   const headerDate = this.$dayjs(date).format('dddd, MMMM D, YYYY');
      // const events = this.events.sort(sortByTime).filter((event) => {
      //   const start = event.extendedProps.start_date;
      //   const end = event.extendedProps.end_date;

      //   return this.$dayjs(date).isBetween(start, end, null, '[]');
      // });

      //   return { date: dateStr, headerDate, events };
      // });

      let numOfMonths = 6;
      let start = this.$dayjs().subtract(2, 'month');
      let end = this.$dayjs(start).add(numOfMonths, 'month');
      let months = [];

      while (this.$dayjs(start).isBefore(end)) {
        // const month = this.$dayjs().month(parseInt(start.format('M'), 10));
        const month = this.$dayjs(start).add(1, 'month');
        const yearOfMonth = month.format('YYYY');
        const startOfMonth = month.startOf('month');
        const endOfMonth = month.endOf('month');
        const daysInMonth = month.daysInMonth();

        const hasEvents = this.events.some((event) => {
          const start = event.extendedProps.start_date;
          const end = event.extendedProps.end_date;
          return this.$dayjs(startOfMonth).isBetween(start, end, null, '[]');
        });

        const days = [...Array(month.daysInMonth())].reduce(
          (output, day, index) => {
            const dateStr = `${month.year()}-${month.month()}-${index + 1}`;
            const date = this.$dayjs(dateStr);
            const headerDate = date.format('dddd, MMMM D, YYYY');
            const events = this.internalEvents
              .sort(sortByTime)
              .filter((event) => {
                const start = event.extendedProps.start_date;
                const end = event.extendedProps.end_date;

                return this.$dayjs(date).isBetween(start, end, null, '[]');
              });

            if (events.length) {
              output.push({ date: dateStr, headerDate, events });
            }

            return output;
          },
          []
        );

        months.push(...days);

        // if (hasEvents) {
        //   const days = [...Array(month.daysInMonth())].reduce(
        //     (output, day, index) => {
        //       const dateStr = `${month.year()}-${month.month()}-${index + 1}`;
        //       const date = this.$dayjs(dateStr);
        //       const headerDate = date.format('dddd, MMMM D');
        //       const events = this.internalEvents
        //         .sort(sortByTime)
        //         .filter((event) => {
        //           const start = event.extendedProps.start_date;
        //           const end = event.extendedProps.end_date;

        //           return this.$dayjs(date).isBetween(start, end, null, '[]');
        //         });

        //       if (events.length) {
        //         output.push({ date, headerDate, events });
        //       }

        //       return output;
        //     },
        //     []
        //   );

        //   months.push(...days);
        // }

        start = this.$dayjs(start).add(1, 'month');
      }
      return months;
    },

    internalEvents() {
      return [...this.events];
    },
  },
};
</script>
