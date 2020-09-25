<template>
  <v-switch v-model="computedValue"></v-switch>
</template>

<script>
import lists from '~/utilities/ns/public/lists.js';
export default {
  name: 'TableRecruitmentSwitch',

  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    computedValue: {
      get() {
        return this.item.recruitment;
      },
      set(value) {
        const details = { recruitment: !this.item.recruitment };
        this.$store.dispatch(lists.actions.EDIT_ITEM, {
          id: this.item.id,
          route: 'categories',
          details,
        });
      },
    },
  },
};
</script>
