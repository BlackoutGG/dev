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
              @reset="resetFilters"
            ></table-filter-options>
            <v-btn text :disabled="!selectedItems.length" @click="open = true">
              <v-icon v-text="icon"></v-icon>
              <span>Delete {{ selectedItems.length }}</span>
            </v-btn>
            <user-dialog @open="setRoles" ref="userDialog"></user-dialog>
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
            :page.sync="page"
            :item-key="'id'"
          >
            <template v-slot:item.username="{ item }">
              <table-input
                :route="validate.username"
                :id="item.id"
                :value="item.username"
                :large="true"
                @save="changeUserInfo"
              ></table-input>
            </template>
            <template v-slot:item.email="{ item }">
              <table-input
                :route="validate.email"
                :id="item.id"
                :type="'email'"
                :value="item.email"
                :large="true"
                @save="changeUserInfo"
              ></table-input>
            </template>
            <template v-slot:item.avatar="{ item }">
              <user-table-avatar :item="item"></user-table-avatar>
            </template>
            <template v-slot:item.roles="{ item }">
              <user-table-roles :userId="item.id" :roles="item.roles"></user-table-roles>
            </template>
            <template v-slot:item.actions="{ item }">
              <table-actions
                @edit="$refs.userDialog.setEditableContent(item.id)"
                @remove="setItemForRemoval(item.id)"
                :item="item"
                :name="name"
                edit
                reset
                remove
              ></table-actions>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
    <table-delete-dialog
      v-model="open"
      :length="selectedItems.length"
      :single="single"
      @deleteAll="onDelete"
      @cancel="onCancel"
    ></table-delete-dialog>
    <!-- <edit-dialog ref="edit" @open="setRoles"></edit-dialog> -->
  </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import users from '~/utilities/ns/public/users.js';
import _users from '~/utilities/ns/private/users.js';
import roles from '~/utilities/ns/public/roles.js';
import pagination from '~/mixins/pagination.js';
import itemManagement from '~/mixins/itemManagement.js';
import UserTableAvatar from './UserTableAvatar.vue';
import UserTableRoles from './UserRoles.vue';
import TableInput from '~/components/table/TableInput.vue';
import TableActions from '~/components/table/TableActions.vue';
import TableFilterOptions from '~/components/table/TableFilterOptions.vue';
import TableDeleteDialog from '~/components/table/TableDeleteDialog.vue';
import UserDialog from './UserDialog.vue';
import EditDialog from './EditUserDialog.vue';
const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers(
  'users'
);
export default {
  name: 'UserTable',
  components: {
    UserTableAvatar,
    UserTableRoles,
    TableFilterOptions,
    TableInput,
    TableActions,
    TableDeleteDialog,
    UserDialog,
    EditDialog,
  },
  mixins: [pagination(users), itemManagement(users)],
  data() {
    return {
      dialog: 'create',
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
     * setSelected()
     */
    ...mapMutations([_users.mutations.SET_SELECTED]),
    /**
     * changeUserInfo()
     * removeUser()
     */
    ...mapActions([
      _users.actions.CHANGE_USER_INFO,
      _users.actions.REMOVE_USER,
    ]),
    setRoles() {
      if (this.isRolesPopulated) return;
      this.$store.dispatch(roles.actions.FETCH, false);
    },
    onUpdate() {
      this.fetch(false);
    },
    resetFilters() {
      this.$store.commit(filter.mutations.RESET_FILTER, 'forms');
      this.fetch(false);
    },
  },
  computed: {
    /**
     * this.users,
     * this.selected
     */
    ...mapGetters([_users.getters.USERS, _users.getters.SELECTED_IDS]),

    isRolesPopulated() {
      return this.$store.getters[roles.getters.ROLES].length;
    },

    filters() {
      const children = this.$store.getters[
        roles.getters.ROLES
      ].map(({ name, id }) => ({ id, name }));

      return [
        {
          name: 'Roles',
          type: 'roles.id',
          multiple: true,
          itemProp: 'id',
          children,
        },
      ];
    },
    selectedItems: {
      get() {
        return this.selected;
      },
      set(value) {
        this.setSelected(value);
      },
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