<template>
  <v-menu absolute :close-on-content-click="closeOnClick">
    <template v-slot:activator="{ on }">
      <v-chip small pill v-on="on" @click.stop="setRoles">
        <v-icon small>mdi-plus</v-icon>
      </v-chip>
    </template>
    <v-list>
      <v-list-item
        v-for="(role, idx) in roles"
        :key="idx"
        @click.stop="addRole(role)"
      >
        <span>{{ role.name }}</span>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import roles from '~/constants/roles/public.js';
export default {
  name: 'AddRoleMenu',

  data() {
    return {
      closeOnClick: true,
    };
  },

  methods: {
    addRole(role) {
      this.$emit('add', role);
    },
    setRoles() {
      if (this.roles.length) return;
      this.$store.dispatch(roles.actions.FETCH, false);
    },
  },

  computed: {
    roles() {
      return this.$store.getters[roles.getters.ITEMS];
    },
  },
};
</script>
