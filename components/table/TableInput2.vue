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

      saveButton: null,
    };
  },

  created() {
    if (this.value) {
      this.innerValue = this.value;
    }

    const button = this.$refs.dialog.$children[0].$children[0].$children[2];

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
      this.computedValue = this.value;
    },
  },

  watch: {
    errorMessage(v) {
      console.log(this.$refs.dialog);
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
    },
  },
  computed: {
    computedValue: {
      get() {
        return this.innerValue;
      },
      set(value) {
        this.innerValue = value;
      },
    },
  },
};
</script>