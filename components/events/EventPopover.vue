<template>
  <v-menu
    v-model="open"
    offset-x
    max-width="600px"
    :close-on-content-click="false"
    :activator="element"
  >
    <v-card flat>
      <v-toolbar dark>
        <v-btn icon @click="editEvent">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-toolbar-title>{{ event.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <!-- <event-view :event="event"></event-view> -->
      </v-card-text>
      <v-card-actions>
        <v-icon>mdi-account-group</v-icon>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="open = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import EventForm from './EventForm.vue';
import EventView from './EventView.vue';
import events from '~/utilities/ns/public/events.js';
export default {
  name: 'CalEventPopover',

  components: { EventView },

  data() {
    return {
      open: false,
      readonly: true,
      element: null,
      event: {},
    };
  },

  methods: {
    closeOnUpdate() {
      this.open = false;
    },

    toggle(event, element) {
      const open = () => {
        this.event = event;
        this.element = element;
        setTimeout(() => (this.open = true), 10);
      };

      if (this.open) {
        this.open = false;
        setTimeout(open, 10);
      } else {
        open();
      }
    },
    editEvent() {
      this.open = false;
      this.$nextTick(() => this.$emit('edit', this.event));
    },
    reset() {
      this.open = false;
      this.event = null;
      this.element = null;
    },
  },
};
</script>
