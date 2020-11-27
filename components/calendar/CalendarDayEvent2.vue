<template>
  <div
    :class="['calendar-event d-flex align-center', rootClasses]"
    v-if="isStart && isEnd"
  >
    <v-icon :color="color">mdi-circle-medium</v-icon>
    <span class="calendar-event-time pr-1">{{ event.timeText }}</span>
    <span class="font-weight-bold">{{ event.title }}</span>
  </div>
  <div
    :class="['calendar-event pl-2 d-flex align-center', rootClasses]"
    v-else-if="isStart && isMultiDay"
    :style="styles"
  >
    <span class="calendar-event-time pr-1">{{ event.timeText }}</span>
    <span class="font-weight-bold">{{ event.title }}</span>
  </div>
  <div
    :class="['calendar-event calendar-event-block', rootClasses]"
    :style="styles"
    v-else-if="!isStart && isMultiDay"
  ></div>
</template>

<script>
export default {
  name: 'CalendarEvent',
  props: {
    event: {
      type: Object,
    },
    date: {
      type: String,
    },
  },
  computed: {
    isStart() {
      return this.$dayjs(this.event.extendedProps.start_date).isSame(this.date);
    },

    isEnd() {
      return this.$dayjs(this.event.extendedProps.end_date).isSame(this.date);
    },

    isRecurring() {
      return this.event.isRecurring;
    },

    isMultiDay() {
      return this.event.extendedProps.isMultiDay;
    },

    color() {
      return this.event.color || 'primary';
    },

    eventDurationInDays() {
      return this.$dayjs(this.event.end).diff(this.event.start, 'day');
    },

    styles() {
      return {
        backgroundColor: this.event.extendedProps.color || '#1976d2',
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
