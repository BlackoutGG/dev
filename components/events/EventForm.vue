<template>
  <v-form v-model="isValid" ref="form">
    <v-container>
      <v-row>
        <v-col md="10" sm="10" v-if="!dontShow('title')">
          <v-text-field
            :readonly="preview"
            :rules="[rules.isRequired('title'), rules.minLength(3, 'title')]"
            label="Event Title"
            v-model="event.title"
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
        <v-col cols="12" v-if="!dontShow('category')">
          <v-select
            :items="categories"
            :item-text="'name'"
            :item-value="'id'"
            :readonly="readonly"
            :rules="[rules.isRequired('category')]"
            v-model="event.category_id"
            label="Category"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-checkbox
            v-model="event.all_day"
            :label="'All Day'"
            :readonly="readonly"
          ></v-checkbox>
        </v-col>
        <v-col cols="12">
          <v-select
            :items="intervalOptions"
            :item-text="'name'"
            :item-value="'interval'"
            :readonly="readonly"
            label="Interval"
          ></v-select>
        </v-col>
        <v-col md="6" sm="12" v-if="!dontShow('start')">
          <event-time-date
            v-if="!preview"
            label="Start Date"
            v-model="event.start_date"
            :rules="[rules.isRequired('Start Date')]"
            :readonly="readonly"
          ></event-time-date>
        </v-col>
        <v-col md="6" sm="12" v-if="!dontShow('start')">
          <event-time-date
            label="Start Time"
            v-model="event.start_time"
            time
            :rules="[rules.isRequired('Start Time')]"
            :readonly="readonly"
            :disabled="event.all_day"
            :date="false"
          ></event-time-date>
        </v-col>
        <v-col md="6" sm="12" v-if="!dontShow('end')">
          <event-time-date
            label="End Date"
            v-model="event.end_date"
            :rules="[rules.isRequired('End Date')]"
            :readonly="readonly"
            :disabled="event.all_day"
          ></event-time-date>
        </v-col>
        <v-col md="6" sm="12" v-if="!dontShow('end')">
          <event-time-date
            label="End Time"
            v-model="event.end_time"
            time
            :rules="[rules.isRequired('End Time')]"
            :readonly="readonly"
            :disabled="event.all_day"
            :date="false"
          ></event-time-date>
        </v-col>
        <v-col cols="12" v-if="!dontShow('desc')">
          <v-textarea
            :readonly="readonly"
            label="Description"
            filled
            v-model="event.description"
          ></v-textarea>
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
import capitalize from 'lodash/capitalize';

export default {
  name: 'CalEventForm',
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
      type: [Object, null],
    },

    readonly: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      valid: false,

      intervalOptions: [
        { name: 'Only once', interval: 'once' },
        { name: 'Every day', interval: 'daily' },
        { name: 'Every week', interval: 'weekly' },
        { name: 'Every month', interval: 'monthly' },
      ],

      rules: {
        isRequired: (field) => (v) =>
          !!v || `${capitalize(field)} is required.`,

        minLength: (length, field) => (v) =>
          (v && v.length >= length) ||
          `${capitalize(
            field
          )} must be equal to or longer than ${length} characters.`,
      },
    };
  },

  watch: {
    'event.all_day'(isAllDay) {
      if (isAllDay) {
        this.event.start_time = '';
        this.event.end_date = '';
        this.event.end_time = '';
      }
    },
  },

  methods: {
    reset() {
      this.$refs.form.reset();
    },
    validate() {
      this.$refs.form.validate();
    },
    dontShow(val) {
      return this.hide.includes(val);
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

    // start: {
    //   get() {
    //     const startDate = this.event.startDate || this.now;
    //     const startTime = this.event.startTime || '00:00';

    //     return this.event.start || startDate + ' ' + startTime;
    //   },
    // },

    colors() {
      return this.$store.getters[events.getters.EVENT_COLORS];
    },

    categories() {
      return this.$store.getters[lists.getters.GET_ITEMS]('categories').filter(
        (item) => item.title !== 'all'
      );
    },
  },
};
</script>
