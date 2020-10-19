<script>
import cosmetic from '~/mixins/props/cosmetic.js';
import general from '~/mixins/props/general.js';
import select from '~/mixins/props/select.js';

import {
  VTextField,
  VTextarea,
  VSelect,
  VRadioGroup,
  VRadio,
  VCheckbox,
} from 'vuetify/lib';

const generalProps = [
  'autofocus',
  'clearIcon',
  'counter',
  'counterValue',
  'loaderHeight',
  'loading',
  'messages',
  'persistentHint',
  'placeholder',
  'prefix',
  'prependIcon',
  'prependInnerIcon',
  'readonly',
  'reverse',
  'rules',
  'singleLine',
  'soloInverted',
  'success',
  'successMessages',
  'suffix',
  'validateOnBlur',
  'disabled',
  'error',
  'errorCount',
  'value',
  'fullWidth',
  'height',
  'hideDetails',
  'hint',
  'id',
  'label',
];

const cosmeticProps = [
  'appendIcon',
  'appendOuterIcon',
  'backgroundColor',
  'color',
  'dark',
  'dense',
  'filled',
  'flat',
  'light',
  'rounded',
  'shaped',
  'solo',
  'outlined',
];

const selectProps = [
  'eager',
  'itemColor',
  'itemDisabled',
  'itemText',
  'itemValue',
  'items',
  'multiple',
];

export default {
  name: 'FormField',

  components: {
    VTextField,
    VTextarea,
    VSelect,
    VRadioGroup,
    VRadio,
    VCheckbox,
  },

  mixins: [general, select, cosmetic],

  props: {
    field: {
      type: Object,
    },
  },

  data() {
    return {
      internalValue: null,
      errors: '',
      generalProps,
      cosmeticProps,
      selectProps,

      isRequired: (v) => !!v || 'Field is required.',
    };
  },

  created() {
    if (this.field.type === 'checkbox') this.internalValue = [];
    else this.internalValue = '';
  },

  watch: {
    value(newVal, oldVal) {
      if (Array.isArray(newVal) && !newVal.length && this.type === 'checkbox') {
        this.errors = 'Field is required. Must select at least one.';
      } else {
        this.errors = '';
      }
    },
  },

  methods: {
    generateProps() {
      const textfield = [...this.cosmeticProps, ...this.generalProps];
      const selection = [...textfield, ...this.selectProps];
      const internalProps = { ...this.$props };
      return Object.entries(internalProps).reduce((output, [key, value]) => {
        const propsToCompareAgainst = this.hasOptions ? selection : textfield;
        if (propsToCompareAgainst.includes(key) && typeof value !== undefined) {
          Object.assign(output, { [key]: value });
        }
        return output;
      }, {});
    },

    genCheckboxes(_props) {
      const { items, ...props } = _props;

      const checkbox = (option) => {
        const checkboxProps = Object.assign({}, props, {
          inputValue: this.computedValue,
          value: option,
          multiple: this.multiple ? this.multiple : true,
          hideDetails: this.hideDetails ? this.hideDetails : true,
          errorMessages: this.errors,
          label: option,
        });

        const on = { change: (v) => this.$emit('input', v) };

        return this.$createElement('v-checkbox', {
          on,
          props: checkboxProps,
          class: 'my-0 py-2',
        });
      };

      const errorDiv = this.$createElement('div', { class: ['v-errors'] }, [
        this.$createElement('p', {}, [this.errors]),
      ]);

      return this.$createElement('div', { class: 'checkbox-group' }, [
        this.field.options.map(checkbox),
        errorDiv,
      ]);
    },

    genRadios(_props) {
      const { items, label, ...props } = _props;
      const radioGroupProps = Object.assign({}, props, {
        rules: this.isOptional ? [] : [this.isRequired],
        value: this.computedValue,
      });

      const radio = (option) => {
        const radioProps = { label: option, value: option };
        return this.$createElement('v-radio', { props: radioProps }, []);
      };

      const on = { change: (v) => this.$emit('input', v) };

      const componentOptions = {
        on,
        props: radioGroupProps,
      };

      return this.$createElement(
        'v-radio-group',
        componentOptions,
        this.field.options.map(radio)
      );
    },

    genSelect(_props) {
      const props = Object.assign({}, _props, {
        rules: this.isOptional ? [] : [this.isRequired],
        value: this.computedValue,
        items: this.hasOptions ? this.field.options : [],
      });

      const on = { input: (v) => this.$emit('input', v) };

      return this.$createElement('v-select', { props, on });
    },

    genInputField(input, _props) {
      const props = Object.assign({}, _props, {
        rules: this.isOptional ? [] : [this.isRequired],
        value: this.computedValue,
      });

      const on = { input: (v) => this.$emit('input', v) };

      return this.$createElement(input, { props, on }, []);
    },

    genField(props) {
      switch (this.field.type) {
        case 'multiple':
          return this.genRadios(props);
        case 'checkbox':
          return this.genCheckboxes(props);
        case 'select':
          return this.genSelect(props);
        case 'textarea':
          return this.genInputField('v-textarea', props);
        default:
          return this.genInputField('v-text-field', props);
      }
    },
  },

  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.internalValue = value;
        this.$emit('input', value);
      },
    },

    hasOptions() {
      return this.field.options ? !!this.field.options.length : false;
    },

    isOptional() {
      return this.field.optional;
    },
  },

  render(h) {
    return this.genField(this.generateProps());
  },
};
</script>