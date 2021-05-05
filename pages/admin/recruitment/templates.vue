<template>
  <form-template-table></form-template-table>
</template>

<script>
import forms from '~/constants/forms/private.js';
import reset from '~/mixins/reset.js';

import setPageTitle from '~/middleware/setPageTitle.js';
import FormTemplateTable from '~/components/forms/FormTable.vue';

export default {
  name: 'RecruitmentFormTemplates',
  layout: 'admin',

  mixins: [reset(forms, 'forms')],

  components: {
    FormTemplateTable,
  },

  middleware: [
    'auth',
    setPageTitle('View Templates'),
    ({ $auth, $permissions, store, redirect }) => {
      const perms = [$permissions.VIEW_ALL_ADMIN, $permissions.VIEW_ALL_FORMS];
      if (!$auth.hasScope(perms)) return redirect('/');
      else store.dispatch(forms.actions.FETCH, true);
    },
  ],
};
</script>
