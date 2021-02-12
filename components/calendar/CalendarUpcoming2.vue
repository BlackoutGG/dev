<template>
  <section id="upcoming" v-if="isMonthView">
    >
    <template v-for="(day, idx) in days">
      <v-lazy :key="idx" :min-height="minHeight" :options="lazyOptions">
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
  <section id="upcoming" v-else>
    <v-row>
      <v-col cols="12">
        <v-sheet class="pa-4 mb-2" :min-width="'100%'">
          <upcoming-event
            v-for="(event, i) in singleDayEvents"
            :key="i"
            :event="event"
            :date="day.date"
          ></upcoming-event>
        </v-sheet>
      </v-col>
    </v-row>
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

    options: {
      type: Object,
      default: () => ({
        type: 'month',
        start: this.$dayjs(this.startDate, 'YYYY-MM-DD'),
        rangeWidth: 6,
      }),
    },
  },

  data() {
    return {
      // startDate: this.$dayjs()
      //   .startOf('month')
      //   .subtract(1, 'month')
      //   .format('YYYY-MM-DD'),

      // startDate: this.$dayjs(this.startDate, 'YYYY-MM-DD'),

      startDate: this.options.start,

      headers: [
        { text: '', align: 'start', sortable: false, value: 'time' },
        { text: '', align: 'start', sortable: false, value: 'title' },
        { text: '', align: 'end', sortable: false, value: 'rvsp' },
      ],
      minHeight: 116,
      lazyOptions: {
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
      this.startDate = this.$dayjs(this.startDate).subtract(
        this.options.rangeWidth,
        this.options.type
      );
      this.$emit('change', {
        start: this.isMonthView
          ? this.start
          : this.$dayjs(this.startDate).format('YYYY-MM-DD'),
        end: this.isMonthView
          ? this.end
          : this.$dayjs(this.startDate).format('YYYY-MM-DD'),
      });
    },
    next() {
      this.startDate = this.$dayjs(this.startDate).add(
        this.options.rangeWidth,
        this.options.type
      );
      this.$emit('change', {
        start: this.isMonthView
          ? this.start
          : this.$dayjs(this.startDate).format('YYYY-MM-DD'),
        end: this.isMonthView
          ? this.end
          : this.$dayjs(this.startDate).format('YYYY-MM-DD'),
      });
    },
  },

  computed: {
    isDayView() {
      return this.options.type === 'day';
    },

    isMonthView() {
      return this.options.type === 'month';
    },

    startMonth() {
      return this.$dayjs(this.startDate).format('MMMM YYYY');
    },

    start() {
      return this.$dayjs(this.startDate).startOf('month').format('YYYY-MM-DD');
    },

    end() {
      return this.$dayjs(this.start)
        .add(this.options.rangeWidth, this.options.type)
        .format('YYYY-MM-DD');
    },

    endMonth() {
      return this.$dayjs(this.startDate)
        .add(this.options.rangeWidth, this.options.type)
        .format('MMMM YYYY');
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

    singleDayEvents() {
      return this.internalEvents.filter((event) => {
        const start = event.extendedProps.start_date;
        const end = event.extendedProps.end_date;
        return this.$dayjs(this.startDate).isBetween(start, end, null, '[)');
      });
    },

    dayMonth() {
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

    days() {
      let modifier = 6;
      let start = this.$dayjs().subtract(2, 'month');
      let end = this.$dayjs(start).add(modifier, 'month');
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
