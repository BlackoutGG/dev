<template>
  <div :class="rootClasses" :data-date="day.date">
    <div class="calendar-day-top d-flex">
      <div class="calendar-day-label" @click="onDayDateClick">
        {{ day.dayText }}
      </div>
      <v-spacer></v-spacer>
      <v-btn class="calendar-day-add" icon small right @click="onDayClick">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
    <div class="calendar-day-events">
      <template v-for="(event, i) in visible">
        <calendar-event
          v-if="event"
          :key="event.ref"
          :event="event"
          :date="day.date"
          @click.stop.native="emitEventClick($event, event)"
        ></calendar-event>
        <div class="calendar-event placeholder" :key="i" v-else></div>
      </template>

      <v-menu v-if="more.length" offset-y open-on-hover>
        <template #activator="{ on, attrs }">
          <div class="more-info pl-2" v-on="on" v-bind="attrs">
            {{ more.length }} more...
          </div>
        </template>
        <v-card
          tile
          :min-width="minWidth"
          :color="color"
          :close-on-content-click="closeOnContentClick"
        >
          <v-card-text class="px-2">
            <template v-for="extra in more">
              <calendar-event
                v-if="extra"
                :key="extra.ref"
                :event="extra"
                :date="day.date"
                @click.native="emitEventClick($event, extra)"
              ></calendar-event>
            </template>
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
  </div>
</template>

<script>
import CalendarEvent from './CalendarDayEvent.vue';
import cloneDeep from 'lodash/cloneDeep';
import arrayMove from 'array-move';

const isMulti = (event) => event.extendedProps.isMultiDay;
const isStart = (event, date) => event.extendedProps.start_date === date;

export default {
  name: 'CalendarDay',

  components: { CalendarEvent },

  props: {
    day: {
      type: Object,
    },
    today: {
      type: Boolean,
    },
    numOfEventsVisible: {
      type: Number,
      default: 4,
    },
    events: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      minWidth: 200,
      color: '#000',
      closeOnContentClick: false,
    };
  },

  methods: {
    emitEventClick($event, event) {
      this.$emit('eventClick', {
        nativeEvent: $event,
        el: $event.currentTarget,
        event,
      });
    },
    onDayClick() {
      this.$emit('dayClick', this.day.date);
    },
    onDayDateClick() {
      console.log('dayDateClick');
      this.$emit('dayDateClick', this.day.date);
    },
    sortEvents(a, b) {
      if (isMulti(a) && !isStart(a, this.day.date)) {
        const start = a.extendedProps.start_date;
        const relative = this.events.find(
          (evt) => isMulti(evt) && evt.id === a.id && evt.date === start
        );

        if (relative) {
          return relative.order >= b.order
            ? 1
            : relative.order <= b.order
            ? -1
            : 1;
        } else {
          return a.order >= b.order ? -1 : a.order <= b.order ? 1 : 0;
        }
      }
      return 0;

      // return a.order >= b.order ? -1 : a.order <= b.order ? 1 : 0;
    },
    reduceEvents(output, event, idx) {
      const start = event.extendedProps.start_date;
      const isEventStartDate = isStart(event, this.day.date);

      // if (isEventStartDate) {
      //   event.order = idx;
      // }

      if (isMulti(event) && !isStart(event, this.day.date)) {
        const start = event.extendedProps.start_date;
        const relative = this.events.find(
          (evt) => isMulti(evt) && evt.id === event.id && evt.date === start
        );
        if (relative) output[relative.order] = relative;
      } else {
        output[event.order] = event;
        // output.push(event);
      }

      return output;
    },
  },

  computed: {
    rootClasses() {
      return [
        'calendar-day',
        {
          outside: !this.day.isCurrentMonth,
          today: this.$dayjs(this.day.date).isToday(),
        },
      ];
    },

    filteredEvents() {
      return this.events.filter((event) => event.date === this.day.date);
    },

    sortedEvents() {
      return this.filteredEvents.sort(this.sortEvents).map((event, idx) => {
        const start = isStart(event, this.day.date);
        if (start) event.order = idx;
        return event;
      });
    },

    dayEvents() {
      // return this.sortedEvents.reduce(this.reduceEvents, []);
      return this.sortedEvents.map((event, idx, arr) => {
        const prev = arr[idx - 1];
        const next = arr[idx + 1];

        // if (isMulti(event) && !isStart(event, this.day.date)) {
        //   if (next && isStart(next, this.day.date)) {
        //     if (next.order === event.order) {
        //       next.order = event.order - 1;
        //     }
        //   }
        // }

        return event;
      });
    },

    overflow() {
      return this.dayEvents.reduce((output, event) => {
        const start = event.extendedProps.start_date;

        if (isMulti(event) && !isStart(event, this.day.date)) {
          const match = this.events.find(
            (evt) =>
              evt.extendedProps.isMultiDay &&
              evt.id === event.id &&
              evt.date === start
          );
          // if (match) output.push(match);
          output++;
        }
        return output;
      }, 0);
    },

    visible() {
      // return this.dayEvents.filter((event) => event.order <= 3);
      // return [...this.dayEvents].slice(0, 4);

      const events = this.dayEvents;
      const display = Array(4).fill(null);

      for (let i = 0; i < this.numOfEventsVisible - 1; i++) {
        if (events[i]) {
          const event = events[i];
          const order = event.order;
          display.splice(order, 1, event);
        } else {
          display.push(null);
        }
      }

      return display.slice(0, 4);
    },

    more() {
      // return this.dayEvents.filter((event) => event.order >= 4);
      return [...this.dayEvents].splice(4);
    },
  },
};
</script>

<style lang="scss" scoped>
.more {
  width: 100%;
  .more-arrow {
    width: 0px;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #000;
    position: absolute;
    top: -50px;
  }
}
</style>
