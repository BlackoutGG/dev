<template>
  <v-app dark>
    <user-navbar />
    <v-main>
      <nuxt />
      <snack-bar />
    </v-main>
    <site-footer />
    <account-change-dialog />
  </v-app>
</template>

<script>
import UserNavbar from '~/components/navigation/NavHeader.vue';
import VideoBanner from '~/components/frontpage/VideoBanner.vue';
import SnackBar from '~/components/core/SnackBar.vue';
import AccountChangeDialog from '~/components/core/AccountChangeDialog.vue';
import SiteFooter from '~/components/navigation/Footer.vue';
export default {
  name: 'DefaultLayout',
  components: {
    UserNavbar,
    VideoBanner,
    SnackBar,
    SiteFooter,
    AccountChangeDialog,
  },
  created() {
    if (!this.$vuetify.theme.dark) {
      this.$vuetify.theme.dark = true;
    }
  },
};
</script>
