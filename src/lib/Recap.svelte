<script lang="ts">
  import { onMount } from 'svelte';
  import type { session } from '$lib/models';
  export let session: session;
  let editing: boolean = false;

  let doneEditing: () => void;

  onMount(async () => {
    // Using dynamic imports here because of https://github.com/sveltejs/kit/issues/1650
    const firebase = await import('$lib/firebase');
    
    doneEditing = () => {
      firebase.updateSession(session);
      editing = false;
    }
  })
</script>

{#if editing}
  <div class="form-group mx-2">
    <textarea id="recap" bind:value={session.recap} class="form-control" rows="7" on:focusout={doneEditing} />
    <button class="btn btn-light" on:click={doneEditing}>Done</button>
  </div>
{:else}
  <p class="mx-3" style="max-width: 600px; white-space: pre-wrap">{session.recap ? session.recap : ''}</p>
  <button class="btn btn-light mx-2" on:click={() => (editing = true)}>Edit Recap</button>
{/if}
