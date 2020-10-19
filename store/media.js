import ns from '~/utilities/ns/private/media.js';
import snackbar from '~/utilities/ns/public/snackbar.js';

const state = () => ({
  galleryMedia: [],
  upload: [],
  gallerySelected: [],
  uploadSelected: [],
});

const mutations = {
  [ns.mutations.ADD_MEDIA](state, media) {
    state.upload.push(media);
  },

  [ns.mutations.REMOVE_MEDIA](state, ids) {
    state.galleryMedia = state.galleryMedia.filter(
      (media) => !ids.include(media.id)
    );
  },

  [ns.mutations.REMOVE_UPLOAD_MEDIA](state) {
    state.uploadSelected.forEach((idx) => state.upload.splice(idx, 1));
  },

  [ns.mutations.SET_MEDIA](state, media) {
    state.galleryMedia.push(...media);
  },

  [ns.mutations.SET_UPLOAD](state, upload) {
    state.upload = upload;
  },

  [ns.mutations.SET_GALLERY_SELECTED](state, selected) {
    state.gallerySelected = selected;
  },

  [ns.mutations.SET_UPLOAD_SELECTED](state, selected) {
    state.uploadSelected = selected;
  },
};

const actions = {
  async [ns.actions.UPLOAD_MEDIA]({ commit, state }, formData) {
    try {
      const uploaded = (await this.$axios.post('/media', formData)).data;

      const text = `Saved ${uploaded} files.`;

      commit(ns.mutations.SET_UPLOAD, []);
      commit(ns.mutations.SET_UPLOAD_SELECTED, []);
      dispatch(snackbar.actions.TOGGLE_BAR, { text });
    } catch (err) {
      throw err;
    }
  },
  async [ns.actions.REMOVE_MEDIA]({ commit, dispatch }, params) {
    try {
      const { ids } = (await this.$axios.delete('/media', { params })).data;

      const text = `Removed ${ids.length} files.`;

      commit(ns.mutations.SET_GALLERY_SELECTED, []);
      commit(ns.mutations.REMOVE_MEDIA, ids);
      dispatch(snackbar.actions.TOGGLE_BAR, { text });
    } catch (err) {
      throw err;
    }
  },
};

// export default { state, getters, mutations, actions };
