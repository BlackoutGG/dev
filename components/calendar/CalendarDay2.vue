<template>
  <div :class="rootClasses" :data-date="day.date" @click="onDayClick">
    <div class="calendar-day-top d-flex">
      <div class="calendar-day-label">{{ day.dayText }}</div>
      <v-spacer></v-spacer>
      <v-btn class="calendar-day-add" icon small right @click="onDayClick">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
    <div class="calendar-day-events">
      <template v-for="(event, i) in dayEvents">
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
          v-if="visible[n - 1] !== undefined && visible[n - 1].order === n - 1"
          :key="n"
          :event="visible[n - 1]"
          :date="day.date"
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
    onDayClick() {
      this.$emit('dayClick', this.day.date);
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
      return this.events
        .filter((event) => event.date === this.day.date)
        .map((event, idx) => {
          if (isMulti(event) && !isStart(event, this.day.date)) {
            const start = event.extendedProps.start_date;
            const parent = this.events.find(
              (e) => isMulti(e) && e.id === event.id && e.date === start
            );
            if (parent) return parent;
          }
          if (!isMulti(event)) event.order = idx;
          return event;
        });

      // .map((event, idx) => {
      //   const { order, ...e } = event;
      //   return { order: idx, ...e };
      // });
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

    more() {
      return this.dayEvents.filter((event) => event.order >= 4);
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
