<script lang="ts">
  import { user, activeClub } from '#lib/stores.js';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { leaveClub } from '#lib/firebase.js';
  import UpdateClub from '#lib/UpdateClub.svelte';
  import MemberList from '#lib/MemberList.svelte';

  async function onLeaveClub() {
    if (confirm(`Leave ${$activeClub.name}?`)) {
      await leaveClub($user.id, $activeClub);
      activeClub.set($user.clubs[0]);
            goto(resolve('/(app)'));
    }
  }
</script>

<svelte:head>
  <title>FC &#183; {$activeClub.name}</title>
</svelte:head>

<h1>{$activeClub.name}</h1>
{#if $user.roles.editor}
  <UpdateClub />
{/if}
<button type="button" class="btn btn-light" on:click={onLeaveClub}>Leave Club</button>
<MemberList />
