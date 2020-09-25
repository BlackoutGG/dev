<template>
  <v-dialog v-model="open" :max-width="maxWidth">
    <template #activator="{ on }">
      <v-btn class="align-self-center mr-4" text v-on="on">
        <span>Apply</span>
      </v-btn>
    </template>
    <v-card class>
      <v-toolbar prominent>
        <div class="d-flex align-center justify-center flex-grow-1 inherit">
          <v-select
            label="Category"
            :items="categoryList"
            :item-text="'name'"
            :item-value="'id'"
            v-model="category"
          ></v-select>
        </div>
        <v-btn x-small absolute top right icon @click="open = false">
          <v-icon v-text="closeIcon"></v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class>
        <v-form v-model="valid" ref="form">
          <form-application
            v-model="fields"
            ref="formApplication"
            :form="selectedForm"
            :open="open"
          >
            <template #recaptcha>
              <vue-recaptcha
                ref="recaptcha"
                :sitekey="siteKey"
                :theme="'dark'"
                @render="onRender"
                @verify="onVerfiy"
                @expired="resetRecaptcha"
                @error="onError"
              ></vue-recaptcha>
            </template>
          </form-application>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="save" :disabled="isDisabled">Submit</v-btn>
        <v-btn text @click="$refs.form.reset()">Reset</v-btn>
      </v-card-actions>
      <v-overlay v-model="isSending">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-card>
  </v-dialog>
</template>

<script>
import lists from '~/utilities/ns/public/lists.js';
import forms from '~/utilities/ns/public/forms.js';
import recaptcha from '~/mixins/recaptcha.js';
import FormApplication from '~/components/forms/FormApplication.vue';
import VueRecaptcha from 'vue-recaptcha';

export default {
  name: 'FormApplicationDialog',

  components: { FormApplication, VueRecaptcha },

  mixins: [recaptcha],

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      closeIcon: 'mdi-close',
      maxWidth: '600px',
      valid: false,
      isSending: false,
      isInitial: true,
      selectedForm: null,
      category: null,
      forms: [],
      categoryList: [],
      fields: [],
    };
  },

  watch: {
    category(newId, oldId) {
      if (!oldId) return;
      this.setForm(newVal);
    },

    open(v) {
      if (!v) {
        this.form = null;
        this.fields = [];
      } else {
        if (this.isInitial) {
          this.setForm();
          this.isInitial = false;
        }
      }
    },
  },

  methods: {
    async save() {
      const params = {
        form_id: this.selectedForm.id,
        fields: this.fields,
        gresponse: this.gresponse,
      };
      try {
        const result = await this.$axios.post('/recruitment', params);
        console.log(result);
      } catch (err) {}
    },

    async setForm(id) {
      let selectedForm = this.forms.find(
        (form) => form && id && form.category_id === id
      );

      if (!selectedForm) {
        const getForm = id ? this.getForm(id) : this.getForm();
        const results = await getForm;

        if (results.categories && results.categories.length) {
          this.categoryList = results.categories;
          if (results.category_id) this.category = results.category_id;
        }

        selectedForm = results.form;

        this.forms.push(selectedForm);
      }
      this.selectedForm = selectedForm;
    },

    async getForm(id) {
      this.isSending = true;

      const url = id ? `/recruitment/${id}` : '/recruitment';

      try {
        const results = (await this.$axios.get(url)).data;
        return results;
      } catch (err) {
        console.log(err);
      } finally {
        this.isSending = false;
      }
    },

    async populateCategoryList() {
      if (this.categoryList && this.categoryList.length) return;

      const recruitment = true;

      const { categories } = (
        await this.$axios.get('/categories', {
          params: {
            recruitment,
            page: 1,
            limit: 100,
          },
        })
      ).data;

      this.categoryList = categories.results.map(({ id, name }) => ({
        id,
        name,
      }));
    },
  },

  computed: {
    isDisabled() {
      return !this.gresponse || !this.valid;
    },
    open: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>

<style>
.inherit {
  height: inherit;
}

.no-scroll {
  overflow-y: hidden;
}

.scroll {
  overflow-y: auto;
}
</style>
