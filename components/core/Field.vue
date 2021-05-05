<template>
  <v-text-field
    v-if="item.type === 'text'"
    v-model="computedValue"
    :label="item.label"
    :type="item.type"
    :rules="item.validators"
    filled
  ></v-text-field>
  <v-text-field
    v-else-if="item.type === 'password'"
    v-model="computedValue"
    @click:append="toggleShow"
    :append-icon="item.show ? 'mdi-eye' : 'mdi-eye-off'"
    :type="item.show ? 'text' : item.type"
    :label="item.label"
    :rules="item.validators"
    filled
  ></v-text-field>
  <v-menu
    v-else-if="item.type === 'birthday'"
    ref="menu"
    v-model="menu"
    offset-y
    transition="scale-transition"
    min-width="auto"
    :close-on-content-click="closeOnClick"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="internalValue"
        filled
        :label="item.label"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      ref="picker"
      v-model="date"
      min="1950-01-01"
      @change="save"
      :max="new Date().toISOString().substr(0, 10)"
    ></v-date-picker>
  </v-menu>
  <v-select
    v-else-if="item.type === 'select'"
    v-model="computedValue"
    filled
    :label="item.label"
    :items="item.items"
  >
  </v-select>
  <v-textarea
    v-else-if="item.type === 'textarea'"
    v-model="computedValue"
    filled
    :label="item.label"
  ></v-textarea>
</template>

<script>
export default {
  name: 'CoreInputFields',

  props: {
    value: {
      type: [String, Number, Boolean],
    },
    item: {
      type: Object,
    },
    closeOnClick: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      menu: false,
      internalValue: '',
    };
  },

  watch: {
    value: {
      immediate: true,
      handler: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.internalValue = newVal;
        }
      },
    },
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'));
    },
  },

  methods: {
    toggleShow() {
      this.$emit('update:show', !this.item.show);
    },

    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');

      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    },

    save(date) {
      this.computedValue = date;
      this.$refs.menu.save(date);
    },
  },

  computed: {
    computedValue: {
      get() {
        return this.internalValue;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>
