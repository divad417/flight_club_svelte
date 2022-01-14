<script lang="ts">
  import type { Club } from '$lib/models';
  import { clubs, activeClub } from '$lib/stores';
</script>

<div class="list-group">
  {#each $clubs as club}
    <a
      href="/"
      class="list-group-item list-group-item-action"
      class:active={club == $activeClub}
      on:click={() => ($activeClub = club.id)}
    >
      {club.name}
    </a>
  {/each}
  <p class="form-text">Your club(s)</p>
</div>

<style>
  div {
    max-width: 300px;
    margin: 30px auto;
  }
  p {
    text-align: right;
    padding: 4px;
    margin: 0;
  }
  .list-group-item.active {
    background-color: #ffda7b;
    border-color: #ffda7b;
    color: #222;
  }
</style>
