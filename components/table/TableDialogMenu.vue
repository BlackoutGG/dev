<template>
  <v-menu
    :class="rootClasses"
    v-model="open"
    min-width="minWidth"
    :origin="origin"
    :transition="transition"
    :close-on-content-click="closeOnContentClick"
    :retain-focus="retainFocus"
    :no-click-animation="noClickAnimation"
  >
    <template #activator="{ on }">
      <span class="v--table-item-pointer" v-on="on">{{ displayValue }}</span>
    </template>
    <v-card :min-width="minWidth">
      <v-card-text @click.stop>
        <v-select
          v-model="computedValue"
          v-if="items && items.length"
          :items="items"
          :item-text="itemText"
          :item-value="itemValue"
        ></v-select>
        <v-text-field
          v-model="computedValue"
          :error-messages="errorMessage"
          :label="label"
          :single-line="singleLine"
          :counter="counter"
          v-else
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="reset">
          <span>Cancel</span>
        </v-btn>
        <v-btn text color="primary" :disabled="!valid" @click="save">
          <span>Save</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import debounce from 'lodash/debounce';
export default {
  name: 'TableDialogMenu',

  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
    itemText: {
      type: String,
      default: 'text',
    },
    itemValue: {
      type: String,
      value: 'value',
    },
    type: {
      type: String,
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
    async: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      minWidth: '138px',
      origin: 'right top',
      transition: 'scroll-x-reverse-transition',
      closeOnContentClick: true,
      retainFocus: true,
      open: false,
      noClickAnimation: true,

      originalValue: this.value,
      innerValue: '',
      errorMessage: '',
      inputCheck: null,
    };
  },

  created() {
    if (
      this.value !== null ||
      this.value !== '' ||
      typeof this.value !== undefined
    ) {
      this.innerValue = this.value;
    }

    if (this.async) {
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
    }
  },

  methods: {
    save() {
      this.$emit('save', {
        id: this.id,
        type: this.type,
        value: this.innerValue,
      });

      this.open = false;
    },

    reset() {
      this.open = false;
      this.computedValue = this.value;
    },
  },

  watch: {
    open(v) {
      if (!v) this.reset();
    },

    innerValue: function (v) {
      if (this.async) {
        if (v === this.originalValue) {
          this.errorMessage = '';
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
    rootClasses() {
      return [
        'v-edit-dialog',
        {
          'v-table-dialog-sm-and-down': this.$vuetify.breakpoint.smAndDown,
        },
      ];
    },

    displayValue() {
      if (this.items && this.items.length) {
        if (this.itemText !== 'text' && this.itemValue !== 'value') {
          const v = this.items.find(
            (item) => item[this.itemValue] === this.innerValue
          );
          if (v) return v[this.itemText];
        }
      }
      return this.innerValue;
    },

    computedValue: {
      get() {
        return this.innerValue;
      },
      set(value) {
        this.innerValue = value;
      },
    },

    valid() {
      return this.errorMessage.length === 0;
    },
  },
};
</script>

<style>
.v-table-dialog-sm-and-down {
  left: 0;
}

.v--table-item-pointer {
  cursor: pointer;
}
</style>