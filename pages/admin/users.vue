<template>
  <user-table />
</template>

<script>
import UserTable from '~/components/users/UserTable.vue';
import setPageTitle from '~/middleware/setPageTitle.js';
import users from '~/utilities/ns/public/users.js';
import reset from '~/mixins/reset.js';

export default {
  layout: 'admin',
  name: 'Users',

  mixins: [reset(users, 'users')],

  components: { UserTable },

  middleware: [
    'auth',
    setPageTitle('View Users'),
    ({ $auth, store, redirect }) => {
      if (!$auth.hasScope(['view:admin', 'view:users'])) return redirect('/');
      else store.dispatch(users.actions.FETCH, true);
    },
  ],
};
</script>
