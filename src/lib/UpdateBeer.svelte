<script lang="ts">
  import { onMount } from 'svelte';
  import { newBeerId, updateBeer, deleteBeer } from '$lib/firebase';
  import type { beer } from '$lib/models';
  import Modal from 'bootstrap/js/dist/modal.js';

  let updateBeerElement: Element = undefined;
  let updateBeerModal: Modal = undefined;
  // Link the bootstrap Modal HTML element to open programatically
  onMount(() => {
    updateBeerModal = new Modal(updateBeerElement);
  });

  export let currentBeer: beer = null;
  export let session: number;
  let beer: beer = {
    id: '',
    session: null,
    name: '',
    brewery: '',
    abv: null,
    style: '',
    type: '',
    order: '',
    score: null,
    win: false,
    user: ''
  };

  // Update the session number when the data is received
  $: beer.session = session;

  $: {
    if (currentBeer != null && updateBeerModal != undefined) {
      // Pre-populate beer data when used to edit existing beer
      beer = currentBeer;
      updateBeerModal.show();
    }
  }

  // Require a session number to create a beer
  $: submitDisabled = beer.session ? false : true;
  // Only allow deletion if editing an existing beer
  $: deleteHidden = currentBeer ? false : true;

  function onSubmit() {
    if (!currentBeer) {
      beer.id = newBeerId();
    }
    updateBeer(beer);
    currentBeer = null;
  }

  function onDelete() {
    if (confirm('Delete this beer?')) {
      deleteBeer(beer.id);
    }
  }
</script>

<button
  type="button"
  class="btn btn-light mx-2"
  data-bs-toggle="modal"
  data-bs-target="#updateBeer"
>
  Add Beer
</button>

<div class="modal" tabindex="-1" id="updateBeer" bind:this={updateBeerElement}>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title m-0">{currentBeer ? 'Edit' : 'Add'} Beer</h3>
        <button type="button" class="btn-close" data-bs-dismiss="modal" />
      </div>
      <div class="modal-body">
        <form class="edit-form">
          <div class="row mb-3 align-items-center">
            <label for="session" class="col-sm-3 col-form-label">Session</label>
            <div class="col">
              <input id="session" bind:value={beer.session} class="form-control" type="number" />
            </div>
          </div>
          <div class="row mb-3 align-items-center">
            <label for="order" class="col-sm-3 col-form-label">Order</label>
            <div class="col">
              <input id="order" bind:value={beer.order} class="form-control" type="text" />
            </div>
          </div>
          <div class="row mb-3 align-items-center">
            <label for="user" class="col-sm-3 col-form-label">Member</label>
            <div class="col">
              <input id="user" bind:value={beer.user} class="form-control" type="text" />
            </div>
          </div>
          <div class="row mb-3 align-items-center">
            <label for="score" class="col-sm-3 col-form-label">Score</label>
            <div class="col">
              <input
                id="score"
                bind:value={beer.score}
                class="form-control"
                type="number"
                inputmode="decimal"
              />
            </div>
          </div>
          <div class="row mb-3 align-items-center">
            <label for="win" class="col-sm-3 col-form-label">Win</label>
            <div class="col">
              <input id="win" bind:checked={beer.win} class="form-check-input" type="checkbox" />
            </div>
          </div>
          <hr />
          <div class="row mb-3 align-items-center">
            <label for="name" class="col-sm-3 col-form-label">Beer Name</label>
            <div class="col">
              <input id="name" bind:value={beer.name} class="form-control" type="text" />
            </div>
          </div>
          <div class="row mb-3 align-items-center">
            <label for="brewery" class="col-sm-3 col-form-label">Brewery</label>
            <div class="col">
              <input id="brewery" bind:value={beer.brewery} class="form-control" type="text" />
            </div>
          </div>
          <div class="row mb-3 align-items-center">
            <label for="type" class="col-sm-3 col-form-label">Beer Type</label>
            <div class="col">
              <input id="type" bind:value={beer.type} class="form-control" type="text" />
            </div>
          </div>
          <div class="row mb-3 align-items-center">
            <label for="style" class="col-sm-3 col-form-label">Specific Type</label>
            <div class="col">
              <input id="style" bind:value={beer.style} class="form-control" type="text" />
            </div>
          </div>
          <div class="row mb-3 align-items-center">
            <label for="abv" class="col-sm-3 col-form-label">ABV</label>
            <div class="col">
              <input
                id="abv"
                bind:value={beer.abv}
                class="form-control"
                type="number"
                inputmode="decimal"
              />
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-light"
          on:click={onDelete}
          data-bs-dismiss="modal"
          hidden={deleteHidden}>Delete</button
        >
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
