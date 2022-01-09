<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import type { Unsubscribe } from '@firebase/util';
  import { user } from '$lib/stores';
  import MemberInfo from '$lib/MemberInfo.svelte';
  import BeerList from '$lib/BeerList.svelte';
  import UpdateProfile from '$lib/UpdateProfile.svelte';

  let member: any = { name: null };
  let id: string = $page.params.memberId;

  const onUpdate = (update: any) => {
    member = update;
  };
  let unsubscribe: Unsubscribe;

  onMount(async () => {
    const { watchMember } = await import('$lib/firebase');

    // Get member from the database and watch for changes
    unsubscribe = watchMember(id, onUpdate);
  });
  onDestroy(() => unsubscribe());
</script>

<svelte:head>
  <title>FC &#183; {member.full_name ?? 'Member'}</title>
</svelte:head>

<h1>{member.name}</h1>
<MemberInfo {member} />
{#if id == $user.id || $user.roles.admin}
  <UpdateProfile bind:member />
{/if}
<h1>Beers</h1>
<BeerList filterKey="user" filterValue={member.name} searchable={false} />
