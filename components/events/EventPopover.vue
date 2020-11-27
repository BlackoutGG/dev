<template>
  <v-menu
    v-model="open"
    offset-x
    :max-width="maxWidth"
    :close-on-content-click="false"
    :activator="element"
  >
    <v-card flat v-if="event">
      <v-toolbar dark>
        <v-toolbar-title>{{ event.title }}</v-toolbar-title>
        <v-spacer></v-spacer>

        <event-actions
          @more-info="editEvent('more-info')"
          @edit-event="editEvent('edit-event')"
          @edit-event-series="editEvent('edit-event-series')"
          @remove-event="removeEvent('remove-event')"
          @remove-event-series="removeEvent('remove-event-series')"
          :isRecurring="isRecurring"
        />
      </v-toolbar>
      <v-card-text>
        <div class="px-4 py-2">
          <p class="text-overline mb-0">Category</p>
          <p class="mb-0">{{ event.category }}</p>
        </div>
        <div class="d-flex px-4 py-2 align-center">
          <v-icon left>mdi-clock</v-icon>
          <span>{{ start }} - {{ end }}</span>
        </div>
        <div class="d-flex px-4 py-2 align-center">
          <v-icon left>mdi-account-group</v-icon>
          <span class="mr-2">{{ event.participants }}</span>
          <span>are going</span>
        </div>
        <div
          class="d-flex px-4 py-2 align-center"
          v-if="event && event.organizer"
        >
          <v-avatar :size="avatarSize">
            <v-img :src="event.organizer.avatar"></v-img>
          </v-avatar>
          <span class="mx-2">Created by {{ event.organizer.username }}</span>
        </div>
      </v-card-text>
      <v-divider v-if="event.rvsp"></v-divider>
      <v-card-actions class="align-center justify-center" v-if="event.rvsp">
        <v-btn block text @click="joinEvent" color="primary">{{
          eventJoinStatus
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import EventActions from './EventActions.vue';
import events from '~/utilities/ns/private/events.js';
import pick from 'lodash/pick';

const { mapGetters, mapActions } = createNamespacedHelpers('events');

export default {
  name: 'CalEventPopover',

  components: { EventActions },

  data() {
    return {
      open: false,
      readonly: true,
      element: null,
      maxWidth: 300,
      avatarSize: 24,
      eventID: 0,
    };
  },

  methods: {
    ...mapActions([events.actions.TOGGLE_JOIN]),

    joinEvent() {
      this.toggleJoin({
        rvsp_enabled: this.event.rvsp,
        joined: this.event.joined,
        event_id: this.event.id,
      });
    },

    closeOnUpdate() {
      this.open = false;
    },

    toggle(obj, element) {
      const open = () => {
        const { id } = obj;
        this.eventID = parseInt(id, 10);
        this.element = element;
        setTimeout(() => (this.open = true), 10);
      };

      if (this.open) {
        this.open = false;
        this.eventID = 0;
        setTimeout(open, 10);
      } else {
        open();
      }
    },
    editEvent(type) {
      this.open = false;

      console.log(type);

      this.$nextTick(() => this.$emit('edit', { type, event: this.event }));
    },
    removeEvent(type) {
      this.open = false;
      this.$nextTick(() => this.$emit('remove', { type, event: this.event }));
    },
    reset() {
      this.open = false;
      this.eventID = 0;
      this.element = null;
    },
  },

  computed: {
    ...mapGetters([events.getters.GET_EVENT]),

    event() {
      const event = this.eventID ? this.getEvent(this.eventID) : null;
      if (event) {
        const { id, title, start, end, extendedProps } = event;

        return Object.assign({}, { id, title, start, end }, extendedProps);
      }
      return null;
    },

    isRecurring() {
      return this.event.interval !== 'once';
    },

    eventJoinStatus() {
      return this.event.joined ? 'Leave' : 'Join';
    },

    start() {
      return this.event.start
        ? this.$dayjs(this.event.start).format('ddd, MMM D, YYYY h:mm a')
        : null;
    },

    end() {
      return this.event.end
        ? this.$dayjs(this.event.end).format('ddd, MMM D, YYYY h:mm a')
        : this.start;
    },

    // start() {
    //   return this.event.start
    //     ? this.$dateFns.format(this.event.start, 'ccc, LLL d, y h:mm aaaa')
    //     : null;
    // },

    // end() {
    //   return this.event.end
    //     ? this.$dateFns.format(this.event.end, 'ccc, LLL d, y h:mm aaaa')
    //     : this.start;
    // },
  },
};
</script>
