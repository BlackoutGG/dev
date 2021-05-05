<template>
  <v-app-bar app flat clipped class="transparent mx-5">
    <v-app-bar-nav-icon
      class="background--white elevation-1"
      @click="toggleNav"
    >
      <v-icon>mdi-dots-vertical</v-icon>
    </v-app-bar-nav-icon>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <admin-user-menu v-model="openDrawer" />
  </v-app-bar>
</template>

<script>
import page from '~/constants/page/public.js';
import AdminUserMenu from './AdminUserMenu';
export default {
  name: 'AdminNavbar',
  components: { AdminUserMenu },

  data() {
    return {
      openDrawer: false,
    };
  },

  methods: {
    toggleNav() {
      // this.$store.commit(page.mutations.TOGGLE_ACPANEL, !this.showDrawer);
      this.openDrawer = !this.openDrawer;
    },
  },

  computed: {
    // showDrawer() {
    //   return this.$store.getters[page.getters.ACPANEL];
    // },
    title() {
      return this.$store.getters[page.getters.TITLE];
    },
  },
};
</script>

<style scoped>
.background--white {
  background-color: #fff;
}
</style>
