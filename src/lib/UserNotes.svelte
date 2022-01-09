<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { user } from '$lib//stores';

  export let sessionId: string;
  let editing: boolean = false;
  let doneEditing: () => Promise<void>;

  onMount(async () => {
    const { updateMember } = await import('$lib/firebase');

    doneEditing = async () => {
      await updateMember($user);
      editing = false;
    };
  });
</script>

{#if editing}
  <div class="form-group mx-2">
    <textarea
      id="notes"
      bind:value={$user.notes[sessionId]}
      class="form-control"
      rows="7"
      on:focusout={doneEditing}
    />
    <button class="btn btn-light" on:click={doneEditing}>Done</button>
  </div>
{:else}
  <p class="mx-3" style="max-width: 600px; white-space: pre-wrap">{$user.notes[sessionId] ?? ''}</p>
  <button class="btn btn-light mx-2" on:click={() => (editing = true)}>Edit Notes</button>
{/if}
