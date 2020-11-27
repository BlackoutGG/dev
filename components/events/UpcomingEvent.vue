<template>
  <v-row class="upcoming-event" align="center">
    <v-col md="4">
      <div class="d-flex align-center">
        <v-icon :color="color">mdi-circle-medium</v-icon>
        <div class="px-2">{{ eventTime }}</div>
      </div>
    </v-col>
    <v-col md="6">
      <span>{{ event.title }}</span>
    </v-col>
    <v-col md="2">
      <div class="d-flex">
        <v-spacer></v-spacer>
        <v-btn outlined @click="joinEvent"> {{ eventJoinStatus }}</v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import events from '~/utilities/ns/public/events.js';
export default {
  name: 'UpcomingEvent',

  props: {
    event: {
      type: Object,
    },
    date: {
      type: String,
    },
  },

  methods: {
    joinEvent() {
      this.$store.dispatch(events.actions.TOGGLE_JOIN, {
        rvsp_enabled: this.event.rvsp,
        joined: this.event.joined,
        event_id: this.event.id,
      });
    },
  },

  computed: {
    eventJoinStatus() {
      return this.event.extendedProps.joined ? 'Leave' : 'Join';
    },

    color() {
      return this.event.color || 'primary';
    },

    isStart() {
      return this.$dayjs(this.event.extendedProps.start_date).isSame(this.date);
    },

    isEnd() {
      return this.$dayjs(this.event.extendedProps.end_date).isSame(this.date);
    },

    isRecurring() {
      return this.event.isRecurring;
    },

    eventTime() {
      const start = this.$dayjs(this.event.start).format('h:mm a');
      const end = this.$dayjs(this.event.end).format('h:mm a');

      if (this.event.isRecurring) {
        if (this.isStart) return `Starts at ${start}`;
        else if (this.isEnd) return `Ends at ${end}`;
        else return 'All day';
      }

      return `${start} - ${end}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.upcoming-event {
  cursor: pointer;
  &:hover {
    background-color: rgba(22, 22, 22, 0.5);
  }
}
</style>
