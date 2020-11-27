<template>
  <v-form v-model="isValid" ref="form">
    <v-container>
      <v-row>
        <v-col md="10" sm="10" v-if="!dontShow('title')">
          <v-text-field
            :readonly="readOnly('title')"
            :rules="[isRequired('title'), minLength(3, 'title')]"
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
            :readonly="readOnly('category')"
            :rules="[isRequired('category')]"
            v-model="event.category_id"
            label="Category"
          ></v-select>
        </v-col>
        <v-col cols="12" v-if="!dontShow('all_day')">
          <v-checkbox
            v-model="event.all_day"
            :label="'All Day'"
            :readonly="readOnly('all_day')"
          ></v-checkbox>
        </v-col>
        <v-col cols="12" v-if="!dontShow('interval')">
          <v-select
            :items="intervalOptions"
            :item-text="'name'"
            :item-value="'interval'"
            :readonly="readOnly('interval')"
            label="Interval"
            v-model="event.interval"
          ></v-select>
        </v-col>
        <v-col md="6" sm="12" v-if="!dontShow('start_date')">
          <event-time-date
            label="Start Date"
            v-model="event.start_date"
            :rules="[
              isRequired('Start Date'),
              isNotAfter(event.end_date, 'Start Date'),
            ]"
            :readonly="readOnly('start_date')"
          ></event-time-date>
        </v-col>
        <v-col md="6" sm="12" v-if="!dontShow('start_time')">
          <event-time-date
            label="Start Time"
            v-model="event.start_time"
            time
            :rules="[isRequired('Start Time')]"
            :readonly="readOnly('start_time')"
            :disabled="event.all_day"
            :date="false"
          ></event-time-date>
        </v-col>
        <v-col md="6" sm="12" v-if="!dontShow('end_date')">
          <event-time-date
            label="End Date"
            v-model="event.end_date"
            :rules="[
              isRequired('End Date'),
              isNotPast(event.start_date, 'End Date'),
            ]"
            :readonly="readOnly('end_date')"
            :min="event.start_date"
            :disabled="isDisabled"
          ></event-time-date>
        </v-col>
        <v-col md="6" sm="12" v-if="!dontShow('end_time')">
          <event-time-date
            label="End Time"
            v-model="event.end_time"
            time
            :rules="[isRequired('End Time')]"
            :readonly="readOnly('end_time')"
            :disabled="event.all_day"
            :date="false"
          ></event-time-date>
        </v-col>
        <v-col cols="12" v-if="!dontShow('desc')">
          <v-textarea
            :readonly="readOnly('desc')"
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
import validators from '~/utilities/validators.js';
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

    event: {
      type: [Object, null],
    },

    readOnlyAll: {
      type: Boolean,
      default: false,
    },

    readOnlyFields: {
      type: Array,
      default: () => [],
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

      // rules: {
      //   isRequired: (fieldName) => (v) =>
      //     !!v || `${capitalize(fieldName)} is required.`,
      //   minLength: (length, fieldName) => (v) =>
      //     (v && v.length >= length) ||
      //     `${capitalize(
      //       fieldName
      //     )} must be equal to or longer than ${length} characters.`,
      //   isNotPast: (date, compare, fieldName) => (v) =>
      //     !this.$dateFns.isBefore(date, compare) || `$`,
      // },
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
    ...validators,
    reset() {
      this.$refs.form.reset();
    },
    validate() {
      this.$refs.form.validate();
    },
    dontShow(val) {
      return this.hide.includes(val);
    },
    readOnly(val) {
      return this.readOnlyFields && this.readOnlyFields.length
        ? this.readOnlyFields.includes(val)
        : this.readOnlyAll;
    },
  },

  computed: {
    // startDate() {
    //   return this.$dateFns.parseISO(this.event.start || this.event.start_date);
    // },

    // endDate() {
    //   return this.$dateFns.parseISO(this.event.end || this.event.end_date);
    // },

    isRecurringDaily() {
      return this.event.interval === 'daily';
    },

    isRecurringMonthly() {
      return this.event.interval === 'monthly';
    },

    isRecurringYearly() {
      return this.event.interval === 'yearly';
    },

    isDisabled() {
      return this.isRecurringDaily || this.event.all_day;
    },

    isValid: {
      get() {
        return this.value;
      },
      set(val) {
        this.valid = val;
        this.$emit('input', val);
      },
    },

    colors() {
      return this.$store.getters[events.getters.EVENT_COLORS];
    },

    categories() {
      return this.$store.getters[lists.getters.GET_ITEMS]('categories');
    },
  },
};
</script>
