<template>
  <section id="profile">
    <v-container fluid class="pa-0">
      <v-img
        :src="src"
        eager
        :max-height="maxBannerHeight"
        :content-class="'profile-banner'"
      >
        <v-container>
          <v-list-item>
            <v-list-item-avatar :size="avatarSize">
              <user-avatar
                :size="avatarSize"
                :item="info"
                is-editable
              ></user-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <div class="text-md-h3 text sm-and-down h5 text-shadow">
                  {{ info.username }}
                </div>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-container>
        <div class="fill-height bottom-gradient"></div>
      </v-img>
    </v-container>
    <v-container>
      <v-card rounded class="mt-n16 mx-auto fill-height" elevation="2">
        <v-tabs v-model="tab" vertical icons-and-text>
          <v-tab>Personal <v-icon>mdi-account-details</v-icon></v-tab>
          <v-tab>Contact <v-icon>mdi-card-account-mail</v-icon></v-tab>
          <v-tab>Security <v-icon>mdi-security</v-icon></v-tab>

          <v-tab-item
            v-for="(inputs, k) in inputFields"
            :key="k"
            eager
            transition="fade-transition"
            @change="onChange"
          >
            <v-card flat>
              <v-card-title>{{
                k.charAt(0).toUpperCase() + k.slice(1)
              }}</v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="isValid">
                  <v-row>
                    <v-col
                      cols="12"
                      v-for="(input, key) in inputs"
                      :key="key"
                      :md="input.columns.md"
                    >
                      <input-field
                        v-model="input.value"
                        :item="input"
                        :show.sync="input.show"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="submit" :disabled="isDisabled"
                  >Submit</v-btn
                >
                <v-btn text @click="reset">Reset</v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-container>
    <media-dialog
      v-model="showMediaDialog"
      v-bind="mediaOptions"
    ></media-dialog>
  </section>
</template>

<script>
import UserAvatar from '~/components/avatar/ListAvatar.vue';
import MediaDialog from '~/components/media/MediaDialog.vue';
import InputField from '~/components/core/Field.vue';
import validators from '~/utilities/validators';
import cloneDeep from 'lodash/cloneDeep';
import snakeCase from 'lodash/snakeCase';
import camelCase from 'lodash/camelCase';

const { isRequired, isEmail, isAlphanumeric, compare } = validators;

