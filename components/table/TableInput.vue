<template>
  <v-edit-dialog :large="large" @save="save" @cancel="reset" @close="reset" ref="dialog">
    {{computedValue}}
    <template v-slot:input>
      <v-text-field
        v-model="computedValue"
        :error-messages="errorMessage"
        :label="label"
        :single-line="singleLine"
        :counter="counter"
      ></v-text-field>
    </template>
  </v-edit-dialog>
</template>

<script>
import debounce from 'lodash/debounce';

export default {
  name: 'TableInput',
  props: {
    value: {
      type: String,
      default: '',
    },
    id: {
      type: [Number, String],
    },
    route: {
      type: [Object, String],
    },
    label: {
      type: String,
      default: 'Edit',
    },
    singleLine: {
      type: Boolean,
      default: true,
    },
    large: {
      type: Boolean,
      default: true,
    },
    counter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      originalValue: this.value,
      innerValue: '',
      errorMessage: '',
      inputCheck: null,
      valid: false,
    };
  },

  created() {
    const url = `/${this.route.name}/validate/${this.route.value}`;

    this.inputCheck = debounce(async (v) => {
      const params = { value: v };
      try {
        const result = await this.$axios.get(url, { params });
        this.errorMessage = '';
      } catch (err) {
        this.errorMessage = err.response.data[0].msg
          ? err.response.data[0].msg
          : err.response.data;
      }
    }, 500);
  },

  methods: {
    check(v) {
      const url = `/${this.route.name}/validate/${this.route.value}`;

      const bounced = debounce(async (v) => {
        const params = { value: v };
        try {
          const result = await this.$axios.get(url, { params });
          this.errorMessage = [];
        } catch (err) {
          this.errorMessage = err.response.data[0].msg
            ? err.response.data[0].msg
            : err.response.data;
        }
      }, 500);

      return bounced;
    },

    save() {
      this.$emit('save', {
        id: this.id,
        type: this.route.value,
        value: this.innerValue,
      });
    },

    reset() {
      this.computedValue = this.originalValue;
    },
  },

  watch: {
    watch: {
      errorMessage(v) {
        if (v) {
          console.log(this.$refs.dialog);
        }
      },
    },

    innerValue: function (v) {
      if (v) {
        if (v === this.originalValue) {
          this.errorMessage = [];
          return;
        }
        this.inputCheck(v);
      }
    },

    value(v) {
      if (v !== this.innerValue) {
        this.innerValue = v;
      }

      if (!this.originalValue) {
        this.originalValue = v;
      }
    },
  },
  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.innerValue = value;
        this.$emit('input', value);
      },
    },
  },
};
</script>