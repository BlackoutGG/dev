<template>
  <user-table />
</template>

<script>
import UserTable from '~/components/users/UserTable.vue';
import setPageTitle from '~/middleware/setPageTitle.js';
import users from '~/constants/users/public.js';
import reset from '~/mixins/reset.js';

export default {
  layout: 'admin',
  name: 'Users',

  mixins: [reset(users, 'users')],

  components: { UserTable },

  middleware: [
    'auth',
    setPageTitle('View Users'),
    ({ $auth, $permissions, store, redirect }) => {
      const perms = [$permissions.VIEW_ALL_ADMIN, $permissions.VIEW_ALL_USERS];

      if (!$auth.hasScope(perms)) return redirect('/');
      else store.dispatch(users.actions.FETCH, true);
    },
  ],
};
</script>
