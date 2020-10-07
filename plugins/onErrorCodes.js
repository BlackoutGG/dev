import snackbar from '~/utilities/ns/public/snackbar.js';

export default ({ $axios, $auth, redirect, store }) =>
  $axios.onError((err) => {
    const code = parseInt(err.response && err.response.status);
    const message = err.response.data.message;
    const type = err.response.data.type;
    if (code === 401) {
      if (message === 'jwt_expired' && type === 'Unauthorized') {
        $auth.logout();
        // if ($auth.loggedIn) {
        //   console.log('logging you out...');
        //   $auth.logout();
        // }
      }
      redirect('/');
    } else if (code === 403) {
      if ($auth.loggedIn) {
        if (message === 'Permission denied' && type === 'Unauthorized') {
          const text = 'Insufficient permissions to perform this action.';
          store.dispatch(snackbar.actions.TOGGLE_BAR, { text });
        }
      }
    } else {
      store.dispatch(snackbar.actions.TOGGLE_BAR, { text: message });
    }
  });
