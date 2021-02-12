<template>
  <v-container fluid>
    <fp-settings-block :settings="settings">
      <template #url>
        <v-list-item>
          <v-list-item-content>
            <v-text-field
              v-model="videoUrl"
              outline
              :disabled="!settings.showVideo.value"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
      </template>
    </fp-settings-block>
  </v-container>
</template>

<script>
import FPSettings from '~/components/frontpage/FPSettingsBlock.vue';
import snackbar from '~/components/snackbar/store/types/public.js';
import settings from '~/store/settings/types/public.js';
import pick from 'lodash/pick';
export default {
  name: 'FPIndex',
  layout: 'admin',

  components: { FPSettings },

  middleware: [
    'auth',
    setPageTitle('Front Page Settings'),
    ({ $auth, store, redirect }) => {
      const scopes = ['view:admin'];
      if (!$auth.hasScope(scopes)) {
        return redirect('/');
        //   } else {
        //     store.dispatch(lists.actions.FETCH, 'categories');
      }
    },
  ],

  // asyncData() {
  //   const store = this.$store.getters[settings.getters.SETTINGS]([
  //     'showVideo',
  //     'showVideoOnMobile',
  //     'showTestimonies',
  //     'flipInfoBlocksOnEven',
  //   ]);

  //   return {
  //     settings: Object.assign({}, store),
  //     videoUrl: this.$store.getters[settings.getters.SETTINGS]([
  //       'frontPageVideoUrl',
  //     ]),
  //   };
  // },

  data() {
    return {
      settings: {
        showVideo: {
          title: 'Show video',
          description: 'Show or hide the video on the index page.',
          value: true,
        },
        showVideoOnMobile: {
          title: 'Show video on mobile',
          description: 'Show or hide the index page video on mobile.',
          value: true,
          validator: () => this.settings.showVideo.value,
        },
        showTestimonies: {
          title: 'Show Testimonies',
          description: 'Show short text blobs of our victims for funnsies.',
          value: true,
        },
        flipInfoBlocksOnEven: {
          title: 'Flip Info block position on Even',
          description:
            'Enable to over ride position of info block. Info block text and image positions will shift depending on order.',
          value: true,
        },
      },
    };
  },

  methods: {
    save() {
      this.$store.dispatch(settings.actions.SAVE_SETTINGS, {
        ...this.settings,
        frontPageVideoUrl: this.videoUrl,
      });
    },
  },
};
</script>
