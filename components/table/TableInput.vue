<template>
  <v-edit-dialog :large="large" @save="save" @cancel="reset" @close="reset">
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
      errorMessage: [],
      inputCheck: null,
    };
  },

  created() {
    const url = `/${this.route.name}/validate/${this.route.value}`;

    this.inputCheck = debounce(async (v) => {
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
  },

  methods: {
    save() {
      this.$emit('save', {
        id: this.id,
        type: this.type,
        value: this.innerValue,
      });
    },
    reset() {
      this.computedValue = this.originalValue;
    },
  },
  watch: {
    innerValue: function (v) {
      if (v) {
        if (v === this.originalValue) {
          this.errorMessage = [];
          return;
        }
        this.inputCheck(v);
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