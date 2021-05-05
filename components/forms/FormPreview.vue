<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-select
          :items="categoryList"
          :item-text="'name'"
          :value="category"
          :item-value="'id'"
          label="Category"
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-textarea
          readonly
          v-model="description"
          outlined
          label="Description"
        ></v-textarea>
      </v-col>
    </v-row>
    <v-row v-for="(field, idx) in fields" :key="idx">
      <v-col cols="12">
        <div class="text--subtitle-1 font-weight-medium">
          <span>Question {{ idx + 1 }}</span>
        </div>
        <p class="text--white">{{ field.value }}</p>
        <form-field :field="field"></form-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import lists from '~/constants/table/public.js';
import forms from '~/constants/forms/private.js';
import FormField from './FormField.vue';

const { mapGetters, mapMutations } = createNamespacedHelpers('forms');

export default {
  name: 'FormPreview',

  components: { FormField },

  data() {
    return {
      radioGroup: '',
    };
  },

  methods: {
    /**
     * setDescription()
     * setCategory()
     */
    ...mapMutations([
      forms.mutations.SET_DESCRIPTION,
      forms.mutations.SET_CATEGORY,
    ]),
  },

  computed: {
    /**
     * questions()
     * description()
     * category()
     */
    ...mapGetters([
      forms.getters.VALID_FIELDS,
      forms.getters.DESCRIPTION,
      forms.getters.CATEGORY,
    ]),

    fields() {
      return this.validFields;
    },

    categoryList() {
      return this.$store.getters[lists.getters.GET_ITEMS]('categories');
    },
  },
};
</script>
