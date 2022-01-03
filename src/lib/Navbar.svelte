<script lang="ts">
  import { onDestroy } from 'svelte';
  import { auth, provider, updateUser } from '$lib/firebase';
  import { signInWithPopup, signOut, User } from 'firebase/auth';
  import type { user } from '$lib/models';
  import 'bootstrap/js/dist/collapse.js';
  import 'bootstrap/js/dist/dropdown.js';
  import 'bootstrap/js/dist/button.js';

  export let user: user = auth.currentUser ? userFromGoogleUser(auth.currentUser) : null;

  function login() {
    signInWithPopup(auth, provider);
  }
  function logout() {
    signOut(auth);
  }

  // Watch for login/logout events from the auth library
  const unsubscribe = auth.onAuthStateChanged((googleUser) => {
    if (googleUser) {
      // Add or update the user to our database on login
      user = userFromGoogleUser(googleUser);
      updateUser(user);
    } else {
      user = null;
    }
  });

  function userFromGoogleUser(googleUser: User) {
    return {
      id: googleUser.uid,
      full_name: googleUser.displayName,
      email: googleUser.email,
      photoURL: googleUser.photoURL
    };
  }

  onDestroy(unsubscribe);
</script>

<nav class="navbar navbar-expand-md navbar-light container-fluid">
  <a href="/" class="me-3">
    <img src="/img/Flight-Club.svg" alt="flight club logo" style="max-width: 150px" />
  </a>
  <button
    class="navbar-toggler"
    type="button"
    data-bs-toggle="collapse"
    data-bs-target="#navbarNav"
    aria-controls="navbarNav"
    aria-expanded="false"
  >
    <span class="navbar-toggler-icon" />
  </button>
  <div id="navbarNav" class="collapse navbar-collapse">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" href="/sessions">Sessions</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/beers">Beers</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/members">Members</a>
      </li>
    </ul>
    <hr class="dropdown-divider" />
    <ul class="navbar-nav ms-auto">
      {#if user}
        <li class="nav-item dropdown">
          <a
            class="nav-link"
            href={'#'}
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {user.full_name}
            <img
              class="rounded-circle align-middle ms-1"
              width="30"
              src={user.photoURL}
              alt="Profile"
            />
          </a>
          <div class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
            <a class="dropdown-item" href={'/member/' + auth.currentUser.uid}>Profile</a>
            <hr class="dropdown-divider" />
            <a href={'#'} class="dropdown-item" on:click={logout}>Sign Out</a>
          </div>
        </li>
      {:else}
        <li class="nav-item">
          <button class="btn btn-light" on:click={login}>Sign in with Google</button>
        </li>
      {/if}
    </ul>
  </div>
</nav>

<style lang="scss">
  .navbar {
    background: #ffecbc;
  }
  .navbar-toggler {
    border: 0px;
  }
  .navbar-toggler:focus {
    box-shadow: 0 0 0 0;
  }
  .nav-link {
    font-size: 20px;
    font-family: Roboto, sans-serif;
    border-radius: 3px;
  }
  .nav-link:hover {
    background: #ffda7b;
    cursor: pointer;
  }
</style>
