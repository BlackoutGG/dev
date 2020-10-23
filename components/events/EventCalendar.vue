<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-btn text fab small color="grey darken-2" @click="prev">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span class="text-h6 white--text">{{ title }}</span>
        <v-btn text fab small color="grey darken-2" @click="next">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" md="6" class="d-flex">
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
      </v-col>
      <v-col cols="12">
        <full-calendar ref="fullCalendar" :options="config"> </full-calendar>
        <event-popover ref="popover" @edit="setEditableContent"></event-popover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import EventDialog from './EventDialog.vue';
import EventPopover from './EventPopover.vue';

import TableFilterOptions from '~/components/table/TableFilterOptions.vue';

import events from '~/utilities/ns/public/events.js';
import lists from '~/utilities/ns/public/lists.js';
import filters from '~/utilities/ns/public/filters.js';

export default {
  name: 'EventCalendar',

  components: {
    FullCalendar,
    EventDialog,
    EventPopover,
    TableFilterOptions,
  },

  data() {
    return {
      name: 'events',
      title: '',
      start: null,
      end: null,

      options: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: false,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        initialView: 'dayGridMonth',
      },

      eventHandlers: {
        eventClick: this.showEventPopover,
        // eventSet: this.setEvents,
      },
    };
  },

  mounted() {
    const calendarApi = this.$refs.fullCalendar.getApi();
    this.title = calendarApi.view.title;
    this.setStartAndEnd();
  },

  watch: {
    start(start) {
      this.fetch(start, this.end);
    },
  },

  methods: {
    setStartAndEnd() {
      const calendarApi = this.$refs.fullCalendar.getApi();
      const { currentStart, currentEnd } = calendarApi.view;

      const start = new Date(currentStart).toISOString().split('T')[0];
      const end = new Date(currentEnd).toISOString().split('T')[0];

      this.start = start;
      this.end = end;
    },

    fetch(start, end) {
      this.$store.dispatch(events.actions.FETCH, { start, end });
    },

    setEditableContent(event) {
      this.$refs.dialog.setEditableContent(event);
    },

    showEventPopover({ eventObject, el, event }) {
      this.$refs.popover.toggle(eventObject, el);
      event.stopPropagation();
    },

    onReset() {
      this.$store.commit(filters.mutations.RESET_FILTER, 'events');
      this.fetch(this.start, this.end);
    },

    next() {
      const calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.next();
      this.setStartAndEnd();
      this.title = calendarApi.view.title;
    },

    prev() {
      const calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.prev();
      this.setStartAndEnd();
      this.title = calendarApi.view.title;
    },

    today() {
      const calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.today();
    },
  },

  computed: {
    config() {
      return {
        ...this.options,
        ...this.eventHandlers,
        ...this.isEditable,
        events: this.events,
      };
    },

    isEditable() {
      return { editable: this.$auth.hasScope('update:events') };
    },

    events() {
      return this.$store.getters[events.getters.EVENTS];
    },

    categories() {
      return this.$store.getters[lists.getters.GET_ITEMS](
        'categories'
      ).map(({ id, name }) => ({ id, name }));
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
.theme--dark {
  .fc table {
    border: none !important;
    background-color: #1e1e1e;
  }

  .fc-theme-standard td,
  th {
    border: 1px solid #121212 !important;
  }

  .fc-col-header-cell {
    background-color: #121212;
    &-cushion {
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .fc .fc-highlight {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .fc-day-other {
    background-color: #1b1b1b;
  }

  .fc-daygrid-day-top .fc-daygrid-day-number {
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
