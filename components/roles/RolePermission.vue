<template>
  <v-row>
    <v-col cols="4">
      <role-permission-menu
        label="Action"
        :items="actions"
        v-model="computedAction"
      ></role-permission-menu>
    </v-col>
    <v-col cols="4">
      <role-permission-menu
        label="Target"
        :items="target"
        v-model="computedTarget"
      ></role-permission-menu>
    </v-col>
    <v-col cols="4">
      <role-permission-menu
        label="Resource"
        :items="resources"
        v-model="computedResource"
        :disabled="!computedAction"
      ></role-permission-menu>
    </v-col>
    <v-col cols="2">
      <v-btn icon>
        <v-icon v-text="icon" @click="$emit('remove')"></v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import uniqBy from 'lodash/uniqBy';
import RolePermissionMenu from './RolePermissionMenu.vue';

export default {
  name: 'RolePermission',

  components: { RolePermissionMenu },

  props: {
    action: {
      type: String,
      default: '',
    },
    resource: {
      type: String,
      default: '',
    },
    target: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      icon: 'mdi-close',
    };
  },

  methods: {
    isValid(value) {
      return this.resources.findIndex(({ name }) => name === value) !== -1;
    },
  },

  computed: {
    menuArrowClasses() {
      return { 'mdi-menu-down': !this.open, 'mdi-menu-up': this.open };
    },

    actions() {
      const items = this.items.reduce((output, item) => {
        if (item.resource === this.resource) {
          output.push({
            name: item.action,
            disable: item.disable,
          });
        }
        return output;
      }, []);

      // const defaultItems = this.items.reduce((output, item) => {
      //   /** CHECK FOR DUPLICATES */
      //   const idx = this.output.find((_item) => _item.action === item.action);
      //   if (idx === -1) output.push({ name: item.action });
      //   return output;
      // }, []);

      // const defaultItems = uniqBy(
      //   this.items.map((item) => ({ name: item.action })),
      //   'name'
      // );

      const defaultItems = [
        { name: 'view' },
        { name: 'add' },
        { name: 'update' },
        { name: 'delete' },
      ];

      return this.resource ? items : defaultItems;
    },

    targets() {
      const items =
        this.items && this.items.length
          ? this.items.reduce((output, item) => {
              if (item.target === this.target) {
                output.push({
                  disable: item.disable,
                  name: item.target,
                });
              }
              return output;
            }, [])
          : [];

      return items;
    },

    resources() {
      const items =
        this.items && this.items.length
          ? this.items.reduce((output, item) => {
              if (item.action === this.action) {
                output.push({
                  disable: item.disable,
                  name: item.resource,
                });
              }
              return output;
            }, [])
          : [];

      return items;
    },

    computedAction: {
      get() {
        return this.action;
      },
      set(value) {
        if (this.resource) {
          this.$emit('change', {
            action: value,
            target: this.target,
            resource: this.isValid(this.resource) ? this.resource : '',
          });
        }
        this.$emit('update:action', value);
      },
    },
    computedResource: {
      get() {
        return this.resource;
      },
      set(value) {
        if (this.action) {
          this.$emit('change', {
            action: this.action,
            target: this.target,
            resource: this.isValid(value) ? value : '',
          });
        }
        this.$emit('update:resource', value);
      },
    },
    computedTarget: {
      get() {
        return this.resource;
      },
      set(value) {
        if (this.action) {
          this.$emit('change', {
            action: this.action,
            target: value,
            resource: this.isValid(value) ? value : '',
          });
        }
        this.$emit('update:target', value);
      },
    },
  },
};
</script>
