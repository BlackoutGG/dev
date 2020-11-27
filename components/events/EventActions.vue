<template>
  <actions
    :suffix="suffix"
    :actions="computedActions"
    @more-info="$emit('more-info')"
    @edit-event="$emit('edit-event')"
    @edit-event-series="$emit('edit-event-series')"
    @remove-event="$emit('remove-event')"
    @remove-event-series="$emit('remove-event-series')"
  />
</template>

<script>
import Actions from '~/components/table/TableActions3.vue';
export default {
  name: 'EventActions',

  components: { Actions },

  props: {
    isRecurring: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      suffix: 'events',
      actions: [
        { order: 0, icon: 'mdi-eye', scope: 'view', text: 'More info' },
        {
          order: 1,
          icon: 'mdi-pencil',
          scope: 'update',
          text: 'Edit event',
          recurring: false,
        },
        {
          order: 2,
          icon: 'mdi-pencil',
          scope: 'update',
          text: 'Edit event series',
          recurring: true,
        },
        {
          order: 3,
          icon: 'mdi-trash-can',
          scope: 'delete',
          text: 'Delete event',
          recurring: false,
        },
        {
          order: 4,
          icon: 'mdi-trash-can',
          scope: 'delete',
          text: 'Remove event series',
          recurring: true,
        },
      ],
    };
  },

  computed: {
    computedActions() {
      const nonRecurring = this.actions.filter((action) => !action.recurring);
      const recurring = this.actions.filter((action) => action.recurring);
      return this.isRecurring ? [...nonRecurring, ...recurring] : nonRecurring;
    },
  },
};
</script>
