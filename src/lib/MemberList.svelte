<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { user, userView, usersToCsv } from '$lib/models';
  import type { Unsubscribe } from '@firebase/util';

  // Component props
  export let sortKey: string = null;
  export let ascending: boolean = true;

  let members: any[] = [];
  let memberList: user[] = [];
  const onUpdate = (update: any[]) => {
    members = update;
  };
  let unsubscribe: Unsubscribe;

  onMount(async () => {
    // Using dynamic imports here because of https://github.com/sveltejs/kit/issues/1650
    const firebase = await import('$lib/firebase');
    
    // Get users from the database and watch for changes
    unsubscribe = firebase.watchUsers(onUpdate);
  });
  onDestroy(() => unsubscribe());

  // Handle user inputs to re-sort, triggers the reactive block below
  function onClickColumn(key: string) {
    if (key == sortKey) {
      ascending = !ascending;
    } else {
      sortKey = key;
    }
  }

  // Reactive block which re-runs when the sort type changes
  $: {
    function compare(a: user, b: user) {
      if (a[sortKey] > b[sortKey]) {
        return ascending ? 1 : -1;
      } else if (a[sortKey] < b[sortKey]) {
        return ascending ? -1 : 1;
      } else {
        return 0;
      }
    }
    memberList = members.sort(compare);
  }

  function onClickMember(user: user) {
    // Goto a specific member page
    goto(`/member/${user.id}`);
  }
</script>

<div class="table-div">
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        {#each userView as field}
          <th width={field.width} on:click={() => onClickColumn(field.key)}>
            {field.text}
            {#if field.key == sortKey}
              <span class="arrow">
                {#if ascending}
                  &#x25B2;
                {:else}
                  &#x25BC;
                {/if}
              </span>
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each memberList as member}
        <tr>
          {#each userView as field}
            <td on:click={() => onClickMember(member)}>{field.show(member)}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
<button type="button" class="btn btn-light mx-2" on:click={() => usersToCsv(members)}
  >Download as CSV</button
>

<style>
  .arrow {
    color: #116466;
  }
  .table-div {
    overflow: auto;
  }
  table {
    width: 100%;
    overflow: auto;
    table-layout: fixed;
  }
  th {
    text-align: left;
  }
</style>
