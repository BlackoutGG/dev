<template>
  <user-table />
</template>

<script>
import UserTable from '~/components/users/UserTable.vue';
import setPageTitle from '~/middleware/setPageTitle.js';
import users from '~/utilities/ns/public/users.js';

export default {
  layout: 'admin',
  name: 'Users',
  components: { UserTable },
  middleware: [
    'auth',
    ({ $auth, store, redirect }) => {
      if (!$auth.hasScope(['view:admin', 'view:users'])) return redirect('/');
      else store.dispatch(users.actions.FETCH, true);
    },
    setPageTitle('View Users'),
  ],
};
</script>
