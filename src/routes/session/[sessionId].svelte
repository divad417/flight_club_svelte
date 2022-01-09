<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import type { Beer } from '$lib/models';
  import type { Unsubscribe } from '@firebase/util';
  import SessionInfo from '$lib/SessionInfo.svelte';
  import Recap from '$lib/Recap.svelte';
  import UpdateBeer from '$lib/UpdateBeer.svelte';
  import BeerList from '$lib/BeerList.svelte';
  import UpdateSession from '$lib/UpdateSession.svelte';
  import Photos from '$lib/Photos.svelte';
  import UserNotes from '$lib/UserNotes.svelte';

  let id: string = $page.params.sessionId;
  let session: any = { number: null };
  let onDelete: () => void;

  const onUpdate = (update: any) => {
    session = update;
  };
  let unsubscribe: Unsubscribe;

  onMount(async () => {
    const { watchSession, deleteSession } = await import('$lib/firebase');

    // Get the session data and watch for changes
    unsubscribe = watchSession(id, onUpdate);
    
    onDelete = () => {
      if (confirm(`Delete session ${session.number}?`)) {
        deleteSession(session.id);
        goto('/sessions');
      }
    };
  });
  onDestroy(() => unsubscribe());

  // Link things to allow clicking beers to edit them
  let openBeerEditor: (data: Beer) => void;
  function beerClick(event: CustomEvent) {
    openBeerEditor(event.detail);
  }
</script>

<svelte:head>
  <title>FC &#183; Session {session.number ?? ''}</title>
</svelte:head>

<h1>Session {session.number ?? ''}</h1>
<SessionInfo {session} />
<h3>Recap</h3>
<Recap bind:session />
<h3>Beers</h3>
<UpdateBeer bind:openBeerEditor session={session.number} />
<span class="text-muted">(edit by selecting below)</span>
<BeerList
  filterKey="session"
  sortKey="order"
  filterValue={session.number}
  editable={true}
  on:beerClick={beerClick}
  searchable={false}
/>
<h3>Photos</h3>
<Photos {session} />
<hr />
<UpdateSession {session} />
<button class="btn btn-light mx-2" on:click={onDelete}>Delete Session</button>
<hr />
<h3>User Notes</h3>
<UserNotes sessionId={id} />
