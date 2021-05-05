<template>
  <recruit-table></recruit-table>
</template>

<script>
import recruitment from '~/constants/recruitment/public.js';
import reset from '~/mixins/reset.js';
import setPageTitle from '~/middleware/setPageTitle.js';
import RecruitTable from '~/components/recruitment/RecruitTable.vue';

export default {
  name: 'RecruitmentForms',
  layout: 'admin',

  mixins: [reset(recruitment, 'recruitment')],

  components: { RecruitTable },

  middleware: [
    'auth',
    ({ $auth, $permissions, store, redirect }) => {
      const perms = [$permissions.VIEW_ALL_ADMIN, $permissions.VIEW_ALL_FORMS];
      if (!$auth.hasScope(perms)) redirect('/');
      else store.dispatch(recruitment.actions.FETCH, true);
    },
    setPageTitle('View Recruitment'),
  ],
};
</script>
