<template>
  <v-menu v-model="open" ref="menu" :return-value.sync="computedValue">
    <template #activator="{ on }">
      <v-text-field
        class="v--pointer"
        v-bind="$attrs"
        v-model="computedValue"
        v-on="on"
        :disabled="disabled"
        :rules="[isRequired]"
        readonly
      >
        <template #append>
          <v-icon v-text="menuArrowClasses"></v-icon>
        </template>
      </v-text-field>
    </template>
    <v-list>
      <template v-for="(item, idx) in items">
        <v-list-item :key="idx" v-if="!item.disable" @click="$refs.menu.save(item.name)">
          <v-list-item-content>
            <v-list-item-title>{{item.name}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'RolePermissionsMenu',

  props: {
    items: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      open: false,
      isRequired: (v) => !!v,
    };
  },

  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },

    menuArrowClasses() {
      const icon = this.open ? 'mdi-menu-up' : 'mdi-menu-down';
      return icon;
    },
  },
};
</script>

<style>
.v--pointer {
  cursor: pointer;
}
</style>