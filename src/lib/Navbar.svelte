<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { user } from '$lib/models';
  import type { Unsubscribe } from '@firebase/util';

  let navbarElement: Element;
  let navbarCollapse: any;

  export let user: user = null;
  let login: () => void;
  let logout: () => void;
  const onUpdate = (updatedUser: user) => {
    user = updatedUser;
  };
  let unsubscribe: Unsubscribe;

  onMount(async () => {
    // Using dynamic imports here because of https://github.com/sveltejs/kit/issues/1650
    const Collapse = (await import('bootstrap/js/dist/collapse.js')).default;
    const firebase = await import('$lib/firebase');
    await import('bootstrap/js/dist/dropdown.js');
    await import('bootstrap/js/dist/button.js');

    // Need this object accessible to open the modal box programatically
    navbarCollapse = new Collapse(navbarElement, { toggle: false });

    user = firebase.currentUser();
    login = firebase.login;
    logout = firebase.logout;

    // Watch for login/logout events from the auth library
    unsubscribe = firebase.watchAuthState(onUpdate);
  });
  onDestroy(() => unsubscribe());

  function closeNavbar() {
    // Bootstrap navbars don't auto-close, so added that feature
    if (navbarCollapse != undefined) {
      navbarCollapse.hide();
    }
  }
</script>

<svelte:window on:click={closeNavbar} />
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
  <div id="navbarNav" class="collapse navbar-collapse mt-2" bind:this={navbarElement}>
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link px-2" href="/sessions">Sessions</a>
      </li>
      <li class="nav-item">
        <a class="nav-link px-2" href="/beers">Beers</a>
      </li>
      <li class="nav-item">
        <a class="nav-link px-2" href="/members">Members</a>
      </li>
    </ul>
    <hr class="dropdown-divider" />
    <ul class="navbar-nav ms-auto">
      {#if user}
        <li class="nav-item dropdown">
          <a
            class="nav-link px-2"
            href={'#'}
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            on:click|stopPropagation
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
            <a class="dropdown-item" href={'/member/' + user.id}>Profile</a>
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
