<template>
  <data-table />
</template>
<script>
const types = /categories|tags/;

import table from '~/constants/table/public.js';
import page from '~/constants/page/public.js';
import DataTable from '~/components/table/Table.vue';
import capitalize from 'lodash/capitalize';

export default {
  name: 'Items',
  layout: 'admin',

  components: { DataTable },

  validate({ params }) {
    return types.test(params.type);
  },

  middleware: [
    'auth',
    ({ $auth, $permissions, store, redirect, params }) => {
      const { VIEW_ALL_ADMIN } = $permissions;
      if (!$auth.hasScope([VIEW_ALL_ADMIN])) {
        return redirect('/');
      }
      store.commit(page.mutations.SET_TITLE, `View ${capitalize(params.type)}`);
      store.dispatch(table.actions.FETCH, params.type);
    },
  ],

  beforeRouteLeave(to, from, next) {
    this.$store.dispatch(table.actions.CLEAR_LIST);
    next();
  },
};
</script>
