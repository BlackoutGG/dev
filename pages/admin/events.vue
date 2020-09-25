<template>
  <v-container fluid>
    <event-calendar />
  </v-container>
</template>

<script>
import EventCalendar from '~/components/events/Events.vue';
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
        const categories = store.getters[lists.getters.GET_ITEMS]('categories');
        if (!categories.length) {
          store.dispatch(lists.actions.FETCH, 'categories');
        }
      }
    },
  ],
};
</script>
