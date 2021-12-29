<script>
  import { auth, provider } from '../firebase';
  import { signInWithPopup, signOut } from 'firebase/auth';

  let user = auth.currentUser;

  function login() {
    signInWithPopup(auth, provider)
  }

  function logout() {
    signOut(auth)
  }

  auth.onAuthStateChanged((googleUser) => {
    if (googleUser) {
      user = googleUser
    } else {
      user = null;
    }
  })
</script>

<nav>
  <a href="/">Home</a>
  <a href="/beers">Beers</a>
  {#if user}
  <button on:click={logout}>Logout</button>
  {:else}
  <button on:click={login}>Login</button>
  {/if}
</nav>
