<template>
  <v-dialog id="role-dialog" v-model="show" :max-width="maxWidth">
    <v-card>
      <v-toolbar dark>
        <v-toolbar-title>{{name}}</v-toolbar-title>
        <v-btn small icon absolute right @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid">
          <v-container fluid>
            <v-row v-if="details">
              <v-col cols="12">
                <dialog-input
                  async
                  :route="validate"
                  :filled="false"
                  v-model="details.name"
                  label="Name"
                ></dialog-input>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="details.level"
                  :items="levelOptions"
                  :rules="[isRequired('Level')]"
                  label="Level"
                ></v-select>
              </v-col>
            </v-row>
            <v-row align="end">
              <v-col cols="6">
                <span>Permissions</span>
              </v-col>
              <v-col cols="6">
                <div class="d-flex">
                  <v-spacer></v-spacer>
                  <v-btn text small :disabled="isAllSelected" @click="addPermission">
                    <v-icon left v-text="icon"></v-icon>
                    <span>Add Permission</span>
                  </v-btn>
                </div>
              </v-col>
            </v-row>

            <role-permission
              v-for="(perm, idx) in permissions"
              :items="selected"
              :key="idx"
              :action.sync="perm.action"
              :resource.sync="perm.resource"
              @change="onChange($event, idx)"
              @remove="removePermission(idx)"
            ></role-permission>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="save" :disabled="!valid">Save</v-btn>
        <v-btn text>Reset</v-btn>
      </v-card-actions>
      <v-overlay absolute v-model="isSending">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-card>
  </v-dialog>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import DialogInput from '~/components/dialogs/DialogInput.vue';
import RolePermission from './RolePermission.vue';
import roles from '~/utilities/ns/public/roles.js';
import cloneDeep from 'lodash/cloneDeep';

const range = (start, end) => {
  if (start === end) return [start];
  return [start, ...range(start + 1, end)];
};

const defaultDetails = {
  name: '',
  level: '',
};

const { mapGetters, mapActions } = createNamespacedHelpers('roles');

export default {
  name: 'RoleDialog',
  components: { DialogInput, RolePermission },

  data() {
    return {
      id: null,

      maxWidth: '600px',

      icon: 'mdi-plus',
      confirmIcon: 'mdi-check',
      cancelIcon: 'mdi-close',

      details: null,
      startingDetails: null,

      permissions: [],
      selectable: [],
      levelOptions: [],
      startingPermissions: [],

      show: false,
      isSending: false,
      valid: false,

      editName: false,
      mode: 'new',

      validate: {
        name: 'roles',
        value: 'name',
      },

      isRequired: (fieldname) => (v) =>
        !!v || `${fieldname} field is required.`,
    };
  },

  watch: {
    show(v) {
      if (!v) {
        this.$emit('close');
        this.reset();
      } else {
        this.$emit('open');
      }
    },
  },

  methods: {
    addRole(payload) {
      this.$store
        .dispatch(roles.actions.ADD_ROLE, payload)
        .then(() => (this.show = false));
    },

    editRole(id, payload) {
      this.$store
        .dispatch(roles.actions.EDIT_ROLE, { id, payload })
        .then(() => (this.show = false));
    },

    addPermission() {
      this.permissions.push({
        id: null,
        action: '',
        resource: '',
      });
    },

    removePermission(idx) {
      this.permissions.splice(idx, 1);
    },

    onChange({ action, resource }, idx) {
      const match = this.selectable.find(
        (item) => item.action === action && item.resource === resource
      );

      if (match) {
        this.permissions[idx].id = match.id;
      } else {
        this.permissions[idx].id = null;
      }
    },

    async getPermissions() {
      this.isSending = true;

      try {
        const { permissions } = (await this.$axios.get('/permissions')).data;
        return permissions;
      } catch (err) {
        console.log(err);
      } finally {
        this.isSending = false;
      }
    },

    async getRole(id) {
      this.isSending = true;
      try {
        const data = (await this.$axios.get(`/admin/roles/${id}`)).data;
        return data;
      } catch (err) {
        console.log(err);
      } finally {
        this.isSending = false;
      }
    },

    save() {
      this[this.mode === 'new' ? 'create' : 'edit']();
    },

    create() {
      const data = {};

      if (this.details && Object.keys(this.details).length) {
        Object.assign(data, { details: this.details });
      }

      if (this.toAdd && this.toAdd.length) {
        Object.assign(data, { permissions: this.toAdd });
      }

      this.addRole(data);
    },

    edit() {
      const data = {};

      if (this.toUpdate && Object.keys(this.toUpdate).length) {
        Object.assign(data, { details: this.toUpdate });
      }

      if (this.toAdd && this.toAdd.length) {
        Object.assign(data, { added: this.toAdd });
      }

      if (this.toRemove && this.toRemove.length) {
        Object.assign(data, { remove: this.toRemove });
      }

      this.editRole(this.id, data);
    },

    async setNewContent() {
      this.mode = 'new';
      this.show = true;
      this.selectable = await this.getPermissions();
      this.levelOptions = range(this.$auth.user.level, 5);
      this.details = Object.assign({}, defaultDetails);
    },

    async setEditableContent(id) {
      this.id = id;
      this.mode = 'edit';
      this.show = true;

      const { role, selectable } = await this.getRole(id);
      const details = Object.assign({}, { name: role.name, level: role.level });

      this.details = details;
      this.startingDetails = { ...details };
      this.levelOptions = range(this.$auth.user.level, 5);

      this.permissions = role.permissions;
      this.startingPermissions = cloneDeep(role.permissions);

      this.selectable = selectable;
    },

    reset() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.permissions = [];
          this.selectable = [];
          this.startingPermissions = [];
          this.levelOptions = [];
          this.details = null;
          this.startingDetails = null;
          if (this.id) this.id = null;
        }, 10);
      });
    },
  },

  computed: {
    name() {
      return this.mode === 'new'
        ? 'Create A Role'
        : this.startingDetails
        ? `Edit Role: ${this.startingDetails.name}`
        : 'Placeholder';
    },

    isAllSelected() {
      return (
        this.selected.filter((item) => item.disable).length ===
        this.selectable.length
      );
    },

    selected() {
      return this.selectable && this.selectable.length
        ? this.selectable.map((item) => {
            const idx = this.permissions.findIndex((p) => p.id === item.id);
            if (idx !== -1) item.disable = true;
            else item.disable = false;
            return item;
          }, [])
        : [];
    },

    toUpdate() {
      return this.startingDetails
        ? Object.entries(this.details).reduce((output, [key, value]) => {
            if (this.startingDetails[key] !== value) {
              Object.assign(output, { [key]: value });
            }
            return output;
          }, {})
        : this.details;
    },

    toRemove() {
      return this.startingPermissions
        ? this.startingPermissions.reduce((output, item) => {
            const idx = this.permissions.findIndex((p) => p.id === item.id);
            if (idx === -1) output.push(item.id);
            return output;
          }, [])
        : [];
    },

    toAdd() {
      return this.permissions.reduce((output, item) => {
        const idx = this.startingPermissions.findIndex((p) => item.id === p.id);
        if (idx === -1 && item.id) output.push(item.id);
        return output;
      }, []);
    },
  },
};
</script>

<style lang="scss">
#role-dialog {
  position: relative;
}
</style>