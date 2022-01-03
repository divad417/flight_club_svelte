<script lang="ts">
  import { onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onSnapshot, doc } from 'firebase/firestore';
  import { db, deleteSession } from '$lib/firebase';
  import type { beer } from '$lib/models';
  import SessionInfo from '$lib/SessionInfo.svelte';
  import Recap from '$lib/Recap.svelte';
  import UpdateBeer from '$lib/UpdateBeer.svelte';
  import BeerList from '$lib/BeerList.svelte';
  import UpdateSession from '$lib/UpdateSession.svelte';
  import Photos from '$lib/Photos.svelte';
  import UserNotes from '$lib/UserNotes.svelte';

  let id: string = $page.params.sessionId;
  let session: any = { number: null };
  let currentBeer: beer = null;

  // Get the session data and watch for changes
  const unsubscribe = onSnapshot(doc(db, 'sessions', id), (snapshot) => {
    session = snapshot.data();
    session.id = snapshot.id;
  });
  onDestroy(unsubscribe);

  function onDelete() {
    if (confirm(`Delete session ${session.number}?`)) {
      deleteSession(id);
      goto('/sessions');
    }
  }

  function beerClick(event: CustomEvent) {
    currentBeer = event.detail;
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
<UpdateBeer {currentBeer} session={session.number} />
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
