<template>
  <v-chip-group>
    <v-chip
      small
      pill
      close
      @click:close="remove(role)"
      v-for="(role, idx) in displayedRoles"
      :key="idx"
    >
      <span>{{role.name}}</span>
    </v-chip>
    <truncated-role-menu :truncated="truncated" v-if="truncated.length" @remove="remove" />
    <add-role-menu @add="add"></add-role-menu>
  </v-chip-group>
</template>

<script>
import vuex from 'vuex';
import AddRoleMenu from './AddRoleMenu.vue';
import TruncatedRoleMenu from './TruncatedRoleMenu.vue';

import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('users');

export default {
  name: 'RoleChipGroup',
  components: { AddRoleMenu, TruncatedRoleMenu },
  props: {
    roles: {
      type: Array,
    },
    userId: {
      type: [String, Number],
    },
    display: {
      type: Number,
      default: 3,
    },
  },

  methods: {
    ...mapActions(['addRoleToUser', 'removeRoleFromUser']),
    remove(role) {
      this.removeRoleFromUser({ userId: this.userId, roleId: role.id });
    },
    add(role) {
      const idx = this.roles.findIndex((r) => r.name === role.name);
      if (idx === -1) {
        this.addRoleToUser({ userId: this.userId, roleId: role.id });
      }
    },
  },

  computed: {
    end() {
      return this.roles
        ? this.display > this.roles.length
          ? this.roles.length
          : this.display
        : 0;
    },
    displayedRoles() {
      return this.roles
        ? this.roles.length > 1
          ? this.roles.slice(0, this.end)
          : this.roles
        : [];
    },
    truncated() {
      return this.roles && this.roles.length
        ? this.roles.slice(this.end, this.roles.length)
        : [];
    },
  },
};
</script>