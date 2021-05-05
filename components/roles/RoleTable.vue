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
          <v-btn text @click="$refs.role.setNewContent()" v-if="$auth.hasScope($permissions.ADD_ALL_ROLES)">
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
          :items="items"
          :headers="headers"
          :page.sync="page"
          :item-key="'id'"
        >
          <template #item.name="{ item }">
            <table-dialog-menu
              :route="validate.roles"
              :id="item.id"
              :type="'name'"
              :value="item.name"
              @save="changeRoleDetail"
            ></table-dialog-menu>
          </template>
          <template #item.level="{ item }">
            <table-dialog-menu
              :async="false"
              :id="item.id"
              :type="'level'"
              :items="levelOptions"
              :value="item.level"
              @save="changeRoleDetail"
            ></table-dialog-menu>
          </template>
          <template #item.actions="{ item }">
            <div class="text-right">
              <table-actions
                @edit="$refs.role.setEditableContent(item.id)"
                @remove="setItemForRemoval(item.id)"
                :actions="actions"
                :suffix="validate.roles.name"
              ></table-actions>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <role-dialog ref="role"></role-dialog>
    <table-delete-dialog
      v-model="open"
      :single="single"
      :length="selectedItems.length"
      @deleteAll="onDelete"
      @cancel="onCancel"
    ></table-delete-dialog>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import _roles from '~/constants/roles/private.js';
import roles from '~/constants/roles/public.js';

import TableActions from '~/components/controls/Actions.vue';
import TableInput from '~/components/table/TableInput.vue';
import TableDeleteDialog from '~/components/table/TableDeleteDialog.vue';
import TableDialogMenu from '~/components/table/TableDialogMenu.vue';
import RoleDialog from './RoleDialog.vue';

import pagination from '~/mixins/pagination.js';
import itemManagement from '~/mixins/itemManagement.js';

const range = (start, end) => {
  if (start === end) return [start];
  return [start, ...range(start + 1, end)];
};

const { mapGetters, mapActions, mapMutations } = createNamespacedHelpers(
  'roles'
);

export default {
  name: 'RoleTable',
  components: {
    TableActions,
    TableInput,
    TableDeleteDialog,
    TableDialogMenu,
    RoleDialog,
  },

  mixins: [pagination(roles), itemManagement(roles)],

  data() {
    return {
      headers: [
        { text: 'NAME', align: 'start', value: 'name' },
        { text: 'LEVEL', align: 'start', value: 'level' },
        { text: 'CREATED AT', align: 'start', value: 'created_at' },
        { text: 'UPDATED AT', align: 'start', value: 'updated_at' },
        { text: '', sortable: false, align: 'end', value: 'actions' },
      ],

      icon: 'mdi-trash-can-outline',
      editIcon: 'mdi-pencil-outline',
      open: false,

      suffix: 'roles',

      // actions: [
      //   { icon: 'mdi-pencil', scope: 'update', target: 'all', text: 'Edit' },
      //   { icon: 'mdi-delete', scope: 'delete', target: 'all', text: 'Remove' },
      // ],

      actions: [
        { icon: 'mdi-pencil', scope: [this.$permissions.UPDATE_ALL_ROLES], text: 'Edit' },
        { icon: 'mdi-delete', scope: [this.$permissions.REMOVE_ALL_ROLES], text: 'Remove' },
      ],

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
     * this.editRole()
     * this.changeRoleDetail()
     */
    ...mapActions([
      _roles.actions.EDIT_ROLE,
      _roles.actions.CHANGE_ROLE_DETAIL,
    ]),
  },
  computed: {
    levelOptions() {
      return range(this.$auth.user.level, 5);
    },
    /**
     * this.items,
     * this.selected
     * */
    ...mapGetters([
      _roles.getters.ITEMS,
      // _roles.getters.SELECTED,
      _roles.getters.SELECTED_IDS,
    ]),
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
