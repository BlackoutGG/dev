<template>
  <v-row class="upcoming-event" align="center">
    <v-col md="2" cols="12">
      <div :class="timeClasses">
        <v-icon :color="color">mdi-circle-medium</v-icon>
        <div class="px-2">{{ eventTime }}</div>
      </div>
    </v-col>
    <v-col md="4" cols="12" :class="titleClasses">
      <span>{{ event.title }}</span>
    </v-col>
    <v-col md="6" cols="12">
      <div :class="buttonWrapperClasses">
        <v-spacer v-if="!$vuetify.breakpoint.smAndDown"></v-spacer>
        <v-btn outlined small @click="joinEvent"> {{ eventJoinStatus }}</v-btn>
        <span class="pl-3"
          >{{ event.extendedProps.participants }} are coming</span
        >
      </div>
      <div v-if="$vuetify.breakpoint.smAndDown">
        <div class="mt-6"></div>
        <v-divider></v-divider>
        <div class="pb-4"></div>
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

    titleClasses() {
      return { 'text-center': this.$vuetify.breakpoint.smAndDown };
    },

    timeClasses() {
      return [
        'd-flex',
        'align-center',
        { 'justify-center': this.$vuetify.breakpoint.smAndDown },
      ];
    },

    buttonWrapperClasses() {
      return [
        'd-flex',
        { 'justify-center': this.$vuetify.breakpoint.smAndDown },
      ];
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

    eventTime() {
      const start = this.$dayjs(this.event.start).format('h:mm a');
      const end = this.$dayjs(this.event.end).format('h:mm a');

      if (this.event.extendedProps.isMultiDay) {
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
