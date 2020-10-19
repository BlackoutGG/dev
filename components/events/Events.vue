<template>
  <v-row>
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2">Today</v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.events">{{
            $refs.events.title
          }}</v-toolbar-title>
          <v-btn text color="grey darken-2" @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <table-filter-options
            :filters="filters"
            :name="name"
            @update="fetch({ start, end })"
            @reset="onReset"
          />
          <event-dialog
            ref="dialog"
            v-if="$auth.hasScope(['add:events'])"
          ></event-dialog>

          <v-menu bottom right>
            <template #activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <event-list-item
                v-for="(t, idx) in types"
                :key="idx"
                v-model="type"
                >{{ t }}</event-list-item
              >
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="events"
          v-model="focus"
          color="primary"
          :events="events"
          :event-overlap-mode="eventOverlapMode"
          :event-overlap-threshold="eventOverlapThreshold"
          :eventMore="eventMore"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="fetchEvents"
        ></v-calendar>
        <event-popover ref="popover" @edit="setEditableContent"></event-popover>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import events from '~/utilities/ns/public/events.js';
import lists from '~/utilities/ns/public/lists.js';
import EventListItem from './EventListItem.vue';
import EventDialog from './EventDialog.vue';
import EventPopover from './EventPopover.vue';

import TableFilterOptions from '~/components/table/TableFilterOptions.vue';

import filters from '~/utilities/ns/public/filters.js';

const { mapGetters, mapActions } = createNamespacedHelpers('events');

const toTimestamp = (str) => {
  return Math.round(new Date(str).replace(/-/g, '/').getTime() / 1000);
};

export default {
  name: 'EventsCalendar',

  components: { EventListItem, EventDialog, EventPopover, TableFilterOptions },

  data() {
    return {
      focus: '',
      types: ['day', 'week', 'month', '4day'],
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },

      eventOverlapMode: 'stack',
      eventOverlapThreshold: 0,
      eventMore: true,

      name: 'events',

      start: '',
      end: '',
    };
  },

  mounted() {
    this.$refs.events.checkChange();
  },

  methods: {
    ...mapActions(['fetch']),

    getEventColor(event) {
      return event.color;
    },

    setEditableContent(event) {
      this.$refs.dialog.setEditableContent(event);
    },

    showEvent({ nativeEvent, event }) {
      this.$refs.popover.toggle(event, nativeEvent.target);
      nativeEvent.stopPropagation();
    },

    viewDay({ date }) {
      this.focus = date;
      this.type = 'day';
    },

    next() {
      this.$refs.events.next();
    },

    prev() {
      this.$refs.events.prev();
    },

    fetchEvents({ start, end }) {
      if (start.date === end.date) return;

      this.start = start.date;
      this.end = end.date;
      this.fetch({
        start: start.date,
        end: end.date,
      });
    },

    onReset() {
      this.$store.commit(filters.mutations.RESET_FILTER, 'events');
      this.fetchEvents();
    },
  },

  computed: {
    ...mapGetters(['events', 'eventColors']),

    categories() {
      return this.$store.getters[lists.getters.GET_ITEMS](
        'categories'
      ).map(({ id, name }) => ({ id, name }));
    },

    getCategoriesByName() {
      return this.categories.map(({ name }) => name);
    },

    filters() {
      const categories = {
        name: 'Categories',
        type: 'category_id',
        itemProp: 'id',
        multiple: true,
        children: this.categories,
      };

      return [categories];
    },
  },
};
</script>

<style lang="scss">
// .v-calendar-weekly__week {
//   min-height: 200px;
// }
</style>