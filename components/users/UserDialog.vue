<template>
  <v-dialog v-model="show" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on">
        <v-icon left>mdi-plus</v-icon>
        <span>Add User</span>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{title}}</span>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-container>
            <v-row>
              <v-col cols="12" v-for="(input, key) in inputs" :type="input.type" :key="key">
                <dialog-input
                  v-model="input.value"
                  :async="input.async"
                  :type="input.type"
                  :label="input.label"
                  :rules="input.rules"
                  :route="validate ? validate[key] : {}"
                />
              </v-col>
              <v-col cols="12">
                <role-select v-model="roles"></role-select>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="save" :disabled="!valid">Save</v-btn>
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
  name: 'CreateUserDialog',
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
          label: 'Username',
          type: 'text',
          value: '',
        },
        email: {
          async: true,
          label: 'Email',
          type: 'text',
          value: '',
        },
        password: {
          async: false,
          label: 'Password',
          type: 'text',
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
    ...mapActions([users.actions.ADD_USER, user.actions.EDIT_USER]),

    setEditableContent(id) {
      const user = this.getUser(id);
      const starting = cloneDeep(user);

      this.mode = 'edit';
      this.show = true;
      this.id = id;

      this.inputs.username.value = user.username;
      this.inputs.email.value = user.email;
      this.roles = user.roles.map(({ id }) => id);

      this.startingDetails = pick(starting, ['username', 'email']);
      this.startingRoles = starting.roles.map(({ id }) => id);
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
        Object.assign(data, { remove: this.rolesToAdd });
      }

      try {
        await this.editRole({
          id: this.id,
          payload: data,
        });
        this.show = false;
      } catch (err) {
        console.log(err);
      }
    },

    save() {
      this[this.mode === 'add' ? 'add' : 'edit']();
    },

    reset() {
      const defaultValues = { ...this.startingDetails };
      const defaultRoles = cloneDeep(this.startingRoles);
      this.inputs.username.value = defaultValues.username;
      this.inputs.email.value = defaultValues.email;
      this.roles = defaultRoles;
    },

    clear() {
      this.show = false;
      this.$nextTick(() =>
        setTimeout(() => {
          this.mode = 'add';
          this.$refs.form.reset();
          this.$refs.form.resetValidation();
          this.roles = [];
          this.startingRoles = null;
          this.startingDetails = null;
          if (this.id) this.id = null;
        }, 50)
      );
    },
  },

  computed: {
    ...mapGetters([users.getters.GET_USER]),

    detailsToUpdate() {
      const details =
        this.startingDetails && this.startingDetails.length
          ? Object.entries(this.inputs).reduce((output, [key, item]) => {
              if (this.startingDetails[key] !== item[key].value) {
                Object.assign(output, { [key]: value });
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
      return this.startingValues.filter((item) => {
        return this.roles.indexOf(item) === -1;
      });
    },
  },
};
</script>