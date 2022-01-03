<script lang="ts">
  import type { session } from '$lib/models';
  import { updateSession } from '$lib/firebase';
  export let session: session;
  let editing: boolean = false;

  async function doneEditing() {
    await updateSession(session);
    editing = false;
  }
</script>

{#if editing}
  <div class="form-group mx-2">
    <textarea id="recap" bind:value={session.recap} class="form-control" rows="3" />
    <button class="btn btn-light" on:click={doneEditing}>Done</button>
  </div>
{:else}
  <p class="mx-3" style="max-width: 600px">{session.recap ? session.recap : ''}</p>
  <button class="btn btn-light mx-2" on:click={() => (editing = true)}>Edit Recap</button>
{/if}
