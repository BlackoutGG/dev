export default function ({ $auth, redirect }) {
  console.log($auth);
  if (!$auth.loggedIn) return redirect('/');
}
