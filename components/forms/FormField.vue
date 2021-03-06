<script>
import cosmetic from '~/mixins/props/cosmetic.js';
import general from '~/mixins/props/general.js';
import select from '~/mixins/props/select.js';

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
    const internalProps = { ...this.$props };

    const on = { input: (v) => this.$emit('input', v) };

    const textfield = [...this.cosmeticProps, ...this.generalProps];
    const selection = [...textfield, ...this.selectProps];

    const isRequired = (v) => !!v || 'Field is required.';

    const onChange = (v) => this.$emit('input', v);

    const generateProps = () => {
      return Object.entries(internalProps).reduce((output, [key, value]) => {
        const propsToCompareAgainst = this.hasOptions ? selection : textfield;
        if (propsToCompareAgainst.includes(key) && typeof value !== undefined) {
          Object.assign(output, { [key]: value });
        }
        return output;
      }, {});
    };

    const genCheckboxes = (_props) => {
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

        return h('v-checkbox', {
          on: {
            change: onChange,
          },
          props: checkboxProps,
          class: 'my-0 py-2',
        });
      };

      const errorDiv = h('div', { class: ['v-errors'] }, [
        h('p', {}, [this.errors]),
      ]);

      return h('div', { class: 'checkbox-group' }, [
        this.field.options.map(checkbox),
        errorDiv,
      ]);
    };

    const genRadio = (_props) => {
      const { items, label, ...props } = _props;
      const radioGroupProps = Object.assign({}, props, {
        rules: this.isOptional ? [] : [isRequired],
        value: this.computedValue,
      });

      const radio = (option) => {
        const radioProps = { label: option, value: option };
        return h('v-radio', { props: radioProps }, []);
      };

      const componentOptions = {
        on: { change: onChange },
        props: radioGroupProps,
      };

      return h(
        'v-radio-group',
        componentOptions,
        this.field.options.map(radio)
      );
    };

    const genSelect = (_props) => {
      const props = Object.assign({}, _props, {
        rules: this.isOptional ? [] : [isRequired],
        value: this.computedValue,
        items: this.hasOptions ? this.field.options : [],
      });

      return h('v-select', { props, on });
    };

    const genInputField = (input, _props) => {
      const props = Object.assign({}, _props, {
        rules: this.isOptional ? [] : [isRequired],
        value: this.computedValue,
      });

      return h(input, { props, on }, []);
    };

    const genField = () => {
      switch (this.field.type) {
        case 'multiple':
          return genRadio(generateProps());
        case 'checkbox':
          return genCheckboxes(generateProps());
        case 'select':
          return genSelect(generateProps());
        case 'textarea':
          return genInputField('v-textarea', generateProps());
        default:
          return genInputField('v-text-field', generateProps());
      }
    };

    return genField();
  },
};
</script>