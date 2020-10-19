<template>
  <section id="user-table">
    <v-container fluid>
      <v-row>
        <v-col md="6" sm="12">
          <div class="d-flex align-center">
            <v-pagination v-model="page" :length="pageCount"></v-pagination>
          </div>
        </v-col>
        <v-col md="6" sm="12">
          <div class="d-flex align-center">
            <table-filter-options
              :filters="filters"
              :name="name"
              @update="onUpdate"
              @reset="onReset"
            ></table-filter-options>
            <v-btn text :disabled="!selectedItems.length" @click="open = true">
              <v-icon v-text="icon"></v-icon>
              <span>Delete {{ selectedItems.length }}</span>
            </v-btn>
            <user-dialog
              ref="userDialog"
              @edit-profile-image="openMedia"
            ></user-dialog>
            <v-select
              :items="perPageOptions"
              v-model="limit"
              class="mx-2"
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
            id="users"
            show-select
            class="elevation-1"
            v-model="selectedItems"
            hide-default-footer
            :server-items-length="total"
            :items-per-page="limit"
            :items="users"
            :headers="headers"
            :item-key="'id'"
          >
            <template v-slot:item.username="{ item }">
              <table-dialog-menu
                :route="validate.username"
                :id="item.id"
                :type="'username'"
                :value="item.username"
                @save="changeUserInfo"
              ></table-dialog-menu>
            </template>
            <template v-slot:item.email="{ item }">
              <table-dialog-menu
                :route="validate.email"
                :id="item.id"
                :type="'email'"
                :value="item.email"
                @save="changeUserInfo"
              ></table-dialog-menu>
            </template>
            <template v-slot:item.avatar="{ item }">
              <user-table-avatar
                :src="item.avatar"
                :username="item.username"
              ></user-table-avatar>
            </template>
            <template v-slot:item.roles="{ item }">
              <user-table-roles
                :userId="item.id"
                :roles="item.roles"
              ></user-table-roles>
            </template>
            <template v-slot:item.actions="{ item }">
              <table-actions
                @edit="$refs.userDialog.setEditableContent(item.id)"
                @remove="setItemForRemoval(item.id)"
                :actions="actions"
                :suffix="name"
              ></table-actions>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
    <media-dialog
      v-model="openMediaDialog"
      single
      header
      fullscreen
      :title="'Select a profile avatar'"
      :fileSize="700000"
      @setImage="$refs.userDialog.setAvatar($event)"
    ></media-dialog>
    <table-delete-dialog
      v-model="open"
      :length="selectedItems.length"
      :single="single"
      @deleteAll="onDelete"
      @cancel="onCancel"
    ></table-delete-dialog>
  </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import users from '~/utilities/ns/public/users.js';
import _users from '~/utilities/ns/private/users.js';
import roles from '~/utilities/ns/public/roles.js';

import pagination from '~/mixins/pagination.js';
import itemManagement from '~/mixins/itemManagement.js';
import filters from '~/mixins/filters.js';

import TableInput from '~/components/table/TableInput.vue';
import TableActions from '~/components/table/TableActions.vue';
import TableFilterOptions from '~/components/table/TableFilterOptions.vue';
import TableDeleteDialog from '~/components/table/TableDeleteDialog.vue';
import TableDialogMenu from '~/components/table/TableDialogMenu.vue';

import UserDialog from './UserDialog.vue';
import UserTableAvatar from './UserTableAvatar.vue';
import UserTableRoles from './UserRoles.vue';

import MediaDialog from '~/components/media/MediaDialog.vue';

const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers(
  'users'
);

export default {
  name: 'UserTable',

  components: {
    UserTableAvatar,
    UserTableRoles,
    UserDialog,
    TableFilterOptions,
    TableInput,
    TableActions,
    TableDeleteDialog,
    TableDialogMenu,
    MediaDialog,
  },

  mixins: [pagination(users), itemManagement(users), filters(users, 'users')],

  data() {
    return {
      headers: [
        { text: '', sortable: false, value: 'avatar' },
        { text: 'username', sortable: true, value: 'username' },
        { text: 'email', sortable: true, value: 'email' },
        { text: 'roles', sortable: false, value: 'roles' },
        { text: 'joined_on', sortable: true, value: 'created_at' },
        { text: '', sortable: false, value: 'actions', align: 'end' },
      ],

      name: 'users',
      icon: 'mdi-trash-can-outline',

      open: false,
      openMediaDialog: false,

      actions: [
        { icon: 'mdi-pencil', scope: 'update', text: 'Edit' },
        { icon: 'mdi-lock-reset', scope: 'update', text: 'Reset' },
        { icon: 'mdi-delete', scope: 'delete', text: 'Remove' },
      ],

      validate: {
        username: {
          name: 'users',
          value: 'username',
        },
        email: {
          name: 'users',
          value: 'email',
        },
      },
    };
  },

  methods: {
    /**
     * changeUserInfo()
     */
    ...mapActions([_users.actions.CHANGE_USER_INFO]),

    openMedia() {
      console.log('triggering...');
      this.openMediaDialog = true;
    },
  },

  computed: {
    /**
     * this.users,
     * this.selectedIds
     */
    ...mapGetters([_users.getters.USERS, _users.getters.SELECTED_IDS]),

    isRolesPopulated() {
      return this.$store.getters[roles.getters.ROLES].length;
    },

    filters() {
      const children = this.$store.getters[
        roles.getters.ROLES
      ].map(({ name, id }) => ({ id, name }));

      const filters = {
        name: 'Roles',
        type: 'id',
        itemProp: 'id',
        multiple: true,
        children,
      };

      return [filters];
    },
  },
};
</script>

<style lang="scss">
#users {
  tr {
    height: 60px;
  }
  .text-end {
    text-align: right;
  }
}
</style>
