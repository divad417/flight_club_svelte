<script lang="ts">
  import { onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { onSnapshot, doc } from 'firebase/firestore';
  import { db, auth } from '$lib/firebase';
  import MemberInfo from '$lib/MemberInfo.svelte';
  import BeerList from '$lib/BeerList.svelte';
  import UpdateProfile from '$lib/UpdateProfile.svelte';

  let user: any = { name: null };
  let id: string = $page.params.userId;

  const unsubscribe = onSnapshot(doc(db, 'users', id), (snapshot) => {
    user = snapshot.data();
    user.id = snapshot.id;
  });
  onDestroy(unsubscribe);
</script>

<svelte:head>
  <title>FC &#183; {user.full_name ?? 'Member'}</title>
</svelte:head>

<h1>{user.name}</h1>
<MemberInfo {user} />
{#if id == auth.currentUser.uid}
  <UpdateProfile {user} />
{/if}
<h1>Beers</h1>
<BeerList filterKey="user" filterValue={user.name} searchable={false} />
