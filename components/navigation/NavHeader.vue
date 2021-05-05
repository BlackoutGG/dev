<template>
  <nav>
    <v-toolbar id="navbar" :color="color" dark flat height="80px">
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
            align-with-title
            v-model="tab"
            class="hidden-sm-and-down"
            :height="'80px'"
          >
            <nav-header-item
              v-for="(link, idx) in links"
              :key="idx"
              :link="link"
              :class="{ 'ml-4': idx === 0 }"
            ></nav-header-item>
            <!-- <nav-link
              v-for="(link, idx) in links"
              :key="idx"
              :link="link"
              :class="{ 'ml-4': idx === 0 }"
            ></nav-link> -->
            <v-tab
              v-if="$auth.loggedIn && $auth.hasScope(canViewEvents)"
              nuxt
              :to="'/events'"
              >Events</v-tab
            >
            <recruit-dialog
              v-model="showForm"
              v-if="$auth.loggedIn && $auth.hasScope(canViewForms)"
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
            <nav-user-menu :links="navUserMenuItems" :avatarSize="32" v-else>
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
                  <v-icon small>mdi-chevron-down</v-icon>
                </div>
              </template>
            </nav-user-menu>
          </v-tabs>
        </v-row>
      </v-container>
    </v-toolbar>
    <nav-mobile
      v-model="showMobile"
      @toggle="showAuth = !showAuth"
      :links="links"
    ></nav-mobile>
  </nav>
</template>

<script>
import NavUserMenu from './NavUserMenu.vue';
import NavMobile from './NavMobile.vue';
import NavHeaderItem from './NavHeaderItem.vue';

import RecruitDialog from '~/components/recruitment/RecruitDialog.vue';
import AuthDialog from '~/components/auth/AuthDialog.vue';

import menu from '~/constants/menu/public.js';

export default {
  name: 'NavHeader',
  components: {
    AuthDialog,
    RecruitDialog,
    NavMobile,
    NavHeaderItem,
    NavUserMenu,
  },

  data() {
    return {
      showMobile: false,
      showAuth: false,
      showForm: false,
      tab: null,

      color: '#1E1E1E',

      navUserMenuItems: [
        {
          icon: 'mdi-account-box',
          title: 'Profile',
          to: `/profile`,
        },
      ],
    };
  },

  computed: {
    links() {
      return this.$store.getters[menu.getters.LINKS];
    },

    canViewEvents() {
      return [this.$permissions.VIEW_ALL_EVENTS];
    },

    canViewForms() {
      return [this.$permissions.VIEW_ALL_FORMS];
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
