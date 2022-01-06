<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import type { user } from '$lib/models';
  import type { Unsubscribe } from '@firebase/util';
  import MemberInfo from '$lib/MemberInfo.svelte';
  import BeerList from '$lib/BeerList.svelte';
  import UpdateProfile from '$lib/UpdateProfile.svelte';

  let user: any = { name: null };
  let id: string = $page.params.userId;

  const onUpdate = (update: any) => {
    user = update;
  };
  let unsubscribe: Unsubscribe;

  onMount(async () => {
    const firebase = await import('$lib/firebase');

    user = firebase.currentUser();
    // Get user from the database and watch for changes
    unsubscribe = firebase.watchUser(id, onUpdate);
  });
  onDestroy(() => unsubscribe());
</script>

<svelte:head>
  <title>FC &#183; {user.full_name ?? 'Member'}</title>
</svelte:head>

<h1>{user.name}</h1>
<MemberInfo {user} />
{#if id == user.id}
  <UpdateProfile {user} />
{/if}
<h1>Beers</h1>
<BeerList filterKey="user" filterValue={user.name} searchable={false} />
