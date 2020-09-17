<template>
  <v-row>
    <v-col cols="5">
      <role-permission-menu label="Action" :items="actions" v-model="computedAction"></role-permission-menu>
      <!-- <v-select label="Action" :items="actions" v-model="computedAction"></v-select> -->
    </v-col>
    <v-col cols="5">
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
          // this.$nextTick(() => {
          //   this.$emit('change', {
          //     action: value,
          //     resource: this.isValid(this.resource) ? this.resource : '',
          //   });
          // });
          this.$emit('change', {
            action: value,
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
          // this.$nextTick(() => {
          //   this.$emit('change', {
          //     action: this.action,
          //     resource: this.isValid(value) ? value : '',
          //   });
          // });
          this.$emit('change', {
            action: this.action,
            resource: this.isValid(value) ? value : '',
          });
        }
        this.$emit('update:resource', value);
      },
    },
  },
};
</script>