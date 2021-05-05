<template>
  <role-table></role-table>
</template>

<script>
import RoleTable from '~/components/roles/RoleTable.vue';
import setPageTitle from '~/middleware/setPageTitle.js';
import roles from '~/constants/roles/public.js';
import filter from '~/constants/filters/public.js';

export default {
  layout: 'admin',
  name: 'AdminRoles',

  components: { RoleTable },

  middleware: [
    'auth',
    setPageTitle('View Roles'),
    ({ $auth, $permissions, store, redirect }) => {
      console.log($permissions);

      const perms = [$permissions.VIEW_ALL_ADMIN, $permissions.VIEW_ALL_ROLES];
      if (!$auth.hasScope(perms)) return redirect('/');
      else store.dispatch(roles.actions.FETCH);
    },
    // (ctx) => {
    //   console.log(ctx);

    //   const perms = [
    //     ctx.$permissions.VIEW_ALL_ADMIN,
    //     ctx.$permissions.VIEW_ALL_ROLES,
    //   ];
    //   if (!ctx.$auth.hasScope(perms)) return redirect('/');
    //   else ctx.store.dispatch(roles.actions.FETCH);
    // },
  ],
};
</script>
