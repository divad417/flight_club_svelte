<script lang="ts">
  // Component to show when there is no valid user
  import { onMount } from 'svelte';
  let login: () => void;

  onMount(async () => {
    // Using dynamic imports here because of https://github.com/sveltejs/kit/issues/1650
    const firebase = await import('$lib/firebase');
    login = firebase.login;
  })
</script>

<div class="text-center m-5">
  <p><strong>Please Sign In:</strong></p>
  <button class="btn btn-light mx-3" on:click={login}>Sign in with Google</button>
</div>
