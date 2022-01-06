<script lang="ts">
  import { onMount } from 'svelte';
  import type { session } from '$lib/models';
  export let session: session;
  let files: FileList;

  let choosePhotos: () => void;
  let onDelete: () => void;

  onMount(async () => {
    // Using dynamic imports here because of https://github.com/sveltejs/kit/issues/1650
    const firebase = await import('$lib/firebase');
    
    choosePhotos = () => {
      firebase.uploadPhotos(session.id, files);
    };
    onDelete = () => {
      if (confirm('Delete all session photos?')) {
        firebase.deletePhotos(session.id);
      }
    };
  });
</script>

<div class="photos">
  {#if session.photos}
    {#each session.photos as photo}
      <img class="photo" src={photo} alt="" />
    {/each}
  {/if}
</div>
<input id="add-photo" type="file" multiple hidden bind:files on:change={choosePhotos} />
<label for="add-photo" class="btn btn-light mx-2">Add Photos</label>
{#if session.photos != undefined && session.photos.length}
  <button class="btn btn-light mx-2" on:click={onDelete}>Delete Photos</button>
{/if}

<style>
  .photos {
    width: auto;
    max-height: 70vh;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    margin-bottom: 12px;
  }
  .photo {
    max-height: 60vh;
    max-width: 90vw;
    margin: 4px;
  }
</style>
