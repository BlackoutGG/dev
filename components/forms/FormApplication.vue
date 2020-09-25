<template>
  <v-container v-if="fields">
    <v-row>
      <v-col cols="12">
        <p v-text="form.description"></p>
      </v-col>
    </v-row>
    <v-row v-for="(field, idx) in form.fields" :key="idx">
      <v-col cols="12">
        <div class="text--subtitle-1 font-weight-medium">
          <span>Question {{ idx + 1 }}</span>
          <span class="required" v-if="!field.optional">*</span>
        </div>
        <p class="text--white">{{ field.value }}</p>
        <template v-if="!field.options">
          <v-text-field
            v-model="fields[`textfield_${field.id}`]"
            :rules="field.optional ? [] : [isRequired]"
            v-if="field.type === 'textfield'"
          ></v-text-field>
          <v-textarea
            v-model="fields[`textarea_${field.id}`]"
            filled
            :rules="field.optional ? [] : [isRequired]"
            v-else
          ></v-textarea>
        </template>
        <template v-else>
          <template v-if="field.type === 'multiple'">
            <v-radio-group
              v-model="fields[`multiple_${field.id}`]"
              :rules="field.optional ? [] : [isRequired]"
            >
              <template v-for="(option, i) in field.options">
                <v-radio :label="option" :key="i" :value="option"></v-radio>
              </template>
            </v-radio-group>
          </template>
          <template v-else-if="field.type === 'checkbox'">
            <template v-for="(option, i) in field.options">
              <v-checkbox
                class="my-0 py-2"
                multiple
                v-model="fields[`checkbox_${field.id}`]"
                :label="option"
                :value="option"
                :key="i"
                hide-details
              ></v-checkbox>
            </template>
          </template>
          <template v-else>
            <v-select
              v-model="fields[`select_${field.id}`]"
              :rules="field.optional ? [] : [isRequired]"
              :items="field.options"
              :item-text="'text'"
              :item-value="'value'"
            ></v-select>
          </template>
        </template>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <slot name="recaptcha" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import lists from '~/utilities/ns/public/lists.js';
import forms from '~/utilities/ns/private/forms.js';
import { createNamespacedHelpers } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';

const { mapGetters, mapMutations } = createNamespacedHelpers('forms');

export default {
  name: 'FormUserApplication',

  props: {
    value: {
      type: Array,
    },

    form: {
      type: Object,
      default: () => {},
    },

    open: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      fields: null,
      description: null,

      isRequired: (v) => !!v || `Field is required.`,
    };
  },

  methods: {
    setContent(content) {
      if (content) {
        const fields = {};

        content.fields.forEach((field) => {
          Object.assign(fields, {
            [`${field.type}_${field.id}`]: field.type === 'checkbox' ? [] : '',
          });
        });

        this.fields = fields;
      }
    },
  },

  watch: {
    form: {
      immediate: true,
      deep: true,
      handler: function (v) {
        if (v) {
          this.setContent(v);
        } else {
          this.fields = null;
        }
      },
    },

    toSave: {
      deep: true,
      handler: function (v) {
        this.$emit('input', this.toSave);
      },
    },
  },

  computed: {
    toSave() {
      return this.fields
        ? Object.entries(this.fields).map(([key, value]) => {
            const id = parseInt(
              key.substr(key.indexOf('_') + 1, key.length - 1)
            );
            return { id, value };
          })
        : [];
    },
  },
};
</script>

<style scoped>
.required {
  color: red;
}
</style>
