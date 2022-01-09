<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '$lib/stores';

  let onSubmit: () => void;

  onMount(async () => {
    // Using dynamic imports here because of https://github.com/sveltejs/kit/issues/1650
    await import('bootstrap/js/dist/modal.js');
    const { updateMember } = await import('$lib/firebase');
    onSubmit = () => {
      updateMember($user);
    }
  });

  $: submitDisabled = !$user.name;
</script>

<button
  type="button"
  class="btn btn-light mx-3"
  data-bs-toggle="modal"
  data-bs-target="#updateUser"
>
  Edit Profile
</button>

<div class="modal" tabindex="-1" id="updateUser">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title m-0">Edit Profile</h3>
        <button type="button" class="btn-close" data-bs-dismiss="modal" />
      </div>
      <div class="modal-body">
        <form class="edit-form">
          <div class="row mb-3 align-items-center">
            <label for="name" class="col-sm-3 col-form-label"> Name </label>
            <div class="col-sm-9">
              <input id="name" bind:value={$user.name} class="form-control" type="string" />
            </div>
            <div class="form-text text-end">This links you with beers</div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-light"
          on:click={onSubmit}
          data-bs-dismiss="modal"
          disabled={submitDisabled}>Submit</button
        >
      </div>
    </div>
  </div>
</div>
