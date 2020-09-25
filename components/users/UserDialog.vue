<template>
  <v-dialog id="user-dialog" v-model="show" :max-width="maxWidth" :min-width="minWidth">
    <template v-slot:activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on">
        <v-icon left>mdi-plus</v-icon>
        <span>Add User</span>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark>
        <v-toolbar-title>
          <span class="headline">{{title}}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon v-text="closeIcon" @click="clear"></v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-container>
            <v-row v-if="isEditMode">
              <v-col cols="12" class="text-center">
                <v-badge avatar bordered overlap>
                  <template v-slot:badge>
                    <v-avatar size="32">
                      <v-btn text>
                        <v-icon>mdi-image-edit-outline</v-icon>
                      </v-btn>
                    </v-avatar>
                  </template>
                  <v-avatar size="80" color="primary">
                    <img :src="avatar.url" alt v-if="avatar.url" />
                    <span class="white--text headline" v-else>{{initials}}</span>
                  </v-avatar>
                </v-badge>
              </v-col>
            </v-row>
            <v-row>
              <template v-for="(input, key) in inputs">
                <v-col cols="12" v-if="input.visible" :key="key">
                  <dialog-input
                    v-model="input.value"
                    :async="input.async"
                    :type="input.type"
                    :label="input.label"
                    :rules="input.rules"
                    :route="validate ? validate[key] : {}"
                    :is-shown="show"
                  />
                </v-col>
              </template>
              <v-col cols="12">
                <role-select v-model="roles"></role-select>
              </v-col>
            </v-row>
            <v-row align="center" v-if="isEditMode">
              <v-col cols="12">
                <v-btn color="primary">Reset Password</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="add" :disabled="!valid" v-if="!isEditMode">Save</v-btn>
        <v-btn text @click="edit" :disabled="!valid" v-else>Save</v-btn>
        <v-btn text @click="reset">Reset</v-btn>
      </v-card-actions>
      <v-overlay absolute v-model="isSending">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-card>
  </v-dialog>
</template>

<script>
import DialogInput from '~/components/dialogs/DialogInput.vue';
import RoleSelect from './UserRoleSelect.vue';
import users from '~/utilities/ns/private/users.js';
import { createNamespacedHelpers } from 'vuex';

import pick from 'lodash/pick';
import cloneDeep from 'lodash/cloneDeep';

const { mapGetters, mapActions } = createNamespacedHelpers('users');

export default {
  name: 'UserDialog',
  components: { DialogInput, RoleSelect },

  props: {
    title: {
      type: String,
      default: 'Create New User',
    },
  },

  data() {
    return {
      inputs: {
        username: {
          async: true,
          visible: true,
          label: 'Username',
          type: 'text',
          value: '',
        },
        email: {
          async: true,
          visible: true,
          label: 'Email',
          type: 'text',
          value: '',
        },
        password: {
          async: false,
          visible: true,
          label: 'Password',
          type: 'password',
          value: '',
          rules: [
            (v) => !!v || 'Password is required.',
            (v) => (v && v.length <= 50) || 'Password is too long.',
            (v) =>
              (v && v.length >= 8) ||
              'Password is too short. Must be equal to or greater than 8 characters.',
          ],
        },
      },

      avatar: {
        url: null,
        preview: null,
      },

      roles: [],
      valid: false,
      show: false,
      isSending: false,

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

      closeIcon: 'mdi-close',

      maxWidth: '600px',
      minWidth: '600px',

      /**
       * EDIT MODE
       */
      mode: 'add',
      id: null,
      startingRoles: null,
      startingDetails: null,
    };
  },

  watch: {
    show(v) {
      if (!v) {
        this.$emit('close');
        this.clear();
      } else {
        this.$emit('open');
      }
    },
  },

  methods: {
    ...mapActions([users.actions.ADD_USER, users.actions.EDIT_USER]),

    async setEditableContent(id) {
      this.mode = 'edit';
      this.show = true;
      this.id = id;

      const user = await this.getUser(id);
      const starting = cloneDeep(user);

      this.inputs.username.value = user.username;
      this.inputs.email.value = user.email;
      this.inputs.password.visible = false;
      this.roles = user.roles.map(({ id }) => id);

      this.avatar.url = user.avatar;

      this.startingDetails = pick(starting, ['username', 'email']);
      this.startingRoles = starting.roles.map(({ id }) => id);
    },

    async getUser(id) {
      this.isSending = true;
      try {
        const { user } = (await this.$axios.get(`/users/${id}`)).data;
        return user;
      } catch (err) {
        console.log(err);
      } finally {
        this.isSending = false;
      }
    },

    async add() {
      this.isSending = true;

      const data = Object.values(this.inputs).reduce((obj, o) => {
        const k = o.label.toLowerCase();
        obj[k] = o.value;
        return obj;
      }, {});

      if (this.roles && this.roles.length) {
        Object.assign(data, { roles: this.roles });
      }

      this.isSending = true;

      try {
        await this.addUser(data);
        this.show = false;
      } catch (err) {
        console.error(err);
      } finally {
        this.isSending = false;
      }
    },

    async edit() {
      const data = {};

      if (this.detailsToUpdate && Object.keys(this.detailsToUpdate).length) {
        Object.assign(data, { details: this.detailsToUpdate });
      }

      if (this.rolesToAdd && this.rolesToAdd.length) {
        Object.assign(data, { added: this.rolesToAdd });
      }

      if (this.rolesToRemove && this.rolesToRemove.length) {
        Object.assign(data, { remove: this.rolesToRemove });
      }

      this.isSending = true;

      try {
        await this.editUser({
          id: this.id,
          payload: data,
        });
        this.show = false;
      } catch (err) {
        console.log(err);
      } finally {
        this.isSending = false;
      }
    },

    // save() {
    //   this[!this.isEditMode ? 'add' : 'edit']();
    // },

    reset() {
      if (this.isEditMode) {
        const defaultValues = { ...this.startingDetails };
        const defaultRoles = cloneDeep(this.startingRoles);

        this.inputs.username.value = defaultValues.username;
        this.inputs.email.value = defaultValues.email;
        this.roles = defaultRoles;
      } else {
        this.inputs.username.value = '';
        this.inputs.email.value = '';
        this.inputs.password.value = '';
        this.roles = [];
      }
    },

    clear() {
      this.show = false;
      this.$nextTick(() =>
        setTimeout(() => {
          this.mode = 'add';
          this.$refs.form.reset();
          this.$refs.form.resetValidation();
          this.inputs.password.visible = true;
          this.roles = [];
          this.startingRoles = null;
          this.startingDetails = null;
          if (this.id) this.id = null;
        }, 50)
      );
    },
  },

  computed: {
    // ...mapGetters([users.getters.GET_USER]),

    isEditMode() {
      return this.mode === 'edit';
    },

    username() {
      return this.inputs.username.value;
    },

    initials() {
      const username = this.username ? this.username.match(/\b\w/g) : null;
      const initials = username
        ? ((username.shift() || '') + (username.pop() || '')).toUpperCase()
        : '';
      return initials;
    },

    detailsToUpdate() {
      const details = this.startingDetails
        ? Object.entries(this.startingDetails).reduce((output, [key, item]) => {
            if (item !== this.inputs[key].value) {
              output[key] = this.inputs[key].value;
            }
            return output;
          }, {})
        : null;

      return details;
    },

    rolesToAdd() {
      return this.roles.filter((item) => {
        return this.startingRoles.indexOf(item) === -1;
      });
    },

    rolesToRemove() {
      return this.startingRoles.filter((item) => {
        return this.roles.indexOf(item) === -1;
      });
    },
  },
};
</script>

