<template>
  <v-container fluid>
    <form-template-table></form-template-table>
  </v-container>
</template>

<script>
import forms from '~/utilities/ns/public/forms.js';
import setPageTitle from '~/middleware/setPageTitle.js';
import FormTemplateTable from '~/components/forms/FormTable.vue';
import filter from '~/utilities/ns/public/filters.js';

export default {
  name: 'RecruitmentFormTemplates',
  layout: 'admin',

  beforeRouteLeave(to, from, next) {
    this.$store.commit(filter.mutations.RESET_FILTER, 'forms');
    next();
  },

  components: {
    FormTemplateTable,
  },

  middleware: [
    'auth',
    setPageTitle('View Forms'),
    ({ $auth, store, redirect }) => {
      if (!$auth.hasScope(['view:admin', 'view:forms'])) return redirect('/');
      else store.dispatch(forms.actions.FETCH, true);
    },
  ],
};
</script>
