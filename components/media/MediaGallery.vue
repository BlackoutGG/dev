<template>
  <v-tab-item>
    <v-item-group v-model="selectedItems">
      <v-container fluid>
        <v-scale-transition
          group
          tag="div"
          class="row"
          v-if="media && media.length"
        >
          <v-col
            cols="12"
            v-for="item in media"
            :md="columnSizes.md"
            :sm="columnSizes.sm"
            :key="item.id"
          >
            <v-item #default="{ active, toggle }" :value="item.url">
              <v-img
                :class="{ 'is-selected': active }"
                :src="item.url"
                :max-width="maxThumbnailWidth"
                :max-height="maxThumbnailHeight"
                :min-width="minThumbnailWidth"
                :min-height="minThumbnailHeight"
                @click="toggle"
              >
                <v-btn icon small top right absolute>
                  <v-checkbox
                    v-model="computedSelected"
                    multiple
                    :value="item.storage_key"
                  ></v-checkbox>
                </v-btn>
              </v-img>
            </v-item>
          </v-col>
        </v-scale-transition>

        <v-row align="center" justify="center" v-else>
          <div class="no-images">
            <div class="text-center">
              <v-icon :size="size" v-text="icon"></v-icon>
              <p class="text-h4 grey--text font-weight-medium">
                No images found.
              </p>
            </div>
          </div>
        </v-row>
        <loader @infinite="onUpdate" :distance="90">
          <template #no-more>
            <v-btn x-large text @click="onUpdate(null)">
              <v-icon left v-text="refreshIcon"></v-icon>
              <span>REFRESH</span>
            </v-btn>
          </template>
        </loader>
      </v-container>
    </v-item-group>
  </v-tab-item>
</template>

<script>
import Loader from 'vue-infinite-loading';
import mediaProps from '~/mixins/props/media.js';
import mediaMixins from '~/mixins/media.js';
import media from '~/utilities/ns/public/media.js';
import pick from 'lodash/pick';

export default {
  name: 'MediaGallery',

  components: { Loader },

  mixins: [mediaProps, mediaMixins],

  props: {
    imageSelected: {
      type: [String, Array],
    },
  },

  data() {
    return {
      icon: 'mdi-file-alert',
      refreshIcon: 'mdi-refresh',
      removeIcon: 'mdi-close',

      size: 120,
      start: 1,
      limit: 50,
    };
  },

  // async fetch() {
  //   this.media = await this.fetchMedia();
  //   this.start++;
  // },

  methods: {
    async onUpdate($state) {
      try {
        const items = await this.fetchMedia();
        if (items && items.length) {
          this.start++;
          this.media = items;
          if ($state) $state.loaded();
        } else {
          console.log('No more to load...');
          if ($state) $state.complete();
        }
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    async fetchMedia() {
      const { start, limit } = this;

      try {
        const { media } = (
          await this.$axios.get(`/media`, {
            params: { start, limit },
          })
        ).data;

        return media;
      } catch (err) {
        throw err;
      }
    },
  },

  computed: {
    fillHeight() {
      return { 'fill-height': this.media && this.media.length };
    },

    selectedItems: {
      get() {
        return this.imageSelected;
      },
      set(val) {
        this.$emit('update:imageSelected', val);
      },
    },
  },
};
</script>

<style>
.is-selected {
  border: 2px solid #779ecb;
}
</style>
