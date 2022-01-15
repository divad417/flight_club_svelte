<script lang="ts">
  import type { Beer, Session } from '$lib/models';
  import { onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { user, activeClub } from '$lib/stores';
  import { watchSession, deleteSession } from '$lib/firebase';
  import SessionInfo from '$lib/SessionInfo.svelte';
  import Recap from '$lib/Recap.svelte';
  import UpdateBeer from '$lib/UpdateBeer.svelte';
  import BeerList from '$lib/BeerList.svelte';
  import UpdateSession from '$lib/UpdateSession.svelte';
  import Photos from '$lib/Photos.svelte';
  import UserNotes from '$lib/UserNotes.svelte';

  let id: string = $page.params.sessionId;
  let session: Session;

  // Leave the page if active club changes, use subscribe instead of $: for immediate effect
  const unsubscribeClub = activeClub.subscribe(() => {
    if (session) {
      goto('/sessions');
    }
  });

  // Get the session data and watch for changes
  const unsubscribeSession = watchSession(id, (update: any) => {
    session = update;
  });

  onDestroy(() => {
    unsubscribeSession();
    unsubscribeClub();
  });

  function onDelete() {
    if (confirm(`Delete session ${session.number}?`)) {
      deleteSession(session.id);
      goto('/sessions');
    }
  }

  // Link the BeerList and UpdateBeer components for editing existing beers
  let openBeerEditor: (data: Beer) => void;
  function beerClick(event: CustomEvent) {
    if ($user.roles.editor) {
      openBeerEditor(event.detail);
    }
  }
</script>

<svelte:head>
  <title>FC &#183; Session {session ? session.number : ''}</title>
</svelte:head>

<h1>Session {session ? session.number : ''}</h1>
{#if session}
  <SessionInfo {session} />

  <h3>Recap</h3>
  <Recap bind:session />

  <h3>Beers</h3>
  {#if $user.roles.editor}
    <UpdateBeer bind:openBeerEditor session={session.number} />
    <span class="text-muted">(edit by selecting below)</span>
  {/if}
  <BeerList
    filterKey="session"
    sortKey="order"
    filterValue={session.number}
    editable={true}
    on:beerClick={beerClick}
  />

  <h3>Photos</h3>
  <Photos {session} />
  <hr />
  {#if $user.roles.editor}
    <UpdateSession {session} />
    <button class="btn btn-light mx-2" on:click={onDelete}>Delete Session</button>
    <hr />

    <h3>User Notes</h3>
    <UserNotes sessionId={id} />
  {/if}
{/if}
