<template>
  <event-scroller :items="items" @update="update">
    <template #default="{ item }">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-checkbox
            multiple
            v-model="roles"
            :true-value="item.id"
            :value="item.id"
          ></v-checkbox>
        </v-list-item-action>
      </v-list-item>
    </template>
  </event-scroller>
</template>
<script>
import EventScroller from './Scroller.vue';
import snackbar from '~/utilities/ns/public/snackbar.js';
export default {
  name: 'EventRoleList',
  components: { EventScroller },

  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      page: 1,
      limit: 50,
      items: [],
    };
  },

  async fetch() {
    const { results } = await this.fetchItems();
    this.items = results;
  },

  methods: {
    async update($state) {
      this.page++;
      try {
        const items = await this.fetchItems();
        if (items && items.length) {
          this.items.push(...items);
          $state.loaded();
        } else {
          $state.completed();
        }
      } catch (err) {
        console.log(err);
      }
    },

    async fetchItems() {
      const { page, limit } = this;
      try {
        const { roles } = (
          await this.$axios.get('/roles', { params: { page, limit } })
        ).data;

        return roles;
      } catch (err) {
        throw err;
        console.log(err);
      }
    },
  },

  computed: {
    roles: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>