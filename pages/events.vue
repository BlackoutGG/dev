<template>
  <section id="events">
    <parallax-banner :title="title"></parallax-banner>
    <v-container fluid>
      <event-calender />
    </v-container>
  </section>
</template>

<script>
import EventCalender from '~/components/events/Events.vue';
import ParallaxBanner from '~/components/Parallax.vue';
import setPageTitle from '~/middleware/setPageTitle.js';
import lists from '~/utilities/ns/public/lists.js';
export default {
  name: 'Events',
  layout: 'default',

  components: { EventCalender, ParallaxBanner },
  middleware: [
    'auth',
    ({ $auth, redirect }) => {
      if ($auth.hasScope('view:events')) {
        return redirect('/');
      } else {
        const categories = this.$store.getters[lists.getters.GET_ITEMS](
          'categories'
        );
        if (categories.length) return;

        store.dispatch(lists.actions.FETCH, 'categories');
      }
    },
    setPageTitle('Events'),
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
