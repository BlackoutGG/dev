<template>
  <v-card tile flat>
    <v-toolbar tile :flat="!header" class="z-index" max-height="112px">
      <template v-if="header">
        <v-toolbar-title>
          <span class="black--text">{{ title }}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <slot name="close" />
      </template>
      <template #extension>
        <v-tabs v-model="currentTab" :class="tabClasses">
          <v-tab>
            <span>Upload Images</span>
          </v-tab>
          <v-tab>
            <span>My Images</span>
          </v-tab>
        </v-tabs>
        <v-spacer></v-spacer>
        <slot name="topActions" v-bind="actionSlotProperties" />
        <v-btn
          class="tab"
          text
          :disabled="isDeleteDisabled"
          @click="open = true"
        >
          <v-icon left v-text="deleteIcon"></v-icon>
          <span>Delete {{ selected.length }}</span>
        </v-btn>
        <v-btn
          class="tab"
          text
          :disabled="isUploadDisabled"
          @click="uploadFiles"
        >
          <v-icon left v-text="uploadIcon"></v-icon>
          <span>Upload {{ upload.length }}</span>
        </v-btn>
      </template>
    </v-toolbar>

    <v-card-text class="fill-height">
      <v-tabs-items v-model="tab">
        <media-upload
          v-model="upload"
          v-bind="thumbnailDimensions"
          :uploadProgress="uploadProgress"
          :isSending="isSending"
          :fileSize="fileSize"
          :selected.sync="uploadSelected"
          :single="single"
          :columnSizes="columnSizes"
        ></media-upload>
        <media-gallery
          v-model="gallery"
          v-bind="thumbnailDimensions"
          :selected.sync="gallerySelected"
          :imageSelected.sync="imageSelected"
          :columnSizes="columnSizes"
        ></media-gallery>
      </v-tabs-items>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <slot name="bottomActions" v-bind="actionSlotProperties" />
    </v-card-actions>
    <table-delete-dialog
      v-model="open"
      @deleteAll="onDelete"
      @cancel="onCancel"
      :length="selected.length"
    ></table-delete-dialog>
  </v-card>
</template>

<script>
import MediaGallery from './MediaGallery.vue';
import MediaUpload from './MediaUpload.vue';
import TableDeleteDialog from '~/components/table/TableDeleteDialog.vue';
import media from '~/utilities/ns/public/media.js';
import snackbar from '~/utilities/ns/public/snackbar.js';
import mediaProps from '~/mixins/props/media.js';
import pick from 'lodash/pick';

export default {
  name: 'MediaContainer',

  components: { MediaGallery, MediaUpload },

  mixins: [mediaProps],

  props: {
    header: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
    },
    single: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    startingTab: {
      type: Number,
      default: 0,
    },
    scrollable: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      columnSizes: {
        md: 2,
        sm: 6,
      },

      deleteIcon: 'mdi-trash-can',
      uploadIcon: 'mdi-cloud-upload-outline',

      gallery: [],
      upload: [],

      gallerySelected: [],
      uploadSelected: [],

      imageSelected: '',

      isSending: false,

      tab: 0,
      uploadProgress: 0,
      open: false,
    };
  },

  methods: {
    message(text, options) {
      this.$store.dispatch(snackbar.actions.TOGGLE_BAR, { text });
    },

    onCancel() {
      this.open = false;
    },

    async onDelete() {
      if (this.isUploadTab) {
        this.upload = this.upload.filter(
          (item, idx) => !this.uploadSelected.includes(idx)
        );

        this.uploadSelected = [];

        return;
      }

      this.isSending = true;

      try {
        const params = { keys: this.gallerySelected };
        const { ids } = (await this.$axios.delete(`/media`, { params })).data;

        this.gallery = this.gallery.filter(({ id }) => !ids.includes(id));
        this.gallerySelected = [];
        this.message(`Deleted ${ids.length} items.`);
      } catch (err) {
        console.log(err);
        this.message(
          'Encountered a problem executing action. Please contact the administrator'
        );
      } finally {
        this.isSending = false;
      }
    },

    async uploadFiles() {
      if (!this.isUploadTab || !this.upload.length) return;

      const formData = new FormData();

      const onUploadProgress = (progressEvent) => {
        this.uploadProgress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        if (this.uploadProgress === 100) {
          this.$nextTick(() => {
            this.upload = [];
            this.uploadProgress = 0;
          });
        }
      };

      const config = { onUploadProgress };

      this.upload.forEach(({ image }) => formData.append('media', image));
      this.isSending = true;

      try {
        await this.$axios.post('/media', formData, config);
        this.message('Upload complete.');
      } catch (err) {
        console.log(err);
        throw err;
      } finally {
        this.isSending = false;
      }
    },
  },

  computed: {
    selected() {
      return this.tab === 1 ? this.gallerySelected : this.uploadSelected;
    },

    actionSlotProperties() {
      return {
        selected: this.imageSelected,
        isSending: this.isSending,
        tab: this.tab,
      };
    },

    isUploadTab() {
      return this.tab === 0;
    },

    isDeleteDisabled() {
      return this.isSending || !this.selected.length;
    },

    isUploadDisabled() {
      return this.isSending || !this.upload.length || !this.isUploadTab;
    },

    tabClasses() {
      return { 'tabs-disabled': this.isSending };
    },

    isScrollable() {
      return { scrollable: this.scrollable };
    },

    thumbnailDimensions() {
      return pick(this.$props, [
        'maxThumbnailWidth',
        'minThumbnailWidth',
        'maxThumbnailHeight',
        'maxThumbnailHeight',
      ]);
    },

    currentTab: {
      get() {
        return this.tab;
      },
      set(val) {
        if (this.isSending) return;
        this.tab = val;
      },
    },
  },
};
</script>

<style style="scss">
.tabs-disabled {
  opacity: 0.7;
}

.z-index {
  z-index: 1;
}
</style>
