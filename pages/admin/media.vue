<template>
  <v-container fluid>
    <media-container :header="false"></media-container>
  </v-container>
</template>

<script>
import MediaContainer from '~/components/media/MediaContainer.vue';
import setPageTitle from '~/middleware/setPageTitle.js';

export default {
  layout: 'admin',
  name: 'AdminMedia',

  components: { MediaContainer },

  middleware: [
    'auth',
    setPageTitle('View Media'),
    ({ $auth, $permissions, store, redirect }) => {
      const { VIEW_ALL_ADMIN, VIEW_ALL_MEDIA } = $permissions;
      const perms = [$permissions.VIEW_ALL_ADMIN, $permissions.VIEW_ALL_MEDIA];

      if (!$auth.hasScope(perms)) return redirect('/');
      //   else store.dispatch(roles.actions.FETCH);
    },
  ],
};
</script>
