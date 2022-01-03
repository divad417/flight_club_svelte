<script lang="ts">
  import { onDestroy } from 'svelte';
  import { onSnapshot, doc } from 'firebase/firestore';
  import { auth, db, updateUser } from '$lib/firebase';
  export let sessionId: string;

  let editing: boolean = false;
  let id = auth.currentUser.uid;
  let user: any = { notes: {} };

  const unsubscribe = onSnapshot(doc(db, 'users', id), (snapshot) => {
    user = snapshot.data();
    user.id = snapshot.id;
  });
  onDestroy(unsubscribe);

  async function doneEditing() {
    await updateUser(user);
    editing = false;
  }
</script>

{#if editing}
  <div class="form-group mx-2">
    <textarea id="notes" bind:value={user.notes[sessionId]} class="form-control" rows="3" />
    <button class="btn btn-light" on:click={doneEditing}>Done</button>
  </div>
{:else}
  <p class="mx-3" style="max-width: 600px">{user.notes[sessionId] ?? ''}</p>
  <button class="btn btn-light mx-2" on:click={() => (editing = true)}>Edit Notes</button>
{/if}
