<template>
  <section id="history">
    <parallax-banner :title="title"></parallax-banner>
    <v-container fill-height></v-container>
  </section>
</template>

<script>
import setTitle from '~/middleware/setPageTitle.js'
import ParallaxBanner from '~/components/Parallax.vue'
export default {
  name: 'History',

  components: { ParallaxBanner },

  middleware: [setTitle('History')],
  head() {
    return { title: 'History' }
  },
  data() {
    return {
      title: 'History',
    }
  },
}
</script>
