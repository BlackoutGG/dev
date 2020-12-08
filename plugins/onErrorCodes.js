import snackbar from '~/utilities/ns/public/snackbar.js';
import page from '~/utilities/ns/public/page.js';

export default ({ $axios, $auth, redirect, store }) =>
  $axios.onError((err) => {
    const code = parseInt(err.response && err.response.status);
    const message = err.response.data.message;
    const type = err.response.data.type;

    console.log(message);

    if (code === 401) {
      if (type === 'Unauthorized') {
        switch (message) {
          case 'jwt_expired':
            $auth.logout();
            return redirect('/');
          case 'jwt_revoked':
            return store.commit(
              page.mutations.TOGGLE_ACCOUNT_CHANGE_DIALOG,
              true
            );
          default:
            break;
        }
      }
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
