<script lang="ts">
  import { onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { user, activeClub } from '$lib/stores';
  import { watchMember } from '$lib/firebase';
  import MemberInfo from '$lib/MemberInfo.svelte';
  import BeerList from '$lib/BeerList.svelte';
  import UpdateProfile from '$lib/UpdateProfile.svelte';
  import ClubList from '$lib/ClubList.svelte';

  let member: any = { name: null };
  let id: string = $page.params.memberId;
  let clubId: string;

  // Leave the page if active club changes, use subscribe instead of $: for immediate effect
  const unsubscribeClub = activeClub.subscribe((update) => {
    if (
      id != $user.id && // For logged in user, all clubs will be valid
      clubId && // Only leave if page is already populated
      update.id != clubId  // Only leave if there is actually a change to the activeClub
    ) { 
      goto('/members');
    }
    clubId = update.id;
  });

  // Get member from the database and watch for changes
  const unsubscribeMember = watchMember(id, (update: any) => {
    member = update;
  });

  onDestroy(() => {
    unsubscribeClub();
    unsubscribeMember();
  });
</script>

<svelte:head>
  <title>FC &#183; {member.full_name ?? 'Member'}</title>
</svelte:head>

<h1>{member.name}</h1>
<MemberInfo {member} />
<ClubList goOnClick={false} />
{#if id == $user.id || $user.roles.admin}
  <UpdateProfile bind:member />
{/if}
<h1>Beers</h1>
<BeerList filterKey="user" filterValue={member.name} />
