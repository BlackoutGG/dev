<template>
  <v-container fluid>
    <testimony-list
      v-model="selected"
      :title="'Testimonies'"
      :items="testimonies"
      @create="testimonyDialog = true"
      @save="saveOrderChange"
    >
      <template #default="props">
        <div class="fp-body-row" v-for="(item, idx) in props.items" :key="idx">
          <div class="fp-body-column shrink">
            <v-icon small class="grab"> mdi-arrow-all </v-icon>
          </div>
          <div class="fp-body-column shrink">
            <v-checkbox
              v-model="selected"
              multiple
              :value="item.id"
            ></v-checkbox>
          </div>
          <div class="fp-body-column grow">
            <v-list-item class="px-0">
              <v-list-item-avatar>
                <user-avatar
                  :size="40"
                  :item="item"
                  :nameKey="'author'"
                ></user-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                {{ item.author }}
              </v-list-item-content>
            </v-list-item>
          </div>
          <div class="fp-body-column">
            <list-actions
              :suffix="'admin'"
              :actions="actions"
              @edit="editTestimony(item)"
            ></list-actions>
          </div>
        </div>
      </template>
    </testimony-list>
    <v-dialog
      v-model="testimonyDialog"
      :minWidth="minWidth"
      :maxWidth="minWidth"
    >
      <v-card>
        <v-toolbar dark>
          <v-toolbar-title>
            <span>Create New Testimony</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop="closeTestimonyDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-list-item class="px-0">
                <v-list-item-avatar>
                  <user-avatar
                    :item="details"
                    :size="40"
                    :nameKey="'author'"
                    :style="{ overflow: 'visible' }"
                    is-editable
                    @edit-profile-image="mediaDialog = true"
                  ></user-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-text-field
                    label="Author"
                    v-model="details.author"
                  ></v-text-field>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Text"
                outlined
                v-model="details.text"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn>Save</v-btn>
          <v-btn>Reset</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <media-dialog
      v-model="mediaDialog"
      single
      header
      fullscreen
      :title="'Select an image'"
      :fileSize="fileSize"
      @setImage="setImage"
    ></media-dialog>
  </v-container>
</template>

<script>
import setPageTitle from '~/middleware/setPageTitle.js';
import TestimonyList from '~/components/frontpage/FPList.vue';
import ListActions from '~/components/controls/Actions.vue';
import UserAvatar from '~/components/avatar/ListAvatar.vue';
import MediaDialog from '~/components/media/MediaDialog.vue';

export default {
  name: 'FPTestimonies',
  layout: 'admin',

  components: { TestimonyList, ListActions, UserAvatar, MediaDialog },

  middleware: [
    'auth',
    setPageTitle('Testimonies'),
    ({ $auth, $permissions, store, redirect }) => {
      if (!$auth.hasScope($permissions.VIEW_ALL_ADMIN)) {
        return redirect('/');
        //   } else {
        //     store.dispatch(lists.actions.FETCH, 'categories');
      }
    },
  ],

  data() {
    return {
      testimonyDialog: false,
      mediaDialog: false,
      details: {
        avatar: '',
        author: '',
        text: '',
      },
      fileSize: 72000,
      minWidth: 500,
      selected: [],
      actions: [
        { icon: 'mdi-pencil', scope: 'view', text: 'Edit' },
        { icon: 'mdi-delete', scope: 'view', text: 'Remove' },
      ],

      testimonies: [
        {
          id: 1,
          avatar:
            'https://blackout-gaming.s3.amazonaws.com/Images/testimony/admeer.png',
          author: 'admeer',
          text: 'fuck bko',
        },
        {
          id: 2,
          avatar:
            'https://blackout-gaming.s3.amazonaws.com/Images/testimony/2b.png',
          author: '2b',
          text: 'is BKO that big of an issue?',
        },
        {
          id: 3,
          avatar:
            'https://blackout-gaming.s3.amazonaws.com/Images/testimony/artemis.png',
          author: 'artemis',
          text:
            "BKO is going to cause the downfall of this game with the ridiculous amount of hexes they're screwing up.",
        },
        {
          id: 4,
          avatar:
            'https://blackout-gaming.s3.amazonaws.com/Images/testimony/beast.png',
          author: 'baast',
          text:
            "mhmm, there's this BKO guild in NA-W thats huge and just roam around raiding people, been dodging them hard as hard as we try, nothing we can do when 30 repeaters are raining on us.",
        },
        {
          id: 5,
          avatar:
            'https://blackout-gaming.s3.amazonaws.com/Images/testimony/blucobra.png',
          author: 'blucobra',
          text:
            'yah I know them and BKD or BKO or whatever there called are ruthlesss. I spawned in a new tile last night bam killed on sit 3 times and when I went to trader to get away they were outside in all directions waiting lol.',
        },
        {
          id: 6,
          avatar:
            'https://blackout-gaming.s3.amazonaws.com/Images/testimony/ghost.png',
          author: 'ghost',
          text: 'anyone know who this BKO clan is? Clan of griefers.',
        },
        {
          id: 7,
          avatar:
            'https://blackout-gaming.s3.amazonaws.com/Images/testimony/kswest.png',
          author: 'kswest',
          text:
            "Lol. Just logged into my peaceful allied server of like 10-12 clans getting fuckin decimated by 50+ bko zerg. Good fuckin times. Apparently it really is assimilate to the 1000+ man zerg or don't play.",
        },
      ],
    };
  },

  methods: {
    create() {
      this.testimonyDialog = true;
    },
    closeTestimonyDialog() {
      this.testimonyDialog = false;
      this.resetTestimonyForm();
    },
    setImage(image) {
      this.details.avatar = image;
    },
    resetTestimonyForm() {
      Object.keys(this.details).forEach(
        (detail) => (this.details[detail] = '')
      );
    },

    editTestimony(item) {
      const { author, avatar, text } = item;
      this.details = { author, avatar, text };
      this.testimonyDialog = true;
    },

    async createNewTestimony() {
      try {
        const { testimony } = (
          await this.$http.post('/testimony', this.details)
        ).data;
        this.$store.dispatch(snackbar.actions.TOGGLE_BAR, {
          text: 'Testimony saved.',
          position: 'top',
        });
      } catch (err) {
        return Promise.reject(err);
      } finally {
        this.resetTestimonyForm();
      }
    },

    async saveOrderChange() {
      await this.$http.patch('/testimony/order', this.testimonyOrder);
      this.$store.dispatch(snackbar.actions.TOGGLE_BAR, {
        text: 'Updates saved.',
        position: 'top',
      });
    },
  },
};
</script>
