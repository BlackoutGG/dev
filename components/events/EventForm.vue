<template>
  <v-form v-model="isValid" ref="form">
    <v-container>
      <v-row>
        <v-col md="10" sm="10" v-if="!dontShow('name')">
          <v-text-field
            :readonly="preview"
            :rules="nameRules"
            label="Event Name"
            v-model="event.name"
          ></v-text-field>
        </v-col>
        <v-col md="2" sm="2" v-if="!dontShow('color')">
          <v-select :items="colors" v-model="event.color">
            <template #selection="{ item }">
              <v-icon :color="item" small>mdi-checkbox-blank-circle</v-icon>
            </template>
            <template #item="{ item, on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-content>
                  <v-icon small :color="item">mdi-checkbox-blank-circle</v-icon>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col md="12" sm="12" v-if="!dontShow('category')">
          <v-select
            v-if="!preview"
            :items="categories"
            :item-text="'name'"
            :item-value="'id'"
            v-model="event.category_id"
            label="Category"
          ></v-select>
          <v-text-field v-else readonly label="Category" v-model="event.categoryName"></v-text-field>
        </v-col>
        <v-col md="6" sm="12" v-if="!dontShow('start')">
          <event-time-date
            v-if="!preview"
            label="Start Date"
            :rules="startDateRules"
            :modifier="start"
            v-model="event.startDate"
          ></event-time-date>
          <v-text-field
            v-else
            readonly
            prepend-icon="mdi-calendar"
            label="Start Date"
            v-model="event.startDate"
          ></v-text-field>
        </v-col>
        <v-col md="6" sm="12" v-if="!dontShow('start')">
          <event-time-date
            v-if="!preview"
            label="Start Time"
            v-model="event.startTime"
            time
            :modifier="start"
            :rules="startTimeRules"
            :date="false"
          ></event-time-date>

          <v-text-field
            v-else
            readonly
            prepend-icon="mdi-calendar-clock"
            label="Start Time"
            v-model="event.startTime"
          ></v-text-field>
        </v-col>
        <v-col md="6" sm="12" v-if="!dontShow('end')">
          <event-time-date v-if="!preview" label="End Date" v-model="event.endDate"></event-time-date>
          <v-text-field
            v-else
            readonly
            prepend-icon="mdi-calendar"
            label="End Date"
            v-model="event.endDate"
          ></v-text-field>
        </v-col>
        <v-col md="6" sm="12" v-if="!dontShow('end')">
          <event-time-date
            v-if="!preview"
            :date="false"
            label="End Time"
            v-model="event.endTime"
            time
          ></event-time-date>
          <v-text-field
            v-else
            readonly
            prepend-icon="mdi-calendar-clock"
            label="End Time"
            v-model="event.endTime"
          ></v-text-field>
        </v-col>
        <v-col cols="12" v-if="!dontShow('desc')">
          <v-textarea :readonly="preview" label="Description" filled v-model="event.description"></v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import lists from '~/utilities/ns/public/lists.js';
import events from '~/utilities/ns/public/events.js';
import isAlphanumeric from '~/utilities/isAlphanumeric.js';
import EventTimeDate from './EventTimeDatePicker.vue';

export default {
  name: 'EventForm',
  components: { EventTimeDate },
  props: {
    value: {
      type: Boolean,
      default: false,
    },

    hide: {
      type: Array,
      default: () => [],
    },

    preview: {
      type: Boolean,
      default: false,
    },

    event: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      valid: false,
      nameRules: [
        (v) => !!v || 'Name is required.',
        (v) => (v && isAlphanumeric(v)) || 'Name can only be alphanumeric.',
      ],
      startDateRules: [(v) => !!v || 'Start date is required.'],
      startTimeRules: [(v) => !!v || 'Start time is required.'],
    };
  },

  methods: {
    reset() {
      this.$refs.form.reset();
    },
    dontShow(val) {
      return this.hide.indexOf(val) !== -1;
    },
  },

  computed: {
    isValid: {
      get() {
        return this.value;
      },
      set(val) {
        this.valid = val;
        this.$emit('input', val);
      },
    },

    start: {
      get() {
        const startDate = this.event.startDate || this.now;
        const startTime = this.event.startTime || '00:00';

        return this.event.start || startDate + ' ' + startTime;
      },
    },

    end: {
      get() {
        const endDate = this.event.endDate || this.event.startDate;
        const endTime = this.event.endTime || this.event.startTime;

        return this.event.end || endDate + ' ' + endTime;
      },
    },

    colors() {
      return this.$store.getters[events.getters.EVENT_COLORS];
    },

    categories() {
      return this.$store.getters[lists.getters.GET_ITEMS]('categories').filter(
        (item) => item.name !== 'all'
      );
    },
  },
};
</script>
