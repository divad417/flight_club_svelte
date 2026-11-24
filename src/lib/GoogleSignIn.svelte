<script lang="ts">
  import { login } from '#lib/firebase.js';
</script>

<button type="button" on:click={login}>
  <img alt="sign in" src="img/btn_google.svg"/>
</button>

<style>
  button {
    border: none;
    background-color: transparent;
  }
</style>
