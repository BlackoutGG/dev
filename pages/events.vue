<template>
  <section id="events">
    <parallax-banner :title="title"></parallax-banner>
    <v-container fluid>
      <event-calender />
    </v-container>
  </section>
</template>

<script>
import EventCalender from '~/components/events/EventCalendar.vue';
import ParallaxBanner from '~/components/Parallax.vue';
import setPageTitle from '~/middleware/setPageTitle.js';
import lists from '~/utilities/ns/public/lists.js';
export default {
  name: 'Events',
  layout: 'default',

  components: { EventCalender, ParallaxBanner },
  middleware: [
    'auth',
    setPageTitle('View Events'),
    ({ $auth, store, redirect }) => {
      if (!$auth.hasScope(['view:events'])) {
        return redirect('/');
      } else {
        store.dispatch(lists.actions.FETCH, 'categories');
      }
    },
  ],

  head() {
    return { title: 'Events' };
  },
  data() {
    return {
      title: 'Events',
    };
  },
};
</script>
