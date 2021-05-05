<template>
  <component v-model="computedValue" :is="computedType" v-bind="options">
    <template v-if="type === 'multi'"> </template>
  </component>
</template>

<script>
export default {
  name: 'FormField3',

  props: {
    options: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: 'text',
    },
    value: {
      type: [String, Boolean, Number],
    },
  },

  computed: {
    computedType() {
      switch (this.type) {
        case 'short':
          return 'v-text-field';
        case 'long':
          return 'v-textarea';
        case 'multi':
          return 'v-radio-group';
        case 'checkbox':
          return 'v-checkboxes';
        default:
          return 'v-text-field';
      }
    },
    computedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>
