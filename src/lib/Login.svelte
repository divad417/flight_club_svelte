<script lang="ts">
  // Component to show when there is no valid user
  import { login } from '$lib/firebase';
</script>

<div class="text-center m-5">
  <p><strong>Please Sign In:</strong></p>
  <button class="btn btn-light mx-3" on:click={login}>Sign in with Google</button>
</div>
