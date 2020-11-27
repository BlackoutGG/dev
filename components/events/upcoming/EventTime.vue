<template>
  <div class="d-flex align-center">
    <v-icon :color="color">mdi-circle-medium</v-icon>
    <div class="px-2">{{ eventTime }}</div>
  </div>
</template>

<script>
export default {
  name: 'UpcomingEventTime',

  props: {
    item: {
      type: Object,
    },

    date: {
      type: String,
    },
  },

  computed: {
    color() {
      return this.item.color || 'primary';
    },

    isStart() {
      return this.$dayjs(this.item.extendedProps.start_date).isSame(this.date);
    },

    isEnd() {
      return this.$dayjs(this.item.extendedProps.end_date).isSame(this.date);
    },

    eventTime() {
      const start = this.$dayjs(this.item.start).format('h:mm a');
      const end = this.$dayjs(this.item.end).format('h:mm a');

      if (this.item.isRecurring) {
        if (this.isStart) return `Starts at ${start}`;
        else if (this.isEnd) return `Ends at ${end}`;
        else return 'All day';
      }

      return `${start} - ${end}`;
    },
  },
};
</script>
