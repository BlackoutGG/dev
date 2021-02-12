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
          <!-- <table-filter-options
            :filters="filterOptions"
            :name="name"
            @update="onUpdate"
            @reset="onReset"
          /> -->
          <v-btn text :disabled="!selectedItems.length" @click="open = true">
            <v-icon v-text="icon"></v-icon>
            <span>Delete {{ selectedItems.length }}</span>
          </v-btn>
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
          id="recruitment"
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
          <template v-slot:item.applicant.avatar="{ item }">
            <user-table-avatar
              :src="item.applicant.avatar"
              :username="item.applicant.username"
            ></user-table-avatar>
          </template>
          <template #item.category_name="{ item }">
            {{ item.category_name }}
          </template>
          <template #item.status="{ item }">
            <table-dialog-menu
              :async="false"
              :items="statusOptions"
              :id="item.id"
              :type="'status'"
              :value="item.status"
              @save="changeFormDetail"
            ></table-dialog-menu>
          </template>
          <template #item.actions="{ item }">
            <div class="text-right">
              <table-actions
                :actions="actions"
                :suffix="suffix"
                @view="$refs.recruit.viewForm(item.id)"
              ></table-actions>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <recruit-dialog v-model="showDialog" ref="recruit"></recruit-dialog>
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
// import _recruitment from '~/utilities/ns/private/recruitment.js';
// import recruitment from '~/utilities/ns/public/recruitment.js';
// import filter from '~/utilities/ns/public/filters.js';
// import lists from '~/utilities/ns/public/lists.js';

import _recruitment from './store/types/private.js';
import recruitment from './store/types/public.js';
import filter from '~/components/filters/store/types/public.js';
import lists from '~/components/table/store/types/public.js';

import pagination from '~/mixins/pagination.js';
import itemManagement from '~/mixins/itemManagement.js';

import TableActions from '~/components/table/TableActions.vue';
import TableDeleteDialog from '~/components/table/TableDeleteDialog.vue';
import TableFilterOptions from '~/components/filters/TableFilterOptions.vue';
import TableDialogMenu from '~/components/table/TableDialogMenu.vue';

import RecruitDialog from './RecruitDialog.vue';

const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers(
  'recruitment'
);

export default {
  name: 'RecruitmentTable',

  components: {
    TableActions,
    TableDeleteDialog,
    TableFilterOptions,
    TableDialogMenu,
    RecruitDialog,
  },

  mixins: [pagination(recruitment), itemManagement(recruitment)],

  data() {
    return {
      statusOptions: ['pending', 'accepted', 'rejected'],

      icon: 'mdi-trash-can-outline',
      name: 'recruitment',
      open: false,
      showDialog: false,

      suffix: 'forms',

      actions: [
        { icon: 'mdi-eye', scope: 'view', text: 'View' },
        { icon: 'mdi-delete', scope: 'delete', text: 'Remove' },
      ],
    };
  },

  methods: {
    /**
     * this.fetchForms()
     * this.setStatus()
     * this.changeFormDetail()
     * this.removeItems()
     */
    ...mapActions([
      _recruitment.actions.FETCH,
      _recruitment.actions.SET_STATUS,
      _recruitment.actions.CHANGE_FORM_DETAIL,
      _recruitment.actions.REMOVE_ITEMS,
    ]),

    onUpdate() {
      this.fetchForms(false);
    },

    onReset() {
      this.$store.commit(filter.mutations.RESET_FILTER, 'forms');
      this.fetchForms(false);
    },
  },

  computed: {
    /**
     * this.forms()
     * this.selectedIds()
     */
    ...mapGetters([
      _recruitment.getters.ITEMS,
      _recruitment.getters.SELECTED_IDS,
    ]),

    headers() {
      return [
        { text: '', align: 'start', value: 'applicant.avatar' },
        { text: 'applicant', align: 'start', value: 'applicant.username' },
        { text: 'category', sortable: true, value: 'category_name' },
        { text: 'status', sortable: true, value: 'status' },
        { text: 'created_at', sortable: true, value: 'created_at' },
        { text: 'updated_at', sortable: true, value: 'updated_at' },
        {
          text: this.$vuetify.breakpoint.smAndDown ? 'actions' : '',
          align: 'end',
          value: 'actions',
        },
      ];
    },

    categoryList() {
      return this.$store.getters[lists.getters.GET_ITEMS](
        'categories'
      ).map(({ id, name }) => ({ id, name }));
    },

    filterOptions() {
      return [
        {
          name: 'Categories',
          type: 'category_id',
          itemProp: 'id',
          multiple: true,
          children: this.categoryList,
        },
        { name: 'Status', type: 'status' },
      ];
    },
  },
};
</script>
<style lang="scss">
#recruitment {
  tr {
    height: 60px;
  }
  .text-end {
    text-align: right;
  }
}
</style>
