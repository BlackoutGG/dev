<template>
  <section id="history">
    <parallax-banner :title="title"></parallax-banner>
    <v-container fill-height></v-container>
  </section>
</template>

<script>
import ParallaxBanner from '~/components/core/Parallax.vue';
export default {
  name: 'History',

  components: { ParallaxBanner },

  head() {
    return { title: 'History' };
  },
  data() {
    return {
      title: 'History',
    };
  },
};
</script>
