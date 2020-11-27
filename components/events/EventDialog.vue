<template>
  <v-dialog
    v-model="open"
    id="event-dialog"
    :max-width="maxWidth"
    :min-height="height"
    scrollable
  >
    <template #activator="{ on, attrs }">
      <v-btn class="mr-2" text v-bind="attrs" v-on="on">
        <v-icon v-text="icon" left></v-icon>
        <span>Add Event</span>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark>
        <v-toolbar-title>
          <span>{{ title }}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-tabs fixed-tabs v-model="tab">
        <v-tab v-for="(tab, i) in tabs" :key="i">{{ tab }}</v-tab>
      </v-tabs>
      <v-card-text :height="827">
        <v-tabs-items v-model="tab" v-if="details">
          <v-tab-item>
            <event-form
              v-model="valid"
              ref="form"
              :event="details"
              :hide="hideFields"
              :readOnlyAll="isViewMode"
            ></event-form>
          </v-tab-item>
          <v-tab-item>
            <event-options
              v-model="roles"
              :rvsp.sync="details.rvsp"
            ></event-options>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="reset">Clear</v-btn>
        <v-btn text :disabled="!valid" @click="save">Save</v-btn>
      </v-card-actions>
      <v-overlay absolute v-model="isSending">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-card>
  </v-dialog>
</template>

<script>
import events from '~/utilities/ns/public/events.js';
import EventForm from './EventForm.vue';
import EventOptions from './EventDialogOptions.vue';
import EventDetails from './EventDetails.js';

import pickBy from 'lodash/pickBy';
import cloneDeep from 'lodash/cloneDeep';

const picked = (prop) => typeof prop !== 'object' || typeof prop !== undefined;

export default {
  name: 'CalEventDialog',
  components: { EventForm, EventOptions },

  props: {
    start: {
      type: String,
    },
    end: {
      type: String,
    },
  },

  data() {
    return {
      open: false,
      valid: false,
      mode: 'new',
      tabs: ['Form', 'Options'],
      tab: 0,

      readonly: false,

      mode: 'add',

      icon: 'mdi-plus',

      eventId: 0,
      maxWidth: '600px',
      minHeight: 827,
      innerCardHeight: 500,

      isSending: false,

      roles: [],
      startingRoles: [],

      details: null,
      startingValues: null,
    };
  },

  watch: {
    open(v) {
      if (!v) return this.reset();

      if (this.isAddMode) {
        this.details = {
          title: '',
          description: '',
          color: '',
          category_id: 1,
          all_day: false,
          interval: 'once',
          start_time: '',
          end_time: '',
          start_date: '',
          end_date: '',
          rvsp: false,
        };
      }
    },
  },

  methods: {
    openFromDate(date) {
      this.open = true;
      this.$nextTick(() => {
        this.details.start_date = date;
        this.details.end_date = date;
      });
    },

    async save() {
      const addData = {
        ...this.details,
        duration: this.duration,
        start: this.start,
        end: this.end,
      };

      const editData = {
        id: this.details.id,
        ...this.toUpdate,
        duration: this.duration,
      };

      if (this.isRecurring) {
        addData.isRecurring = true;
      }

      // const { category, organizer, ...details } = await this.$store.dispatch(
      //   this.isEditMode ? events.actions.EDIT_EVENT : events.actions.ADD_EVENT,
      //   this.isEditMode ? editData : addData
      // );

      this.$store.dispatch(
        this.isEditMode ? events.actions.EDIT_EVENT : events.actions.ADD_EVENT,
        this.isEditMode ? editData : addData
      );

      // console.log(details);

      // if (this.isEditMode) this.setStartingValues(details);
      // else this.close();

      this.close();
    },

    async getEvent(event_id, secondary_id) {
      this.isSending = true;

      const params = { id: secondary_id };

      try {
        const { event } = (
          await this.$axios.get(`/events/${event_id}`, { params })
        ).data;
        return event;
      } catch (err) {
        return err;
      } finally {
        this.isSending = false;
      }
    },

    reset() {
      if (this.isEditMode) {
        this.startingValues = null;
        this.startingRoles = [];
      }
      if (this.$refs.form) this.$refs.form.reset();
      this.$nextTick(() => {
        this.mode = 'add';
        this.readonly = false;
        this.details = null;
      });
    },

    close() {
      this.open = false;
      this.tab = 0;
      this.$next;
    },

    setStartingValues(obj) {
      this.startingValues = Object.assign({}, pickBy(cloneDeep(obj), picked));
    },

    async setEditableContent({ type, event }) {
      console.log(type, event);

      if (type === 'more-info') {
        this.mode = 'view';
      } else if (type === 'edit-event-series') {
        this.mode = 'edit-event-series';
      } else {
        this.mode = 'edit-event';
      }
      // this.isEditMode = true;
      this.eventId = event.event_id;

      this.open = true;
      const { category, organizer, ...details } = await this.getEvent(
        event.event_id,
        event.id
      );

      console.log(details);

      if (details) {
        this.details = new EventDetails(details);
        this.startingValues = new EventDetails(details);
      }
      // this.setStartingValues(this.details);
    },
  },

  computed: {
    toUpdate() {
      return this.startingValues
        ? Object.entries(this.details)
            .filter(([key, value]) => {
              return this.startingValues[key] !== value;
            })
            .reduce((obj, [key, value]) => {
              obj[key] = value;
              return obj;
            }, {})
        : [];
    },

    viewMode() {
      return this.readonly === true;
    },

    hideFields() {
      switch (this.mode) {
        case 'edit-event-series':
          return ['start_date', 'end_date', 'interval', 'all_day'];
        case 'edit-event':
          return ['interval', 'all_day'];
        default:
          break;
      }
      // return this.isRecurring
      //   ? ['start_date', 'end_date', 'interval', 'all_day']
      //   : [];
    },

    rolesToUpdatae() {
      return this.roles.filter(
        (role) => this.startingRoles.indexOf(role) === -1
      );
    },

    isEditEventMode() {
      return this.mode === 'edit';
    },

    isEditSeriesMode() {
      return this.mode === 'edit-event-series';
    },

    isAddMode() {
      return this.mode === 'add';
    },

    isViewMode() {
      return this.mode === 'view';
    },

    isRecurring() {
      return this.details.interval !== 'once' && this.isEditMode;
    },

    duration() {
      return this.details.start_date && this.details.end_date
        ? this.$dayjs(this.details.end_date).diff(
            this.$dayjs(this.details.start_date),
            'day'
          )
        : 0;
    },

    height: {
      get() {
        return `${this.minHeight}px`;
      },
      set(val) {
        this.minHeight = val;
      },
    },
    title() {
      return !this.isEditMode
        ? 'Add Event'
        : this.details
        ? `Edit Event: ${this.details.title}`
        : 'Edit Event';
    },
  },
};
</script>
