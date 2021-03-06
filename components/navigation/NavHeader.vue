<template>
  <nav>
    <v-toolbar dark flat :color="color" height="80px">
      <v-container>
        <v-row justify="center" align="center" class="flex-nowrap">
          <v-app-bar-nav-icon
            class="hidden-md-and-up"
            @click="showMobile = true"
          ></v-app-bar-nav-icon>
          <v-spacer class="hidden-md-and-up"></v-spacer>
          <v-toolbar-title class>
            <img
              class="pt-2"
              src="https://blackout-gaming.s3.amazonaws.com/Images/assets/white-transparent.webp"
              height="72px"
              alt
            />
          </v-toolbar-title>
          <v-tabs
            :height="'80px'"
            align-with-title
            v-model="tab"
            class="hidden-sm-and-down"
          >
            <v-tab
              v-for="(link, idx) in links"
              nuxt
              :key="idx"
              :to="link.to"
              :class="{ 'ml-4': idx === 0 }"
              >{{ link.title }}</v-tab
            >
            <v-tab
              v-if="$auth.loggedIn && $auth.hasScope('view:events')"
              nuxt
              :to="'/events'"
              >Events</v-tab
            >
            <recruit-dialog
              v-model="showForm"
              v-if="$auth.loggedIn && $auth.hasScope('view:forms')"
              :button="true"
            ></recruit-dialog>
            <v-spacer></v-spacer>
            <auth-dialog v-model="showAuth" v-if="!$auth.loggedIn">
              <template #activator="{ on }">
                <a class="v-tab" v-on="on">
                  <v-icon left>mdi-account-circle</v-icon>
                  <span>Sign In</span>
                </a>
              </template>
            </auth-dialog>
            <user-panel :links="userPanelLinks" :avatarSize="32" v-else>
              <template #activator="{ on }">
                <div class="v-tab" v-on="on">
                  <v-avatar :size="32" class="mr-2">
                    <v-img
                      :src="$auth.user.avatar"
                      v-if="$auth.user.avatar"
                    ></v-img>
                    <span class="white--text headline" v-else>{{
                      initials
                    }}</span>
                  </v-avatar>
                  <span>{{ $auth.user.username }}</span>
                  <v-icon right>mdi-chevron-down</v-icon>
                </div>
              </template>
            </user-panel>
          </v-tabs>
        </v-row>
      </v-container>
    </v-toolbar>
    <user-nav-mobile
      v-model="showMobile"
      @toggle="showAuth = !showAuth"
      :links="links"
    ></user-nav-mobile>
  </nav>
</template>

<script>
import AuthDialog from '~/components/auth/AuthDialog.vue';
import UserPanel from '~/components/navigation/UserPanelWithActivator.vue';
import RecruitDialog from '~/components/recruitment/RecruitDialog.vue';
import UserNavMobile from './UserNavMobile.vue';

import menu from '~/utilities/ns/public/menu.js';

export default {
  name: 'NavHeader',
  components: { UserPanel, AuthDialog, UserNavMobile, RecruitDialog },

  data() {
    return {
      color: '#1E1E1E',
      showMobile: false,
      showAuth: false,
      showForm: false,
      tab: null,

      userPanelLinks: [
        {
          icon: 'mdi-account-box',
          title: 'Profile',
          to: `/profile/${this.username}`,
        },
      ],
    };
  },

  computed: {
    links() {
      return this.$store.getters[menu.getters.LINKS];
    },

    initials() {
      if (this.$auth.user.username) {
        const username = this.$auth.user.username;
        const initials = username.match(/\b\w/g) || [];
        return (
          (initials.shift() || '') + (initials.pop() || '')
        ).toUpperCase();
      }
    },
  },
};
</script>
