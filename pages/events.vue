<template>
  <section id="events">
    <parallax-banner :title="title"></parallax-banner>
    <v-container fluid>
      <calendar />
    </v-container>
  </section>
</template>

<script>
import Calendar from '~/components/calendar/Calendar.vue';
import ParallaxBanner from '~/components/core/Parallax.vue';
import lists from '~/utilities/ns/public/lists.js';
export default {
  name: 'Events',
  layout: 'default',

  components: { ParallaxBanner, Calendar },
  middleware: [
    'auth',
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
