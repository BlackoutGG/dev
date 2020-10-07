<template>
  <data-table />
</template>
<script>
const types = /posts|categories|tags/;
import lists from '~/utilities/ns/public/lists.js';
import page from '~/utilities/ns/public/page.js';
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
    ({ $auth, store, redirect, params }) => {
      if (!$auth.hasScope(['view:admin'])) {
        return redirect('/');
      }
      store.commit(page.mutations.SET_TITLE, `View ${capitalize(params.type)}`);
      store.dispatch(lists.actions.FETCH, params.type);
    },
  ],

  beforeRouteLeave(to, from, next) {
    this.$store.dispatch(lists.actions.CLEAR_LIST);
    next();
  },
};
</script>
