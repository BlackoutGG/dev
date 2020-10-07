<template>
  <role-table></role-table>
</template>

<script>
import RoleTable from '~/components/roles/RoleTable.vue';
import setPageTitle from '~/middleware/setPageTitle.js';
import roles from '~/utilities/ns/public/roles.js';
import filter from '~/utilities/ns/public/filters.js';

export default {
  layout: 'admin',
  name: 'AdminRoles',

  components: { RoleTable },

  middleware: [
    'auth',
    setPageTitle('View Roles'),
    ({ $auth, store, redirect }) => {
      if (!$auth.hasScope(['view:admin', 'view:roles'])) return redirect('/');
      else store.dispatch(roles.actions.FETCH);
    },
  ],
};
</script>
