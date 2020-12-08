<template>
  <div :class="rootClasses" :data-date="day.date" @click="emitAddEventButton">
    <div class="calendar-day-top d-flex">
      <div class="calendar-day-label">{{ day.dayText }}</div>
      <v-spacer></v-spacer>
      <v-btn
        class="calendar-day-add"
        icon
        small
        right
        @click="emitAddEventButton"
      >
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

      <!-- <template v-for="n in numOfEventsVisible">
        <calendar-event
          v-if="visible[n - 1] && visible[n - 1].order === n - 1"
          :key="n"
          :event="visible[n - 1]"
          :date="day.date"
          @click.stop.native="emitEventClick($event, visible[n - 1])"
        ></calendar-event>
        <div class="calendar-event placeholder" :key="n" v-else></div>
      </template> -->

      <!-- <template v-for="n in numOfEventsVisible">
        <calendar-event
          v-if="visible[n - 1]"
          :key="n"
          :event="visible[n - 1]"
          :date="day.date"
          :order="n - 1"
          @click.stop.native="emitEventClick($event, visible[n - 1])"
        ></calendar-event>
        <div class="calendar-event placeholder" :key="n" v-else></div>
      </template> -->

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
            <calendar-event
              v-for="extra in more"
              :key="extra.ref"
              :event="extra"
              :date="day.date"
              @click.native="emitEventClick($event, extra)"
            ></calendar-event>
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
    emitAddEventButton() {
      this.$emit('addEvent', this.day.date);
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

    dayEvents() {
      return (
        this.events
          .filter((event) => event.date === this.day.date)

          // .map((event, idx) => {
          //   if (isMulti(event) && isStart(event, this.day.date)) {
          //     event.order = idx;
          //   }

          //   if (isStart(event, this.day.date)) event.order = idx;
          //   return event;
          // })
          .map((event, idx) => {
            if (isMulti(event) && !isStart(event, this.day.date)) {
              const start = event.extendedProps.start_date;
              const parent = this.events.find(
                (e) => isMulti(e) && e.id === event.id && e.date === start
              );
              if (parent) return parent;
            }
            return event;
          })
      );

      // .map((event, idx) => {
      //   const { order, ...e } = event;
      //   return { order: idx, ...e };
      // });
    },

    overflow() {
      return this.dayEvents.reduce((output, event) => {
        // const isMulti = event.extendedProps.isMultiDay;
        // const isStart = event.extendedProps.start_date === this.day.date;
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

    visibleEvents() {
      return this.dayEvents.map((e, idx, arr) => {
        const start = e.extendedProps.start_date;
        const prev = this.dayEvents[idx - 1];
        // const next = this.dayEvents[idx + 1];

        // if (!isMulti(e) && isStart(e, this.day.date)) {
        //   const { order, ...event } = e;
        //   if (prev && isMulti(prev) && !isStart(prev, this.day.date)) {
        //     if (prev.order === e.order) return { order: e.order - prev.order, ...event };
        //   }
        // }

        if (isMulti(e)) {
          if (!isStart(e, this.day.date)) {
            const slot = this.dayEvents[e.order];
            console.log(slot);
            if (slot && e.order >= slot.order) {
              return { order: slot.order + 1, ...e };
            }
          }
          //   const { order, ...event } = e;
          //   if (!isStart(e, this.day.date)) {
          //     if (next && isMulti(next) && isStart(next, this.day.date)) {
          //       return { order: next.order + 1, ...event };
          //     }
          //   }
          //   if (isStart(e, this.day.date)) {
          //     if (prev && isMulti(prev) && !isStart(prev, this.day.date)) {
          //       if (prev.order === e.order) {
          //         // return { order: e.order - prev.order, ...event };
          //         e.order = e.order - prev.order;
          //       }
          //     }
          //   }
          // if (!isStart(e, this.day.date)) {
          //   const next = this.dayEvents[e.order];
          //   if (next && !isMulti(next)) {
          //     if (e.order >= next.order) {
          //       // next.order = next.order - e.order;
          //       e.order = next.order;
          //     }
          //   }
          // }
          // if (!isStart(e, this.day.date)) {
          //   const max = e.order;
          //   for (let order = idx; order <= max; order++) {
          //     const next = this.dayEvents[order];
          //     if (next && !isMulti(next)) {
          //       if (e.order >= next.order) {
          //         next.order -= 1;
          //       }
          //     }
          //   }
          // }
        }

        // if (!isMulti(e)) {
        //   const { order, ...event } = e;
        //   let _order;

        //   if (prev && isMulti(prev) && !isStart(prev, this.day.date)) {
        //     console.log('next', prev);
        //   }

        //   if (next && isMulti(next) && !isStart(next, this.day.date)) {
        //     console.log('next', next);
        //   }
        // }

        return e;
      });
    },

    computedEvents() {
      const sortByTime = (a, b) => {
        const startA = new Date(a.start);
        const startB = new Date(b.start);
        return startA - startB;
      };
      return (
        this.visibleEvents
          // .sort(sortByTime)
          .sort((a, b) => a.order - b.order)
          .map((e, idx) => {
            const previous = this.visibleEvents[idx - 1];
            /**
             * Check to see if we have multi day events flowing over from other dates.
             * If so we need to readjust the order property.
             */

            if (previous && !isMulti(previous)) {
              if (this.overflow) {
                const { order, ...event } = e;
                return { order: order ? order - 1 : order, ...event };
              }
            }
            return e;
          })
      );
      // .map((e, idx) => {
      //   const { order, ...event } = e;
      //   return { order: idx, ...event };
      // });
    },

    more() {
      return this.computedEvents.filter((event) => event.order >= 4);
    },

    visible() {
      return this.computedEvents.filter((event) => event.order <= 3);

      // const events = this.computedEvents.filter((event) => event.order <= 3);

      // let display = Array(4).fill(null);

      // for (let i = 0; i <= this.numOfEventsVisible - 1; i++) {
      //   if (events[i]) {
      //     const event = events[i];
      //     const order = event.order;
      //     display.splice(order, 1, event);
      //   } else {
      //     display.push(null);
      //   }
      // }

      // return display.splice(0, 4);
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
