<template>
  <v-container fluid>
    <settings-list :settings="settings">
      <!-- <template #url>
        <v-list-item>
          <v-list-item-content>
            <v-text-field
              v-model="videoUrl"
              outline
              :disabled="!settings.showVideo.value"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
      </template> -->
    </settings-list>
  </v-container>
</template>

<script>
import setPageTitle from '~/middleware/setPageTitle.js';
import SettingsList from '~/components/frontpage/FPSettings.vue';
import settingConstants from '~/constants/settings/public.js';
import cloneDeep from 'lodash/cloneDeep';
import snakeCase from 'lodash/snakeCase';
import pick from 'lodash/pick';
export default {
  name: 'FPIndex',
  layout: 'admin',

  components: {
    SettingsList,
  },

  middleware: [
    'auth',
    setPageTitle('Front Page Settings'),
    ({ $auth, $permissions, store, redirect }) => {
      const scopes = [$permissions.VIEW_ALL_ADMIN];
      if (!$auth.hasScope(scopes)) {
        return redirect('/');
      }
    },
  ],

  asyncData(ctx) {
    const cloned = cloneDeep(
      ctx.store.getters[settingConstants.getters.SETTINGS]([
        'showVideo',
        'showVideoOnMobile',
        'showTestimonies',
        'flipInfoBlocksOnEven',
        'frontPageVideoUrl',
      ])
    );

    const {
      showVideo,
      showVideoOnMobile,
      showTestimonies,
      flipInfoBlocksOnEven,
      frontPageVideoUrl,
    } = cloned;

    showVideoOnMobile.validator = () => showVideo.value === false;

    return {
      settings: {
        showVideo,
        showVideoOnMobile,
        showTestimonies,
        flipInfoBlocksOnEven,
      },
      frontPageVideoUrl,
    };
  },

  methods: {
    save() {
      const original = this.$store.getters[settingConstants.getters.SETTINGS]([
        'showVideo',
        'showVideoOnMobile',
        'showTestimonies',
        'flipInfoBlocksOnEven',
        'frontPageVideoUrl',
      ]);

      const payload = Object.entries({
        ...this.settings,
        frontPageVideoUrl: this.frontPageVideoUrl,
      }).reduce((output, [key, item]) => {
        if (original[key].value !== item.value) {
          output[snakeCase(key)] = item.value;
        }
        return output;
      }, {});

      this.$store.dispatch(settingConstants.actions.SAVE_SETTINGS, payload);
    },
  },
};
</script>
