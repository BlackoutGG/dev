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
          <v-btn text @click="$refs.role.setNewContent()">
            <v-icon left>mdi-plus</v-icon>
            <span>Add Role</span>
          </v-btn>
          <v-select
            :items="perPageOptions"
            :full-width="false"
            class="mx-2"
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
          :server-items-length="total"
          :items-per-page="limit"
          :items="roles"
          :headers="headers"
          :page.sync="page"
          :item-key="'id'"
        >
          <template #item.name="{ item }">
            <table-input
              :route="validate.roles"
              :id="item.id"
              :type="'name'"
              :value="item.name"
              :large="true"
            ></table-input>
          </template>
          <template #item.actions="{ item }">
            <div class="text-right">
              <table-actions
                @edit="$refs.role.setEditableContent(item.id)"
                @remove="setItemForRemoval(item.id)"
                edit
                remove
                :removeIcon="icon"
                :editIcon="editIcon"
                :name="validate.roles.name"
              ></table-actions>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <role-dialog ref="role"></role-dialog>
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
import _roles from '~/utilities/ns/private/roles.js';
import roles from '~/utilities/ns/public/roles.js';

import TableActions from '~/components/table/TableActions.vue';
import TableInput from '~/components/table/TableInput.vue';
import TableDeleteDialog from '~/components/table/TableDeleteDialog.vue';
import RoleDialog from './RoleDialog.vue';

import pagination from '~/mixins/pagination.js';
import itemManagement from '~/mixins/itemManagement.js';

const { mapGetters, mapActions, mapMutations } = createNamespacedHelpers(
  'roles'
);

export default {
  name: 'RoleTable',
  components: {
    TableActions,
    TableInput,
    TableDeleteDialog,
    RoleDialog,
  },

  mixins: [pagination(roles), itemManagement(roles)],

  data() {
    return {
      headers: [
        { text: 'name', align: 'start', value: 'name' },
        { text: '', sortable: false, align: 'end', value: 'actions' },
      ],

      icon: 'mdi-trash-can-outline',
      editIcon: 'mdi-pencil-outline',
      open: false,

      validate: {
        roles: {
          name: 'roles',
          value: 'name',
        },
      },
    };
  },
  methods: {
    /**
     * this.setSelected()
     */
    ...mapMutations([_roles.mutations.SET_SELECTED]),
    /**
     * this.editRole()
     */
    ...mapActions([_roles.actions.EDIT_ROLE, _roles.actions.REMOVE_ROLE]),
  },
  computed: {
    /**
     * this.roles,
     * this.selected
     * */
    ...mapGetters([
      _roles.getters.ROLES,
      // _roles.getters.SELECTED,
      _roles.getters.SELECTED_IDS,
    ]),
    // selectedItems: {
    //   get() {
    //     return this.selected;
    //   },
    //   set(value) {
    //     this.setSelected(value);
    //   },
    // },
  },
};
</script>

<style lang="scss">
#roles {
  .transparent {
    background: transparent;
  }
  tr {
    height: 60px;
  }
  .text-end {
    text-align: right;
  }
}
