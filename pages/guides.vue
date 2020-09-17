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
  name: 'Guides',
  components: { ParallaxBanner },

  layout: 'default',

  head() {
    return { title: 'Guides' }
  },

  data() {
    return {
      title: 'Guides',
    }
  },
}
</script>
