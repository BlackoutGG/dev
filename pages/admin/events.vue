<template>
  <v-container fluid> </v-container>
</template>

<script>
import setPageTitle from '~/middleware/setPageTitle.js';
import lists from '~/utilities/ns/public/lists.js';
export default {
  name: 'Events',
  layout: 'admin',

  components: { EventCalendar },

  middleware: [
    'auth',
    setPageTitle('View Events'),
    ({ $auth, store, redirect }) => {
      if (!$auth.hasScope(['view:admin', 'view:events'])) {
        return redirect('/');
      } else {
        store.dispatch(lists.actions.FETCH, 'categories');
      }
    },
  ],
};
</script>
