<script lang="ts">
  import { auth, provider } from '$lib/firebase';
  import { signInWithPopup } from 'firebase/auth';

  function login() {
    signInWithPopup(auth, provider);
  }
</script>

<div class="text-center m-5">
  <p><strong>Please Sign In:</strong></p>
  <button class="btn btn-light mx-3" on:click={login}>Sign in with Google</button>
</div>
