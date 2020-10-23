<template>
  <v-dialog
    v-model="open"
    id="event-dialog"
    :max-width="maxWidth"
    :min-height="height"
  >
    <template #activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on">
        <v-icon v-text="icon" left></v-icon>
        <span>Add Event</span>
      </v-btn>
    </template>
    <v-card :min-height="height" scrollable>
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
      <v-tabs-items v-model="tab" v-if="details">
        <v-tab-item>
          <v-card-text :height="innerCardHeight">
            <event-form
              v-model="valid"
              ref="form"
              :event="details"
            ></event-form>
          </v-card-text>
        </v-tab-item>
        <v-tab-item>
          <v-card-text>
            <event-options
              v-model="roles"
              :rvsp.sync="details.rvsp"
            ></event-options>
          </v-card-text>
        </v-tab-item>
      </v-tabs-items>

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

import pickBy from 'lodash/pickBy';
import cloneDeep from 'lodash/cloneDeep';

const picked = (prop) => typeof prop !== 'object' || typeof prop !== undefined;

export default {
  name: 'CalEventDialog',
  components: { EventForm, EventOptions },

  data() {
    return {
      open: false,
      valid: false,
      mode: 'new',
      tabs: ['Form', 'Options'],
      tab: 0,

      isEditMode: false,

      icon: 'mdi-plus',

      eventId: 0,
      maxWidth: '600px',
      minHeight: 827,
      innerCardHeight: 500,

      isSending: false,

      start_recur: null,
      end_recur: null,
      interval: null,

      roles: [],
      startingRoles: [],

      details: null,
      startingValues: null,
    };
  },

  watch: {
    open(v) {
      if (!v) return this.reset();

      if (!this.isEditMode) {
        this.details = {
          title: '',
          description: '',
          color: '',
          category_id: 1,
          all_day: false,
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
    async save() {
      const { category, organizer, ...details } = await this.$store.dispatch(
        this.isEditMode ? events.actions.EDIT_EVENT : events.actions.ADD_EVENT,
        this.isEditMode
          ? { id: this.details.id, ...this.toUpdate }
          : this.details
      );

      console.log(details);

      if (this.isEditMode) this.setStartingValues(details);
      else this.close();
    },

    async getEvent(id) {
      this.isSending = true;
      try {
        const { event } = (await this.$axios.get(`/events/${id}`)).data;
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
      this.$refs.form.reset();
      this.$nextTick(() => {
        this.isEditMode = false;
        this.details = null;
      });
    },

    close() {
      this.open = false;
      this.tab = 0;
      this.reset();
    },

    setStartingValues(obj) {
      this.startingValues = Object.assign({}, pickBy(cloneDeep(obj), picked));
    },

    async setEditableContent({ id }) {
      this.eventId = id;
      this.isEditMode = true;
      this.open = true;
      const { category, organizer, ...event } = await this.getEvent(id);

      this.details = event;
      this.setStartingValues(this.details);
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

    rolesToUpdatae() {
      return this.roles.filter(
        (role) => this.startingRoles.indexOf(role) === -1
      );
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
