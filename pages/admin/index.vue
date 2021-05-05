<template>
  <v-container fluid fill-height></v-container>
</template>

<script>
import setTitle from '~/middleware/setPageTitle.js';

export default {
  name: 'AdminDashboard',
  layout: 'admin',
  middleware: [
    'auth',
    ({ $auth, $permissions, redirect }) => {
      if (!$auth.hasScope($permissions.VIEW_ALL_ADMIN)) return redirect('/');
    },
    setTitle('Dashboard'),
  ],
};
</script>
