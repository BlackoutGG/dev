<template>
  <v-menu
    v-model="open"
    ref="menu"
    transition="scale-transition"
    offset-y
    min-width="290px"
    max-width="290px"
    :close-on-content-click="false"
    :return-value.sync="input"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="input"
        :label="label"
        :prepend-icon="icon"
        :rules="rules"
        :error-messages="errorMessages"
        :disabled="disabled"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <!-- <v-date-picker
      v-model="input"
      :max="max"
      :min="min"
      no-title
      v-if="date && !time"
    >
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="open = false">Cancel</v-btn>
      <v-btn text color="primary" @click="$refs.menu.save(input)">Save</v-btn>
    </v-date-picker>
    <v-time-picker v-model="input" full-width v-else-if="time && !date">
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="open = false">Cancel</v-btn>
      <v-btn text color="primary" @click="$refs.menu.save(input)">Save</v-btn>
    </v-time-picker> -->
    <component
      :is="component"
      v-model="input"
      v-bind="componentProps"
      v-if="!readonly"
    >
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="open = false">Cancel</v-btn>
      <v-btn text color="primary" @click="$refs.menu.save(input)">Save</v-btn>
    </component>
  </v-menu>
</template>

<script>
export default {
  name: 'CalEventDateAndTime',
  props: {
    value: {
      type: String,
      default: '',
    },
    date: {
      type: Boolean,
      default: true,
    },
    time: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    max: {
      type: [String],
    },
    min: {
      type: [String],
    },
    rules: {
      type: [Function, Object, Array, String],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      open: false,
      innerValue: this.value,
      errorMessages: '',
    };
  },

  computed: {
    input: {
      get() {
        return this.value;
      },
      set(val) {
        this.innerValue = val;
        this.$emit('input', val);
      },
    },
    icon() {
      return this.time && !this.date
        ? 'mdi-calendar-clock'
        : this.date && !this.time
        ? 'mdi-calendar'
        : 'mdi-calendar-clock';
    },

    parsed() {
      return this.$dateFns.parseISO(this.modifier);
    },

    component() {
      return this.date ? 'v-date-picker' : 'v-time-picker';
    },

    componentProps() {
      const dateProps = { max: this.max, min: this.min, 'no-title': true };
      const timeProps = { 'full-width': true };
      return this.date ? dateProps : timeProps;
    },
  },
};
</script>
