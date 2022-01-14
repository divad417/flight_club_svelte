<script lang="ts">
  import { onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { user } from '$lib/stores';
  import { watchMember } from '$lib/firebase';
  import MemberInfo from '$lib/MemberInfo.svelte';
  import BeerList from '$lib/BeerList.svelte';
  import UpdateProfile from '$lib/UpdateProfile.svelte';

  let member: any = { name: null };
  let id: string = $page.params.memberId;

  // Get member from the database and watch for changes
  const unsubscribe = watchMember(id, (update: any) => {
    member = update;
  });

  onDestroy(unsubscribe);
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
