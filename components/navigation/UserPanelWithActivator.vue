<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y>
    <template #activator="{ on }">
      <slot name="activator" v-bind="{ on }" />
    </template>
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <img :src="$auth.user.avatar" alt="" v-if="$auth.user.avatar" />
            <span v-else>{{ initials }}</span>
          </v-list-item-avatar>
          <v-list-item-content v-if="$auth.loggedIn && displayMenuUser">
            <v-list-item-title>{{ username }}</v-list-item-title>
            <v-list-item-subtitle>Member</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list>
        <nav-link
          v-for="(l, idx) in links"
          :title="l.title"
          :icon="l.icon"
          :key="idx"
        />
        <nav-link
          :title="'Admin'"
          :icon="'mdi-shield'"
          :to="'/admin'"
          v-if="$auth.hasScope('view:admin')"
        />
        <v-divider></v-divider>
        <nav-link
          :title="'Logout'"
          :icon="'mdi-logout'"
          :button="true"
          @click.native="logout"
        />
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import NavLink from './NavLink.vue';
import avatar from '~/mixins/avatar.js';
export default {
  name: 'UserPanel',
  components: { NavLink },

  props: {
    links: {
      type: Array,
      default: () => [],
    },

    displayMenuUser: {
      type: Boolean,
      default: true,
    },

    displayToggleUser: {
      type: Boolean,
      default: false,
    },

    hideOnMobile: {
      type: Boolean,
      default: true,
    },

    avatarColor: {
      type: String,
      default: '#0a0a0a',
    },

    avatarSize: {
      type: [String, Number],
      default: 32,
    },
  },

  data() {
    return {
      menu: false,
    };
  },

  methods: {
    logout() {
      this.$auth.logout('local');
    },
  },

  computed: {
    avatarClasses() {
      return ['user-panel-avatar', { 'hidden-sm-and-down': this.hideOnMobile }];
    },

    username() {
      return this.$auth.user ? this.$auth.user.username : null;
    },
    initials() {
      if (this.username) {
        const initials = this.username.match(/\b\w/g) || [];
        return (
          (initials.shift() || '') + (initials.pop() || '')
        ).toUpperCase();
      }
    },
    avatar() {
      return this.$auth.user.avatar ? this.$auth.user.avatar : this.initials;
    },
  },
};
</script>

<style lang="scss">
.user-panel-avatar {
  cursor: pointer;
}
</style>