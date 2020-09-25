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
          <v-btn text :disabled="!selectedItems.length" @click="open = true">
            <v-icon v-text="icon"></v-icon>
            <span>Delete {{ selectedItems.length }}</span>
          </v-btn>
          <table-add-item
            v-model="itemName"
            :route="validateName"
            :name="$route.params.type"
            @save="save(itemName)"
          ></table-add-item>
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
          class="elevation-1"
          v-model="selectedItems"
          hide-default-footer
          :items="items"
          :headers="headers"
          :server-items-length="total"
          :item-key="'id'"
        >
          <template #item.name="{ item }">
            <table-input
              :value="item.name"
              :route="validateName"
              :id="item.id"
              :large="false"
            ></table-input>
          </template>
          <template #item.recruitment="{ item }" v-if="isCategories">
            <table-recruitment-switch :item="item"></table-recruitment-switch>
          </template>
          <template #item.actions="{ item }">
            <table-actions
              remove
              :removeIcon="icon"
              :name="$route.params.type"
              @remove="setItemForRemoval(item.id)"
            ></table-actions>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <table-delete-dialog
      v-model="open"
      :length="selectedItems.length"
      @deleteAll="onDelete"
      @cancel="onCancel"
    ></table-delete-dialog>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import lists from '~/utilities/ns/public/lists.js';
import snackbar from '~/utilities/ns/public/snackbar.js';
import _lists from '~/utilities/ns/private/lists.js';

import pagination from '~/mixins/pagination.js';
import itemManagement from '~/mixins/itemManagement.js';

import TableDeleteDialog from './TableDeleteDialog.vue';
import TableActions from './TableActions.vue';
import TableInput from './TableInput.vue';
import TableAddItem from './TableAddItem.vue';
import TableRecruitmentSwitch from './TableRecruitmentSwitch.vue';

const { mapGetters, mapActions, mapMutations } = createNamespacedHelpers(
  'lists'
);

export default {
  name: 'ListTable',

  components: {
    TableDeleteDialog,
    TableActions,
    TableInput,
    TableAddItem,
    TableRecruitmentSwitch,
  },

  mixins: [pagination(lists), itemManagement(lists)],

  data() {
    return {
      icon: 'mdi-trash-can-outline',
      open: false,
      itemName: '',
    };
  },

  methods: {
    ...mapActions([_lists.actions.REMOVE_ITEMS, _lists.actions.ADD_ITEM]),

    async save(name) {
      try {
        await this.addItem(name);
        this.$store.dispatch(snackbar.actions.TOGGLE_BAR, {
          text: `Successfully saved: ${name}`,
        });
        this.itemName = '';
      } catch (err) {
        console.log(err);
        this.$store.dispatch(snackbar.actions.TOGGLE_BAR, {
          text: err,
        });
      }
    },
  },

  computed: {
    isCategories() {
      return this.$route.params.type === 'categories';
    },

    validateName() {
      return {
        name: this.$route.params.type,
        value: 'name',
      };
    },

    /**
     * this.getItems()
     * this.type,
     * this.selectedIds
     */

    ...mapGetters([
      _lists.getters.GET_ITEMS,
      _lists.getters.TYPE,
      _lists.getters.SELECTED_IDS,
    ]),

    items() {
      return this.getItems(this.type);
    },

    headers() {
      const headers =
        this.items && this.items.length
          ? Object.keys(this.items[0]).flatMap((key) => {
              if (key === 'id') return [];
              return [
                {
                  text: key,
                  sortable: true,
                  value: key,
                },
              ];
            })
          : [];

      headers.push({ text: '', align: 'end', value: 'actions' });

      return headers;
    },
  },
};
</script>
