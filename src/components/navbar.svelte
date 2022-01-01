<script>
  import { onDestroy } from 'svelte';
  import { auth, provider } from '../firebase';
  import { signInWithPopup, signOut } from 'firebase/auth';

  let user = auth.currentUser;

  function login() {
    signInWithPopup(auth, provider);
  }

  function logout() {
    signOut(auth);
  }

  const unsubscribe = auth.onAuthStateChanged((googleUser) => {
    if (googleUser) {
      user = googleUser;
    } else {
      user = null;
    }
  });

  onDestroy(unsubscribe);
</script>

<nav>
  <a href="/">Home</a>
  <a href="/sessions">Sessions</a>
  <a href="/beers">Beers</a>
  <a href="/members">Members</a>
  {#if user}
    <button on:click={logout}>Logout</button>
  {:else}
    <button on:click={login}>Login</button>
  {/if}
  <hr />
</nav>
