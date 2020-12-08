<template>
  <v-row>
    <v-col cols="12">
      <div class="calendar-headers">
        <div class="calendar-header" v-for="weekday in weekdays" :key="weekday">
          {{ weekday }}
        </div>
      </div>
      <v-sheet>
        <div class="calendar-daygrid">
          <calendar-day
            v-for="day in days"
            :events="ordered"
            :key="day.date"
            :day="day"
            :today="day.date === selectedDate"
            @eventClick="showPopover"
            @dayClick="onDayClick"
          ></calendar-day>
        </div>
        <event-popover ref="popover" @edit="setEditableContent"></event-popover>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import uniqBy from 'lodash/uniqBy';
import { nanoid } from 'nanoid';

import CalendarDay from './CalendarDay4.vue';
import EventDialog from '~/components/events/EventDialog.vue';
import EventPopover from '~/components/events/EventPopover.vue';
import TableFilterOptions from '~/components/table/TableFilterOptions.vue';

import events from '~/utilities/ns/public/events.js';
import lists from '~/utilities/ns/public/lists.js';
import filters from '~/utilities/ns/public/filters.js';

export default {
  name: 'MyCalendar',
  components: { CalendarDay, EventPopover, EventDialog, TableFilterOptions },

  props: {
    events: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      selectedDate: this.$dayjs(this.selectedDate, 'YYYY-MM-DD'),
      view: 'dayMonthGrid',
      name: 'events',
    };
  },

  mounted() {
    const start = this.startOfCalendarView;
    const end = this.endOfCalendarView;
    // this.$store.dispatch(events.actions.FETCH, { start, end });
    this.$emit('change', { start, end });
  },

  methods: {
    prev() {
      this.selectedDate = this.$dayjs(this.selectedDate).subtract(1, 'month');

      const start = this.startOfCalendarView;
      const end = this.endOfCalendarView;
      this.$emit('change', {
        viewStartDate: start,
        viewEndDate: end,
        start: this.startOfMonth,
        end: this.endOfMonth,
      });
      // this.$store.dispatch(events.actions.FETCH, { start, end });
    },
    next() {
      this.selectedDate = this.$dayjs(this.selectedDate).add(1, 'month');

      const start = this.startOfCalendarView;
      const end = this.endOfCalendarView;
      this.$emit('change', {
        viewStartDate: start,
        viewEndDate: end,
        start: this.startOfMonth,
        end: this.endOfMonth,
      });
      // this.$store.dispatch(events.actions.FETCH, { start, end });
    },
    getWeekday(date) {
      return this.$dayjs(date).weekday();
    },
    showPopover({ nativeEvent, event, el }) {
      this.$refs.popover.toggle(event, el);
      nativeEvent.stopPropagation();
    },
    onDayClick(date) {
      // console.log(date);
      // this.$refs.dialog.openFromDate(date);

      this.$emit('dayClick', date);
    },

    setEditableContent(event) {
      this.$refs.dialog.setEditableContent(event);
    },
  },

  computed: {
    internalEvents() {
      return [...this.events];
    },

    title() {
      return this.selectedMonth;
    },

    weekdays() {
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    },

    year() {
      return this.$dayjs(this.selectedDate).format('YYYY');
    },

    month() {
      return this.$dayjs(this.selectedDate).format('MM');
    },

    startOfMonth() {
      return this.$dayjs(this.selectedDate)
        .startOf('month')
        .format('YYYY-MM-DD');
    },

    endOfMonth() {
      return this.$dayjs(this.selectedDate).endOf('month').format('YYYY-MM-DD');
    },

    startOfCalendarView() {
      const start = this.previousMonthDays.length
        ? this.previousMonthDays[0].date
        : this.startOfMonth;
      return start;
    },

    endOfCalendarView() {
      const end = this.nextMonthsDays
        ? this.nextMonthsDays[this.nextMonthsDays.length - 1].date
        : this.endOfMonth;
      return end;
    },

    selectedMonth() {
      return this.$dayjs(this.selectedDate).format('MMMM YYYY');
    },

    daysInMonth() {
      // return this.$dayjs(this.selectedDate).daysInMonth();
      return this.selectedDate.daysInMonth();
    },

    currentMonthDays() {
      return [...Array(this.daysInMonth)].map((day, index) => {
        const dayDate = this.$dayjs(`${this.year}-${this.month}-${index + 1}`);
        const date = dayDate.format('YYYY-MM-DD');
        const dayText = dayDate.format('D');

        return {
          date,
          dayDate,
          dayText,
          isCurrentMonth: true,
          isPast: false,
          isFuture: false,
        };
      });
    },

    previousMonthDays() {
      const display = [];
      const previous = this.selectedDate.date(0);
      const current = this.selectedDate.date(0);

      for (let i = 0; i <= current.day(); i++) {
        const dayDate = previous.subtract(i, 'day');
        const date = dayDate.format('YYYY-MM-DD');
        const dayText = dayDate.format('D');

        display.push({
          dayDate,
          date,
          dayText,
          isCurrentMonth: false,
          isPast: true,
          isFuture: false,
        });
      }

      const isFullRow = display.length === 7;

      const monthStartSunday =
        this.selectedDate.startOf('month').format('ddd') === 'Sun';

      return monthStartSunday
        ? []
        : display.sort((a, b) => a.dayDate.$d - b.dayDate.$d);
    },

    ordered() {
      const sortByTime = (a, b) => {
        const startA = new Date(a.start);
        const startB = new Date(b.start);
        return startA - startB;
      };

      // let ref = nanoid();

      const days = this.days.reduce((output, day) => {
        const events = this.internalEvents
          .filter((event) => {
            const start = event.extendedProps.start_date;
            const end = event.extendedProps.end_date;

            return this.$dayjs(day.date).isBetween(start, end, null, '[]');
          })
          .sort(sortByTime)
          .map((event, order, arr) => {
            let ref = nanoid();
            const isMulti = event.extendedProps.isMultiDay;
            const isStart = event.extendedProps.start_date === day.date;
            const isEnd = event.extendedProps.end_date === day.date;
            if (isMulti) {
              const result = {
                order,
                start: event.start,
                end: event.end,
                ref,
                ...event,
              };

              if (!isStart) {
                result.date = day.date;
              } else {
                result.date = this.$dayjs(event.start).format('YYYY-MM-DD');
                // result.order = order;
              }

              if (isEnd) ref = nanoid();
              return result;
            }

            return {
              order,
              date: day.date,
              start: event.start,
              end: event.end,
              ref: nanoid(),
              ...event,
            };
          });

        output.push(...events);
        return output;
      }, []);

      return days;
    },

    nextMonthsDays() {
      const display = [];
      const previous = this.previousMonthDays.length;
      const current = this.daysInMonth;
      const nextMonth = this.$dayjs(this.startOfMonth).add(1, 'month');

      for (let i = 1; i <= 42 - (previous + current); i++) {
        const dateStr = `${nextMonth.year()}-${nextMonth.month() + 1}-${i}`;

        const dayDate = this.$dayjs(dateStr);
        const date = dayDate.format('YYYY-MM-DD');
        const dayText = dayDate.format('D');

        display.push({
          dayDate,
          date,
          dayText,
          isCurrentMonth: false,
          isPast: false,
          isFuture: true,
        });
      }

      return display;
    },

    days() {
      return [
        ...this.previousMonthDays,
        ...this.currentMonthDays,
        ...this.nextMonthsDays,
      ];
    },
  },
};
</script>

<style lang="scss">
$grid-gap: 0px;
$border: 1px solid #121212;

.calendar {
  &-headers {
    padding-left: 10px;
    padding-bottom: 8px;
    font-weight: 700;
  }
  &-headers,
  &-daygrid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }
  &-daygrid {
    height: 100%;
    position: relative;
    grid-column-gap: $grid-gap;
    grid-row-gap: $grid-gap;
    // border-color: $border-color;
  }
  &-header {
    text-align: left;
    padding-right: 5px;
  }
  &-day {
    position: relative;
    min-height: 180px;
    max-height: 180px;
    border-right: 1px solid #121212;
    border-top: 1px solid #121212;
    cursor: pointer;
    &:hover,
    .outside:hover {
      background-color: rgba(55, 55, 55, 0.3);
    }
    &.outside {
      background-color: rgba(22, 22, 22, 0.5);
    }
    &.today {
      .calendar-day-top > .calendar-day-label {
        border-radius: 50%;
        width: 30px;
        height: 30px;
        text-align: center;
        padding: 4px;
        background-color: #121212;
      }
    }
  }
}

.calendar-day-top {
  font-size: 0.9rem;
  padding: 8px 8px 5px 5px;
  .calendar-day-label {
    padding: 4px;
  }
}
</style>
