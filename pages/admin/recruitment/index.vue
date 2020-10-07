<template>
  <recruit-table></recruit-table>
</template>

<script>
import recruitment from '~/utilities/ns/public/recruitment.js';
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
    ({ $auth, store, redirect }) => {
      if (!$auth.hasScope(['view:admin', 'view:forms'])) redirect('/');
      else store.dispatch(recruitment.actions.FETCH, true);
    },
    setPageTitle('View Recruitment'),
  ],
};
</script>