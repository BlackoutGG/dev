<template>
  <div class="d-flex">
    <v-spacer></v-spacer>
    <v-btn outlined @click="joinEvent"> {{ eventJoinStatus }}</v-btn>
  </div>
</template>

<script>
import events from '~/utilities/ns/public/events.js';

export default {
  name: 'EventJoinButton',

  props: {
    item: {
      type: Object,
    },
  },

  methods: {
    joinEvent() {
      this.$store.dispatch(events.actions.TOGGLE_JOIN, {
        rvsp_enabled: this.item.rvsp,
        joined: this.item.joined,
        event_id: this.item.id,
      });
    },
  },

  computed: {
    eventJoinStatus() {
      return this.item.extendedProps.joined ? 'Leave' : 'Join';
    },
  },
};
</script>
