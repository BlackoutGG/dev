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
    ({ $auth, store, redirect }) => {
      if (!$auth.hasScope(['view:admin', 'view:media'])) return redirect('/');
      //   else store.dispatch(roles.actions.FETCH);
    },
  ],
};
</script>
