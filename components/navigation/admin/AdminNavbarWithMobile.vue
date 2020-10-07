<template>
  <nav>
    <v-app-bar app flat clipped absolute class="transparent mx-5">
      <v-app-bar-nav-icon
        class="background--white elevation-1"
        @click="toggleDrawer"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <user-panel
        :displayMenuUser="true"
        :hideOnMobile="false"
        :links="userPanelLinks"
      ></user-panel>
    </v-app-bar>
    <admin-nav-drawer v-model="showDrawer" :links="links"></admin-nav-drawer>
  </nav>
</template>

<script>
import page from '~/utilities/ns/public/page.js';
import AdminNavDrawer from './AdminNavDrawer.vue';
import AdminUserMenu from './AdminUserMenu.vue';
export default {
  name: 'AdminNavbar',
  components: { AdminUserMenu, AdminNavDrawer },

  data() {
    return {
      showDrawer: false,

      userPanelLinks: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/',
        },
      ],

      links: [
        {
          icon: 'mdi-view-dashboard',
          title: 'Dashboard',
          to: '/admin',
        },
        {
          icon: 'mdi-account-group',
          title: 'Users',
          to: '/admin/users',
        },
        {
          icon: 'mdi-account-star',
          title: 'Roles',
          to: '/admin/roles',
        },
        {
          icon: 'mdi-note',
          title: 'Posts',
          button: true,
        },
        {
          icon: 'mdi-shape',
          title: 'Categories',
          to: '/admin/categories',
        },
        {
          icon: 'mdi-tag-multiple',
          title: 'Tags',
          button: true,
        },
        {
          icon: 'mdi-note-plus',
          title: 'Recruitment',
          children: [
            {
              title: 'Form Templates',
              to: '/admin/recruitment/templates',
            },
            {
              title: 'Forms',
              to: '/admin/recruitment',
            },
          ],
        },
        {
          icon: 'mdi-calendar-range',
          title: 'Events',
          to: '/admin/events',
        },
      ],
    };
  },

  methods: {
    toggleDrawer() {
      this.showDrawer = !this.showDrawer;
    },
  },

  computed: {
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
