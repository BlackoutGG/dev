<script>
import VIcon from 'vuetify/lib';

export default {
  name: 'CalendarEvent3',

  components: { VIcon },

  props: {
    event: {
      type: Object,
    },
    date: {
      type: String,
    },
    order: {
      type: Number,
    },
  },

  methods: {
    genEventDetails() {
      return [
        this.$createElement(
          'span',
          { staticClass: 'calendar-event-time pr-1' },
          [this.event.timeText]
        ),
        this.$createElement('span', { staticClass: 'font-weight-bold' }, [
          this.event.title,
        ]),
      ];
    },

    genSingleDayEvent() {
      const iconOptions = {
        props: {
          color: this.color,
        },
      };

      const rootOptions = {
        staticClass: 'calendar-event d-flex align-center',
        class: this.rootClasses,
      };
      return this.$createElement('div', rootOptions, [
        this.$createElement('v-icon', iconOptions, ['mdi-circle-medium']),
        this.genEventDetails(),
      ]);
    },

    genMultiDayEvent() {
      const rootOptions = {
        staticClass: 'calendar-event pl-2 d-flex align-center',
        class: this.rootClasses,
        style: this.styles,
      };

      return this.$createElement('div', rootOptions, [
        this.isStart && this.isMultiDay ? this.genEventDetails() : [],
      ]);
    },
  },

  render(h) {
    return this.event && this.event.order === this.order
      ? this.isMultiDay
        ? this.genMultiDayEvent()
        : this.genSingleDayEvent()
      : this.$createElement('div', {
          staticClass: 'calendar-event placeholder',
        });
  },

  computed: {
    isStart() {
      return this.event
        ? this.$dayjs(this.event.extendedProps.start_date).isSame(this.date)
        : false;
    },

    isEnd() {
      return this.event
        ? this.$dayjs(this.event.extendedProps.end_date).isSame(this.date)
        : false;
    },

    isRecurring() {
      return this.event ? this.event.isRecurring : false;
    },

    isMultiDay() {
      return this.event ? this.event.extendedProps.isMultiDay : false;
    },

    color() {
      return this.event ? this.event.color : 'primary';
    },

    eventDurationInDays() {
      return this.event
        ? this.$dayjs(this.event.end).diff(this.event.start, 'day')
        : 0;
    },

    styles() {
      return {
        backgroundColor: this.event
          ? this.event.extendedProps.color
          : '#1976d2',
      };
    },

    rootClasses() {
      return {
        'event-end': this.isEnd,
        'event-start': this.isStart,
      };
    },

    // eventTime() {
    //   return this.$dayjs(this.event.start).format('h:mma').replace(/m/g, '');
    // },
  },
};
</script>

<style lang="scss">
.calendar-event {
  width: 100%;
  position: relative;
  min-height: 24px;
  font-size: 0.85rem;
  margin-bottom: 4px;
  cursor: pointer;
  &:hover {
    background-color: rgba(22, 22, 22, 0.5);
  }
}
</style>
