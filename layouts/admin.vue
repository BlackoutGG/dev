<template>
  <v-app light>
    <admin-navbar />
    <v-main id="admin">
      <nuxt />
    </v-main>
    <snackbar />
    <account-change-dialog />
  </v-app>
</template>

<script>
import AdminNavbar from "~/components/navigation/admin/AdminNavbarWithMobile.vue";
import AccountChangeDialog from '~/components/core/AccountChangeDialog.vue';
import Snackbar from "~/components/core/SnackBar.vue";
export default {
  name: "Admin",
  // components: { AdminNavbar, AdminNavDrawer, Snackbar },
  components: { AdminNavbar, AccountChangeDialog, Snackbar },
  created() {
    this.$vuetify.theme.dark = false;
  }
};
</script>

<style lang="scss">
#admin {
  background-color: #fafafa;
}