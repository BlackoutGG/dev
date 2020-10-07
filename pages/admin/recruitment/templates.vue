<template>
  <form-template-table></form-template-table>
</template>

<script>
import forms from '~/utilities/ns/public/forms.js';
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
    ({ $auth, store, redirect }) => {
      if (!$auth.hasScope(['view:admin', 'view:forms'])) return redirect('/');
      else store.dispatch(forms.actions.FETCH, true);
    },
  ],
};
</script>
