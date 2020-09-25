<template>
  <v-dialog v-model="open" :max-width="maxWidth">
    <template #activator="{ on }">
      <v-btn text v-on="on">
        <v-icon v-text="icon"></v-icon>
        <span>Add {{ capitalizedName }}</span>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span>Add {{ capitalizedName }}</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon v-text="closeIcon"></v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <dialog-input
            label="Name"
            v-model="computedValue"
            async
            :route="route"
            ref="input"
          ></dialog-input>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text :disabled="isDisabled" @click="$emit('save')">
          <span>Save</span>
        </v-btn>
        <v-btn text @click="close">
          <span>Cancel</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import capitalize from 'lodash/capitalize';
import isAlphanumeric from '~/utilities/isAlphanumeric.js';

export default {
  name: 'TableAddItem',

  props: {
    value: {
      type: String,
    },
    name: {
      type: String,
      default: 'Item',
    },
    route: {
      type: [Object, String],
    },
  },

  data() {
    return {
      open: false,
      icon: 'mdi-plus',
      closeIcon: 'mdi-close',
      maxWidth: 500,
      innerValue: '',
      valid: false,
    };
  },

  methods: {
    close() {
      this.open = false;
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
    },
  },

  computed: {
    capitalizedName() {
      return capitalize(this.name);
    },

    computedValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.innerValue = value;
        this.$emit('input', value);
      },
    },

    isDisabled() {
      return !this.value || !this.valid;
    },
  },
};
</script>
