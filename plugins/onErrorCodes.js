import page from '~/constants/page/public.js';

export default ({ $axios, $auth, $toast, redirect, store }) =>
  $axios.onError((err) => {
    const code = parseInt(err.response && err.response.status);
    const message = err.response.data.message;
    const type = err.response.data.type;

    console.log(code);
    console.log(message);
    console.log(type);

    if (code === 401) {
      switch (type) {
        case 'Unauthorized':
          $auth.logout();
          redirect('/');
          break;
        case 'Revoked':
          console.log('Toggling Dialog');
          store.commit(page.mutations.TOGGLE_STATUS_DIALOG, true);
          break;
        default:
          break;
      }
    } else if (code === 403) {
      if ($auth.loggedIn) {
        if (message === 'Permission denied' && type === 'Unauthorized') {
          const text = 'Insufficient permissions to perform this action.';
          // store.dispatch(snackbar.actions.TOGGLE_BAR, { text });
          $toast.show(text, { position: 'top-center' });
        }
      }
    } else {
      // store.dispatch(snackbar.actions.TOGGLE_BAR, { text: message });
      $toast.show(message, { position: 'top-center' });
    }
  });
