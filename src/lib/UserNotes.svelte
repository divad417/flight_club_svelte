<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Unsubscribe } from '@firebase/util';
  export let sessionId: string;

  let editing: boolean = false;
  let id: string;
  let user: any = { notes: {} };
  let doneEditing: () => Promise<void>;

  const onUpdate = (update: any) => {
    user = update;
  };
  let unsubscribe: Unsubscribe;

  onMount(async () => {
    const firebase = await import('$lib/firebase');
    id = firebase.currentUser().id;

    // Get user from the database and watch for changes
    unsubscribe = firebase.watchUser(id, onUpdate);
    
    doneEditing = async () => {
      await firebase.updateUser(user);
      editing = false;
    };
  });
  onDestroy(() => unsubscribe());
</script>

{#if editing}
  <div class="form-group mx-2">
    <textarea
      id="notes"
      bind:value={user.notes[sessionId]}
      class="form-control"
      rows="7"
      on:focusout={doneEditing}
    />
    <button class="btn btn-light" on:click={doneEditing}>Done</button>
  </div>
{:else}
  <p class="mx-3" style="max-width: 600px; white-space: pre-wrap">{user.notes[sessionId] ?? ''}</p>
  <button class="btn btn-light mx-2" on:click={() => (editing = true)}>Edit Notes</button>
{/if}
