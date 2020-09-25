<script>
import cosmetic from '~/mixins/props/cosmetic.js';
import general from '~/mixins/props/general.js';
import select from '~/mixins/props/select.js';

export default {
  name: 'FormField',

  mixins: [general, select, cosmetic],

  data() {
    return {
      internalValue: null,
    };
  },

  created() {
    if (this.hasOptions) this.internalValue = [];
    else this.internalValue = '';
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
      return !!this.field.options.length;
    },

    isOptional() {
      return this.field.optional;
    },
  },

  render(h) {
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

    const { value, ...internalProps } = this.$props;

    const on = { input: (v) => this.$emit('input', v) };

    const textfield = [...cosmeticProps, ...generalProps];
    const selection = [...textfield, ...selectProps];

    const isRequired = (v) => !!v || 'Field is required.';

    const generateProps = () => {
      return Object.entries(internalProps).reduce((output, [key, value]) => {
        const propsToCompareAgainst = this.hasOptions ? selection : textfield;
        if (propsToCompareAgainst.includes(key) && typeof value !== undefined) {
          Object.assign(output, { [key]: value });
        }
        return output;
      }, {});
    };

    const CheckBoxGroup = (_props) => {
      const { items, ...props } = _props;
      const checkbox = (option) => {
        props.value = option;
        props.hideDetail = true;
        return h('v-checkbox', { on, props });
      };

      const errorDiv = h('v-errors', []);
      const options = this.fields.options.map(checkbox);
      const groupContainer = h('v-checkbox-group', [options]);
    };
  },
};
</script>