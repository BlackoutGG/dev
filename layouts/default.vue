<template>
  <v-app dark>
    <nav-header />
    <v-main>
      <nuxt />
    </v-main>
    <nav-footer />
    <status-dialog />
  </v-app>
</template>

<script>
import NavHeader from '~/components/navigation/NavHeader.vue';
import NavFooter from '~/components/navigation/NavFooter.vue';
import StatusDialog from '~/components/core/StatusDialog.vue';
export default {
  name: 'DefaultLayout',
  components: {
    NavHeader,
    NavFooter,
    StatusDialog,
  },
  created() {
    if (!this.$vuetify.theme.dark) {
      this.$vuetify.theme.dark = true;
    }
  },
};
</script>