export default {
  name: 'UserProfilePage',

  // transition: {
  //   name: 'fade',
  //   mode: 'in-out',
  // },

  components: { UserAvatar, MediaDialog, InputField },

  middleware: [
    ({ $auth, redirect }) => {
      if (!$auth.loggedIn) redirect('/');
    },
  ],

  async asyncData(ctx) {
    const info = (await ctx.$axios.get('/users/me')).data;

    return {
      info,
    };
  },

  async mounted() {
    this.assignInitalValuesToFields(cloneDeep(this.info));
  },

  data() {
    return {
      info: null,
      valid: {
        personal: false,
        contact: false,
        security: false,
      },

      maxBannerHeight: 400,
      avatarSize: 120,

      mediaOptions: {
        fileSize: 72000,
        single: true,
        fullscreen: true,
      },

      tab: 0,
      tabs: ['personal', 'contact', 'security'],

      showMediaDialog: false,

      src:
        'https://images.ctfassets.net/j95d1p8hsuun/1ShvIkEIe3cvb5qKSguLdC/9bbac0c4239985ca540650ec240d765b/HOME_USP1_FightTheWorld_CPB-L-1920x720.jpg',

      inputFields: {
        personal: {
          firstName: {
            label: 'First name',
            type: 'text',
            value: '',
            columns: {
              md: 6,
            },
            validators: [isAlphanumeric('First name')],
          },
          lastName: {
            label: 'Last name',
            type: 'text',
            value: '',
            columns: {
              md: 6,
            },
            validators: [isAlphanumeric('Last name')],
          },
          location: {
            label: 'Location',
            type: 'text',
            value: '',
            columns: {
              md: 6,
            },
            validators: [isAlphanumeric('Location')],
          },
          birthday: {
            label: 'Birthday',
            type: 'birthday',
            value: '',
            columns: {
              md: 3,
            },
            validators: [],
          },
          gender: {
            label: 'Gender',
            type: 'select',
            value: '',
            columns: {
              md: 3,
            },
            items: ['Male', 'Female', 'Other'],
            validators: [],
          },
          description: {
            label: 'Description',
            type: 'textarea',
            value: '',
            columns: {
              md: 6,
            },
            validators: [],
          },
        },
        contact: {
          email: {
            label: 'Email',
            type: 'text',
            value: '',
            columns: {
              md: 6,
            },
            validators: [isRequired('Email'), isEmail('Email')],
          },
          confirmEmail: {
            label: 'Confirm Email',
            type: 'text',
            value: '',
            columns: {
              md: 6,
            },
            validators: [
              isEmail('Confirm email'),

              (v) =>
                (v && v === this.inputFields.email.value) ||
                `Fields must match.`,
            ],
          },
          password: {
            label: 'Enter password',
            type: 'password',
            show: false,
            value: '',
            columns: {
              md: 6,
            },
            validators: [isRequired('Old password')],
          },
        },
        security: {
          password: {
            label: 'Old password',
            type: 'password',
            show: false,
            value: '',
            columns: {
              md: 6,
            },
            validators: [isRequired('Old password')],
          },
          newPassword: {
            label: 'New password',
            type: 'password',
            show: false,
            value: '',
            columns: {
              md: 6,
            },
            validators: [isRequired('New password')],
          },
        },
      },
    };
  },
  methods: {
    onChange() {
      // this.$refs.form.resetValidation();
      this.valid = false;
    },

    reset() {
      this.inputFields[this.tabs[this.tab]].forEach(
        (input) => (input.value = '')
      );
    },

    assignInitalValuesToFields(item) {
      this.inputFields.personal.firstName.value = item.first_name;
      this.inputFields.personal.lastName.value = item.last_name;
      this.inputFields.personal.location.value = item.location;
      this.inputFields.personal.birthday.value = new Date(item.birthday)
        .toISOString()
        .substr(0, 10);
      this.inputFields.personal.gender.value = item.gender;
      this.inputFields.personal.description.value = item.description;
      this.inputFields.contact.email.value = item.email;
    },

    async submit() {
      const tabs = ['personal', 'contact', 'securtiy'];

      const fields = this.inputFields[tabs[this.tab]];
      const payload = Object.entries(fields).reduce((output, [key, item]) => {
        const k = snakeCase(key);
        if (item.value !== this.info[k]) output[snakeCase(k)] = item.value;
        return output;
      }, {});

      try {
        const results = (
          await this.$axios.patch(`/users/update/personal`, payload)
        ).data;

        Object.entries(results).forEach(([key, value]) => {
          this.info[key] = value;
        });

        this.$toast.show('Saved changes.', {
          position: 'top-center',
          icon: 'check',
        });
      } catch (err) {
        console.log(err);
      }
    },
  },

  computed: {
    isDisabled() {
      const tab = this.tabs[this.tab];
      const fields = this.inputFields[tab];
      const hasChanged = Object.entries(fields).some(
        ([key, item]) => item.value && item.value !== this.info[snakeCase(key)]
      );

      return hasChanged && this.valid[tab];
    },

    isValid: {
      get() {
        const tab = this.tabs[this.tab];
        return this.valid[tab];
      },
      set(val) {
        const tab = this.tabs[this.tab];
        this.valid[tab] = val;
      },
    },
  },
};
</script>

<style lang="scss">
// .profile-banner {
//   background-image: url('https://images.ctfassets.net/j95d1p8hsuun/1ShvIkEIe3cvb5qKSguLdC/9bbac0c4239985ca540650ec240d765b/HOME_USP1_FightTheWorld_CPB-L-1920x720.jpg');
//   height: 500px;
//   width: 100%;
//   object-fit: cover;
//   &:after {
//     position: absolute;
//     top: 0;
//     width: 100%;
//     height: 100%;
//     background: linear-gradient(
//       to bottom,
//       rgba(255, 255, 255, 0) 0%,
//       rgba(255, 255, 255, 1) 80%
//     );
//   }
// }

.profile-banner {
  display: flex;
  align-items: center;
}

.bottom-gradient {
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.4) 0%,
    transparent 72px
  );
}
</style>
