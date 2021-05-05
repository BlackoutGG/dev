<template>
  <v-container fluid>
    <v-row>
      <v-col md="6" sm="12">
        <div class="d-flex align-center">
          <v-pagination v-model="page" :length="pageCount"></v-pagination>
        </div>
      </v-col>
      <v-col md="6" sm="12">
        <div class="d-flex align-center">
          <v-spacer></v-spacer>
          <table-filter-options
            :filters="filterOptions"
            :name="name"
            @update="onUpdate"
            @reset="onReset"
            footer
          />
          <v-btn text :disabled="!selectedItems.length" @click="open = true">
            <v-icon v-text="icon"></v-icon>
            <span>Delete {{ selectedItems.length }}</span>
          </v-btn>
          <form-dialog ref="dialog" v-if="hasPermissions"></form-dialog>
          <v-select
            :items="perPageOptions"
            :full-width="false"
            v-model="limit"
            hide-details
            outlined
            dense
            label="Show Per Page"
          ></v-select>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          show-select
          v-model="selectedItems"
          hide-default-footer
          :server-items-length="total"
          :items-per-page="limit"
          :items="items"
          :headers="headers"
          :page.sync="page"
          :item-key="'id'"
        >
          <template #item.name="{ item }">
            <table-dialog-menu
              :route="validate.name"
              :id="item.id"
              :type="'name'"
              :value="item.name"
              @save="changeFormDetail"
            ></table-dialog-menu>
          </template>
          <template #item.category_id="{ item }">
            <table-dialog-menu
              :async="false"
              :items="categoryList"
              :id="item.id"
              :item-text="'name'"
              :item-value="'id'"
              :type="'category_id'"
              :value="item.category_id"
              @save="changeFormDetail"
            ></table-dialog-menu>
          </template>
          <template #item.status="{ item }">
            <v-btn icon @click.native="setStatus(item)">
              <v-icon v-if="item.status">mdi-check-bold</v-icon>
              <v-icon v-else>mdi-close-thick</v-icon>
            </v-btn>
          </template>
          <template #item.actions="{ item }">
            <div class="text-right">
              <table-actions
                @edit="$refs.dialog.setEditableContent(item.id)"
                @remove="setItemForRemoval(item.id)"
                :actions="actions"
                :suffix="name"
              ></table-actions>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <table-delete-dialog
      v-model="open"
      :length="selectedItems.length"
      :single="single"
      @deleteAll="onDelete"
      @cancel="onCancel"
    ></table-delete-dialog>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import _forms from '~/constants/forms/private.js';
import forms from '~/constants/forms/public.js';
import filters from '~/constants/filters/public.js';
import table from '~/constants/table/public.js';

import pagination from '~/mixins/pagination.js';
import itemManagement from '~/mixins/itemManagement.js';

const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers(
  'forms'
);

import FormDialog from './FormDialog.vue';
import TableActions from '~/components/controls/Actions.vue';
import TableDeleteDialog from '~/components/table/TableDeleteDialog.vue';
import TableFilterOptions from '~/components/table/TableFilterOptions.vue';
import TableDialogMenu from '~/components/table/TableDialogMenu.vue';

export default {
  name: 'FormTemplateTable',

  components: {
    FormDialog,
    TableActions,
    TableDeleteDialog,
    TableFilterOptions,
    TableDialogMenu,
  },

  mixins: [pagination(forms), itemManagement(forms)],

  data() {
    return {
      headers: [
        { text: 'name', align: 'start', value: 'name' },
        { text: 'category', sortable: true, value: 'category_id' },
        { text: 'status', sortable: true, value: 'status' },
        { text: 'created_at', sortable: true, value: 'created_at' },
        { text: 'updated_at', sortable: true, value: 'updated_at' },
        { text: '', align: 'end', value: 'actions' },
      ],

      icon: 'mdi-trash-can-outline',
      name: 'forms',
      open: false,

      actions: [
        {
          icon: 'mdi-pencil',
          scope: [
            [this.$permissions.UPDATE_ALL_FORMS],
            [this.$permissions.UPDATE_OWN_FORMS],
          ],
          text: 'Edit',
        },
        {
          icon: 'mdi-delete',
          scope: [
            [this.$permissions.REMOVE_ALL_FORMS],
            [this.$permissions.REMOVE_OWN_FORMS],
          ],
          text: 'Remove',
        },
      ],

      validate: {
        name: {
          name: 'forms',
          value: 'name',
        },
      },
    };
  },

  methods: {
    /**
     * this.fetchForms()
     * this.setStatus()
     * this.changeFormDetail()
     * this.removeItems()
     */

    ...mapMutations(['setSelected']),

    ...mapActions([
      _forms.actions.FETCH,
      _forms.actions.SET_STATUS,
      _forms.actions.CHANGE_FORM_DETAIL,
      _forms.actions.REMOVE_ITEMS,
    ]),

    onUpdate() {
      this.setSelected([]);
      this.fetchForms(false);
    },

    onReset() {
      this.setSelected([]);
      this.$store.commit(filter.mutations.RESET_FILTER, 'forms');
      this.fetchForms(false);
    },
  },

  computed: {
    /**
     * this.items()
     * this.selectedIds()
     */
    ...mapGetters([_forms.getters.ITEMS, _forms.getters.SELECTED_IDS]),

    hasPermissions() {
      return this.$auth.hasScope([
        [this.$permissions.ADD_ALL_FORMS],
        [this.$permissions.UPDATE_ALL_FORMS],
        [this.$permissions.UPDATE_OWN_FORMS],
      ]);
    },

    categoryList() {
      return this.$store.getters[table.getters.GET_ITEMS](
        'categories'
      ).map(({ id, name }) => ({ id, name }));
    },

    filterOptions() {
      const categories = {
        name: 'Categories',
        type: 'category_id',
        itemProp: 'id',
        multiple: true,
        children: this.categoryList,
      };

      return [categories, { name: 'Status', type: 'status' }];
    },
  },
};
</script>
