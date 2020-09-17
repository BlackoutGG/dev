<template>
  <v-container fluid fill-height></v-container>
</template>

<script>
import setTitle from '~/middleware/setPageTitle.js'
export default {
  name: 'AdminDashboard',
  layout: 'admin',
  middleware: [
    'auth',
    ({ $auth }) => $auth.hasScope('view:admin'),
    setTitle('Dashboard'),
  ],
}
</script>
